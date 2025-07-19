

from django.contrib import admin
from .models import Product, ProductOrder

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "farmer", "price", "available", "created_at")

@admin.register(ProductOrder)
class ProductOrderAdmin(admin.ModelAdmin):
    list_display = ("product", "buyer", "status", "created_at", "updated_at")
