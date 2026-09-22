from django.conf import settings
from django.core.mail import send_mail


def _send_otp_email(*, email: str, code: str, subject: str, intro: str) -> None:
    message = (
        f'{intro}\n\n'
        f'Your verification code is: {code}\n\n'
        f'This code expires in {settings.OTP_EXPIRY_MINUTES} minutes.\n\n'
        'If you did not request this, you can ignore this email.'
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )


def send_signup_otp_email(*, email: str, code: str) -> None:
    _send_otp_email(
        email=email,
        code=code,
        subject='Verify your Personal Diary account',
        intro='Thanks for signing up for Personal Diary.',
    )


def send_password_reset_otp_email(*, email: str, code: str) -> None:
    _send_otp_email(
        email=email,
        code=code,
        subject='Reset your Personal Diary password',
        intro='We received a request to reset your Personal Diary password.',
    )
