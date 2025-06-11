# backend/smart_farm/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    """API root endpoint"""
    return JsonResponse({
        'message': 'Smart Farm Connect API',
        'version': '1.0',
        'endpoints': {
            'auth': '/api/auth/',
            'products': '/api/products/',
            'equipment': '/api/equipment/',
            'transports': '/api/transports/',
            'weather': '/api/weather/',
            'education': '/api/education/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    path('api/auth/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path('api/equipment/', include('equipment.urls')),
    path('api/transports/', include('transports.urls')),
    path('api/weather/', include('weather.urls')),
    path('api/education/', include('education.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)