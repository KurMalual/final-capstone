from rest_framework import viewsets, permissions, views, response, status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from equipment.models import Equipment, EquipmentRentalRequest
from transport.models import Transport, TransportRequest
from marketplace.models import Product, ProductOrder

from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DashboardSummaryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(user, 'role', None)
        profile = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': role,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
        summary = {}
        recent = {}
        if role == 'farmer':
            summary = {
                'my_products': Product.objects.filter(farmer=user).count(),
                'my_orders': ProductOrder.objects.filter(product__farmer=user).count(),
                'my_equipment_rentals': EquipmentRentalRequest.objects.filter(farmer=user).count(),
                'my_transport_requests': TransportRequest.objects.filter(farmer=user).count(),
                'orders_pending': ProductOrder.objects.filter(product__farmer=user, status='pending').count(),
                'orders_approved': ProductOrder.objects.filter(product__farmer=user, status='approved').count(),
                'orders_rejected': ProductOrder.objects.filter(product__farmer=user, status='rejected').count(),
                'equipment_rentals_pending': EquipmentRentalRequest.objects.filter(farmer=user, status='pending').count(),
                'equipment_rentals_approved': EquipmentRentalRequest.objects.filter(farmer=user, status='approved').count(),
                'equipment_rentals_rejected': EquipmentRentalRequest.objects.filter(farmer=user, status='rejected').count(),
                'transport_requests_pending': TransportRequest.objects.filter(farmer=user, status='pending').count(),
                'transport_requests_approved': TransportRequest.objects.filter(farmer=user, status='approved').count(),
                'transport_requests_rejected': TransportRequest.objects.filter(farmer=user, status='rejected').count(),
            }
            recent = {
                'recent_orders': list(ProductOrder.objects.filter(product__farmer=user).order_by('-created_at')[:5].values('id','product__name','product__image','product__price','quantity','buyer__username','status','created_at')),
                'recent_equipment_rentals': list(EquipmentRentalRequest.objects.filter(farmer=user).order_by('-created_at')[:5].values('id','equipment__name','equipment__image','equipment__price_per_day','status','created_at')),
                'recent_transport_requests': list(TransportRequest.objects.filter(farmer=user).order_by('-created_at')[:5].values('id','transport__vehicle_name','transport__image','transport__price_per_trip','status','created_at')),
            }
        elif role == 'buyer':
            summary = {
                'available_products': Product.objects.filter(available=True).count(),
                'my_orders': ProductOrder.objects.filter(buyer=user).count(),
                'orders_pending': ProductOrder.objects.filter(buyer=user, status='pending').count(),
                'orders_approved': ProductOrder.objects.filter(buyer=user, status='approved').count(),
                'orders_rejected': ProductOrder.objects.filter(buyer=user, status='rejected').count(),
            }
            recent = {
                'recent_orders': list(ProductOrder.objects.filter(buyer=user).order_by('-created_at')[:5].values('id','product__name','product__image','product__price','quantity','status','created_at')),
            }
        elif role == 'equipment_seller':
            summary = {
                'my_equipment': Equipment.objects.filter(owner=user).count(),
                'rental_requests': EquipmentRentalRequest.objects.filter(equipment__owner=user).count(),
                'rental_requests_pending': EquipmentRentalRequest.objects.filter(equipment__owner=user, status='pending').count(),
                'rental_requests_approved': EquipmentRentalRequest.objects.filter(equipment__owner=user, status='approved').count(),
                'rental_requests_rejected': EquipmentRentalRequest.objects.filter(equipment__owner=user, status='rejected').count(),
            }
            recent = {
                'recent_rental_requests': list(EquipmentRentalRequest.objects.filter(equipment__owner=user).order_by('-created_at')[:5].values('id','equipment__name','equipment__image','equipment__price_per_day','farmer__username','status','created_at')),
            }
        elif role == 'transporter':
            summary = {
                'my_vehicles': Transport.objects.filter(owner=user).count(),
                'transport_requests': TransportRequest.objects.filter(transport__owner=user).count(),
                'transport_requests_pending': TransportRequest.objects.filter(transport__owner=user, status='pending').count(),
                'transport_requests_approved': TransportRequest.objects.filter(transport__owner=user, status='approved').count(),
                'transport_requests_rejected': TransportRequest.objects.filter(transport__owner=user, status='rejected').count(),
            }
            recent = {
                'recent_transport_requests': list(TransportRequest.objects.filter(transport__owner=user).order_by('-created_at')[:5].values('id','transport__vehicle_name','transport__image','transport__price_per_trip','farmer__username','status','created_at')),
            }
        else:
            summary = {'detail': 'Unknown or missing user role.'}
        return response.Response({'profile': profile, 'summary': summary, 'recent': recent}, status=status.HTTP_200_OK)


class DashboardSummaryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(user, 'role', None)
        data = {}
        if role == 'farmer':
            # Only show equipment and vehicles not owned by this user
            available_equipment = list(Equipment.objects.filter(available=True).exclude(owner=user).values('id', 'name', 'image', 'price_per_day', 'owner__username', 'description', 'available'))
            available_vehicles = list(Transport.objects.filter(available=True).exclude(owner=user).values('id', 'vehicle_name', 'image', 'price_per_trip', 'owner__username', 'available'))
            my_products = list(Product.objects.filter(farmer=user).values('id', 'name', 'image', 'price', 'available', 'created_at'))
            my_equipment_rentals = list(EquipmentRentalRequest.objects.filter(farmer=user).order_by('-created_at').values('id', 'equipment__name', 'equipment__image', 'equipment__price_per_day', 'status', 'created_at'))
            my_transport_requests = list(TransportRequest.objects.filter(farmer=user).order_by('-created_at').values('id', 'transport__vehicle_name', 'transport__image', 'transport__price_per_trip', 'pickup_location', 'delivery_location', 'cargo_details', 'status', 'created_at'))
            my_orders = list(ProductOrder.objects.filter(product__farmer=user).order_by('-created_at').values('id', 'product__name', 'product__image', 'product__price', 'quantity', 'buyer__username', 'status', 'created_at'))
            # Weather and education as before
            weather = None
            weather_debug = None
            try:
                from weather.models import WeatherData
                # Use 'timestamp' field instead of 'created_at' and filter for Juba specifically
                latest_weather = WeatherData.objects.filter(location__iexact='Juba').order_by('-timestamp').values('id', 'location', 'temperature', 'humidity', 'description', 'timestamp')[:1]
                weather = latest_weather[0] if latest_weather else None
                if not weather:
                    weather_debug = 'No local weather data found for Juba.'
            except Exception as e:
                weather_debug = f'Weather model import error: {str(e)}'
            if not weather:
                import requests
                from django.conf import settings
                api_key = getattr(settings, 'OPENWEATHER_API_KEY', None)
                city = 'Juba'
                if not api_key:
                    weather_debug = 'OPENWEATHER_API_KEY not set in settings.'
                else:
                    try:
                        url = 'http://api.openweathermap.org/data/2.5/weather'
                        params = {'q': city, 'appid': api_key, 'units': 'metric'}
                        resp = requests.get(url, params=params, timeout=5)
                        if resp.status_code == 200:
                            data = resp.json()
                            weather = {
                                'city': data.get('name'),
                                'temperature': data['main']['temp'],
                                'humidity': data['main']['humidity'],
                                'description': data['weather'][0]['description'],
                                'source': 'openweather',
                            }
                        else:
                            weather_debug = f'OpenWeather API error: {resp.status_code} {resp.text}'
                    except Exception as e:
                        weather_debug = f'OpenWeather API request error: {str(e)}'
            if not weather and weather_debug:
                weather = {'error': weather_debug}
            try:
                from education.models import EducationalResource
                education_contents = list(EducationalResource.objects.order_by('-created_at').values('id', 'title', 'resource_type', 'language', 'file', 'created_at')[:5])
            except Exception:
                education_contents = []
            data = {
                'available_equipment': available_equipment,
                'available_vehicles': available_vehicles,
                'my_products': my_products,
                'my_equipment_rentals': my_equipment_rentals,
                'my_transport_requests': my_transport_requests,
                'my_orders': my_orders,
                'weather': weather,
                'education_contents': education_contents,
            }
        elif role == 'buyer':
            # Only show products not owned by this user
            available_products = list(Product.objects.filter(available=True).exclude(farmer=user).values('id', 'name', 'image', 'price', 'farmer__username', 'created_at'))
            my_orders = list(ProductOrder.objects.filter(buyer=user).order_by('-created_at').values('id', 'product__name', 'product__image', 'product__price', 'quantity', 'status', 'created_at'))
            data = {
                'available_products': available_products,
                'my_orders': my_orders,
            }
        elif role == 'equipment_seller':
            # My equipment
            my_equipment = list(Equipment.objects.filter(owner=user).values('id', 'name', 'image', 'price_per_day', 'description', 'available'))
            # Rental requests for my equipment
            rental_requests = list(EquipmentRentalRequest.objects.filter(equipment__owner=user).order_by('-created_at').values('id', 'equipment__name', 'equipment__image', 'equipment__price_per_day', 'farmer__username', 'status', 'created_at'))
            data = {
                'my_equipment': my_equipment,
                'rental_requests': rental_requests,
            }
        elif role == 'transporter':
            # My vehicles
            my_vehicles = list(Transport.objects.filter(owner=user).values('id', 'vehicle_name', 'image', 'price_per_trip', 'available'))
            # Transport requests for my vehicles
            transport_requests = list(TransportRequest.objects.filter(transport__owner=user).order_by('-created_at').values('id', 'transport__vehicle_name', 'transport__image', 'transport__price_per_trip', 'farmer__username', 'pickup_location', 'delivery_location', 'cargo_details', 'status', 'created_at'))
            data = {
                'my_vehicles': my_vehicles,
                'transport_requests': transport_requests,
            }
        else:
            data = {'detail': 'Unknown or missing user role.'}
        return response.Response(data, status=status.HTTP_200_OK)


class LoginView(views.APIView):
    """
    Handle user login and return authentication token
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return response.Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return response.Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': getattr(user, 'role', None),
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            }, status=status.HTTP_200_OK)
        else:
            return response.Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class RegisterView(views.APIView):
    """
    Handle user registration
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        role = request.data.get('role', 'farmer')
        
        if not username or not email or not password:
            return response.Response(
                {'error': 'Username, email, and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            return response.Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(email=email).exists():
            return response.Response(
                {'error': 'Email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate role
        valid_roles = ['farmer', 'buyer', 'transporter', 'equipment_seller']
        if role not in valid_roles:
            return response.Response(
                {'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                role=role
            )
            token, created = Token.objects.get_or_create(user=user)
            
            return response.Response({
                'message': 'User registered successfully',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return response.Response(
                {'error': f'Registration failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(views.APIView):
    """
    Handle user logout by deleting the authentication token
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            # Delete the user's token
            request.user.auth_token.delete()
            return response.Response(
                {'message': 'Logged out successfully'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return response.Response(
                {'error': f'Logout failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
