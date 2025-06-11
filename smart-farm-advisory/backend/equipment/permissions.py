from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners to edit their own equipment.
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for equipment sellers
        return request.user.role == 'equipment_seller'
    
    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for the owner
        return obj.owner == request.user

class IsRequesterOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow requesters to edit their own requests.
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
        
        # Write permissions only for the requester
        return obj.requester == request.user
