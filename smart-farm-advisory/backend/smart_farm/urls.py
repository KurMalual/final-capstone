"""
URL configuration for smart_farm project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from django.views.static import serve
import os

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

@ensure_csrf_cookie
def csrf_token(request):
    """Get CSRF token for frontend"""
    return JsonResponse({'csrfToken': get_token(request)})

def home_view(request):
    return HttpResponse("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Smart Farm Advisory</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <h1>Smart Farm Advisory API</h1>
        <p>Backend is running successfully!</p>
        <ul>
            <li><a href="/admin/">Admin Panel</a></li>
            <li><a href="/api/products/">Products API</a></li>
            <li><a href="/api/users/">Users API</a></li>
        </ul>
    </body>
    </html>
    """)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', api_root, name='api_root'),
    path('api/csrf/', csrf_token, name='csrf_token'),
    path('api/auth/', include('users.auth_urls')),
    path('api/users/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path('api/equipment/', include('equipment.urls')),
    path('api/transports/', include('transports.urls')),
    path('api/weather/', include('weather.urls')),
    path('api/education/', include('education.urls')),
    
    # Serve React app for all other routes
    path('', home_view, name='home'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
