import aiosmtplib  # type: ignore
from email.message import EmailMessage
from conf.email_config import EMAIL_CONFIG  # type: ignore

async def send_email_with_attachments(
    to_email: str, subject: str, body: str, attachments: list
):
    """
    Gửi email với nhiều file đính kèm.
    :param to_email: Email người nhận
    :param subject: Tiêu đề email
    :param body: Nội dung email
    :param attachments: Danh sách [{filename, data}]
    """
    message = EmailMessage()
    message["From"] = f"{EMAIL_CONFIG['MAIL_FROM_NAME']} <{EMAIL_CONFIG['MAIL_FROM']}>"
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    # Đính kèm nhiều file PDF
    for attachment in attachments:
        message.add_attachment(
            attachment["data"],
            maintype="application",
            subtype="pdf",
            filename=attachment["filename"],
        )

    # Gửi mail
    await aiosmtplib.send(
        message,
        hostname=EMAIL_CONFIG["MAIL_SERVER"],
        port=EMAIL_CONFIG["MAIL_PORT"],
        username=EMAIL_CONFIG["MAIL_USERNAME"],
        password=EMAIL_CONFIG["MAIL_PASSWORD"],
        start_tls=EMAIL_CONFIG["USE_TLS"],
    )
