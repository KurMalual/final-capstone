from django.utils.deprecation import MiddlewareMixin

class CSRFExemptMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Exempt API endpoints from CSRF
        if request.path.startswith('/api/auth/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
