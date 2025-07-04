from rest_framework import permissions

class IsSellerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow sellers to edit their own products.
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for farmers
        return request.user.role == 'farmer'
    
    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for the owner
        return obj.seller == request.user

class IsBuyerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow buyers to create orders.
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for buyers
        return request.user.role == 'buyer'
    
    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for the buyer who created the order
        return obj.buyer == request.user
