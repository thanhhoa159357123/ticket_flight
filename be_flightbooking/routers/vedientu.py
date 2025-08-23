from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from models.vedientu import VeDienTu
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from datetime import datetime
from utils.email_sender import send_email_with_attachments
from reportlab.pdfgen import canvas  # type: ignore
from reportlab.lib.pagesizes import A4  # type: ignore
import uuid
from reportlab.lib import colors  # type: ignore
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle  # type: ignore
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image  # type: ignore
from io import BytesIO
import qrcode  # type: ignore
import os

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
ve_dien_tu_collection = db["vedientu"]
dat_ve_collection = db["datve"]


# ✅ Hàm tạo PDF cho 1 hành khách
def generate_pdf(ma_ve_dien_tu: str, ma_dat_ve: str, pnr: str, filepath: str, hanh_khach: dict):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    # ===== Tieu de =====
    title_style = ParagraphStyle(
        name="Title",
        parent=styles["Heading1"],
        alignment=1,
        fontSize=18,
        leading=24,
        textColor=colors.HexColor("#0073e6")
    )
    elements.append(Paragraph("Ve dien tu - He thong dat ve may bay H&T", title_style))
    elements.append(Spacer(1, 12))

    # ===== Thong tin ve =====
    ticket_info = [
        ["Ma ve dien tu:", f"{ma_ve_dien_tu}"],
        ["Ma dat ve:", f"{ma_dat_ve}"],
        ["Ma PNR:", f"{pnr}"]
    ]
    table = Table(ticket_info, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e6f2ff")),
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#0073e6")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 12),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.black)
    ]))
    elements.append(Paragraph("Thong tin ve:", styles["Heading3"]))
    elements.append(table)
    elements.append(Spacer(1, 16))

    # ===== Thong tin hanh khach =====
    ten = f"{hanh_khach.get('danh_xung', '')} {hanh_khach.get('ho_hanh_khach', '')} {hanh_khach.get('ten_hanh_khach', '')}".strip()
    eticket = hanh_khach.get("eticket", "")
    passenger_info = [
        ["Ho ten:", ten],
        ["So ve (ETicket):", f"{eticket}"]
    ]
    table_passenger = Table(passenger_info, colWidths=[150, 300])
    table_passenger.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e6ffe6")),
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#2eb82e")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 12),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.black)
    ]))
    elements.append(Paragraph("Thong tin hanh khach:", styles["Heading3"]))
    elements.append(table_passenger)
    elements.append(Spacer(1, 20))

    # ===== QR Code =====
    qr_img = qrcode.make(eticket)
    qr_buffer = BytesIO()
    qr_img.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)
    qr = Image(qr_buffer, width=100, height=100)
    elements.append(Paragraph("Ma QR de check-in:", styles["Heading3"]))
    elements.append(qr)
    elements.append(Spacer(1, 20))

    # ===== Loi cam on =====
    thank_style = ParagraphStyle(
        name="Thanks",
        parent=styles["Normal"],
        alignment=1,
        fontSize=12,
        textColor=colors.HexColor("#444444")
    )
    elements.append(Paragraph("Cam on quy khach da su dung dich vu cua H&T!", thank_style))

    doc.build(elements)

@router.get("/ve-dien-tu/{ma_dat_ve}", tags=["ve_dien_tu"])
def get_ve_dien_tu(ma_dat_ve: str):
    try:
        df = load_df("vedientu")
        df_filtered = df.filter(df["ma_dat_ve"] == ma_dat_ve)

        if df_filtered.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy vé điện tử")

        result_json = df_filtered.toJSON().collect()
        return JSONResponse(content=result_json)

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Lỗi get_ve_dien_tu:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# ✅ API tạo và gửi vé điện tử cho từng hành khách
@router.post("/send-full", tags=["ve_dien_tu"])
async def create_and_send_ve_dien_tu(
    ma_dat_ve: str = Query(...), email: str = Query(...)
):
    try:
        # 1. Kiểm tra mã đặt vé
        if not dat_ve_collection.find_one({"ma_dat_ve": ma_dat_ve}):
            raise HTTPException(status_code=404, detail="❌ Mã đặt vé không tồn tại")

        # 2. Lấy chi tiết đặt vé
        chitiet = db["chitietdatve"].find_one({"ma_dat_ve": ma_dat_ve})
        if not chitiet:
            raise HTTPException(
                status_code=404, detail="❌ Không tìm thấy chi tiết đặt vé"
            )

        ma_hanh_khach_list = chitiet.get("ma_hanh_khach", [])
        danh_sach_hanh_khach = list(
            db["hanhkhach"].find({"ma_hanh_khach": {"$in": ma_hanh_khach_list}})
        )

        # 3. Tạo PNR chung
        pnr = "VN" + uuid.uuid4().hex[:6].upper()

        # 4. Duyệt từng hành khách => tạo vé, PDF, lưu DB
        attachments = []
        for hk in danh_sach_hanh_khach:
            ma_ve_dien_tu = f"VT{uuid.uuid4().hex[:8].upper()}"
            eticket = f"ET{uuid.uuid4().hex[:10].upper()}"
            hk["eticket"] = eticket

            # 📄 Tạo PDF riêng cho từng hành khách
            pdf_path = f"files/vedientu/{ma_dat_ve}_{hk['ma_hanh_khach']}.pdf"
            generate_pdf(ma_ve_dien_tu, ma_dat_ve, pnr, pdf_path, hk)

            # 💾 Lưu mỗi vé điện tử vào MongoDB
            doc = VeDienTu(
                ma_ve_dien_tu=ma_ve_dien_tu,
                ma_dat_ve=ma_dat_ve,
                pnr=pnr,
                eticket_number=eticket,
                qr_code_base64="data:image/png;base64,dummy",
                issued_at=datetime.utcnow(),
                status="Đã gửi",
                pdf_url=pdf_path,
                note=f"Vé của {hk['ho_hanh_khach']} {hk['ten_hanh_khach']}",
            )
            ve_dien_tu_collection.insert_one(doc.dict())

            # Thêm file PDF vào attachments
            with open(pdf_path, "rb") as f:
                attachments.append(
                    {
                        "filename": f"VeDienTu_{hk['ten_hanh_khach']}.pdf",
                        "data": f.read(),
                    }
                )

        # Xóa cache cũ
        invalidate_cache("vedientu")

        # 5. Gửi email kèm tất cả PDF
        subject = "✈️ Vé điện tử từ hệ thống đặt vé H&T"
        body = f"""
        Xin chào,

        Đây là vé điện tử của bạn với mã đặt vé: {ma_dat_ve}
        Mã PNR: {pnr}

        Vui lòng kiểm tra các file đính kèm để xem thông tin từng hành khách.

        Trân trọng,
        Hệ thống đặt vé H&T
        """

        # Gửi file một trong cùng một email
        await send_email_with_attachments(
            to_email=email, subject=subject, body=body, attachments=attachments
        )

        return {
            "message": "✅ Tạo và gửi vé điện tử thành công",
            "ma_dat_ve": ma_dat_ve,
        }

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Lỗi gửi email:", e)
        raise HTTPException(
            status_code=500, detail="❌ Lỗi hệ thống khi tạo hoặc gửi vé điện tử"
        )
