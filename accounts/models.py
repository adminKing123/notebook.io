from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'date_of_birth']

    def __str__(self):
        return self.email


class EmailOTP(models.Model):
    PURPOSE_SIGNUP = 'signup'
    PURPOSE_PASSWORD_RESET = 'password_reset'

    email = models.EmailField()
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=32, default=PURPOSE_SIGNUP)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['email', 'purpose']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.email} ({self.purpose})'
