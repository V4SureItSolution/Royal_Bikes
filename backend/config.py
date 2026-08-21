import os
from datetime import timedelta
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate

load_dotenv()

# Instantiate shared Flask extensions
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()
cors = CORS()
migrate = Migrate()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'royalbikes-default-secret-key-2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'royalbikes-jwt-default-key-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Database URI
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///royalbikes.db')
    
    # Upload directories
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    APP_UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = False


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_SECRET_KEY = 'test-jwt-secret-key-2026'


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
