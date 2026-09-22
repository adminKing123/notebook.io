from django.contrib import admin

from accounts.models import EmailOTP, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    ordering = ('email',)
    list_display = ('email', 'full_name', 'age', 'is_active', 'date_joined')
    search_fields = ('email', 'full_name')
    readonly_fields = ('date_joined', 'last_login')


@admin.register(EmailOTP)
class EmailOTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'purpose', 'code', 'expires_at', 'created_at')
    search_fields = ('email', 'code')
    readonly_fields = ('created_at',)
