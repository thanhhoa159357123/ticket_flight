# utils/logger.py
import logging
import os

log_file_path = "khach_hang_updates.log"

# Nếu chưa có file, tự tạo và ghi dòng đầu
if not os.path.exists(log_file_path):
    with open(log_file_path, "w", encoding="utf-8") as f:
        f.write("=== LỊCH SỬ CẬP NHẬT KHÁCH HÀNG ===\n")

logger = logging.getLogger("khach_hang_admin_log")
logger.setLevel(logging.INFO)

file_handler = logging.FileHandler(log_file_path, encoding="utf-8")
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
file_handler.setFormatter(formatter)

# Đảm bảo không thêm nhiều handler khi reload
if not logger.hasHandlers():
    logger.addHandler(file_handler)
