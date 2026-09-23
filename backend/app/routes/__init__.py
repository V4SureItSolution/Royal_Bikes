from app.routes.auth_routes import auth_bp
from app.routes.user_routes import user_bp
from app.routes.product_routes import product_bp
from app.routes.customer_routes import customer_bp

__all__ = ['auth_bp', 'user_bp', 'product_bp', 'customer_bp']
