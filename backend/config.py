import os
from datetime import timedelta

class Config:
    """Application configuration"""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here-change-in-production'
    DEBUG = os.environ.get('DEBUG', 'True') == 'True'
    
    # File upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max file size
    ALLOWED_EXTENSIONS = {'csv', 'json', 'txt', 'log', 'pcap'}
    
    # Report settings
    REPORT_FOLDER = os.path.join(os.path.dirname(__file__), 'reports')
    
    # Session settings
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    
    # CORS settings
    CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']
    
    # Analysis settings
    ANALYSIS_TIMEOUT = 300  # 5 minutes timeout for analysis
    
    # Logging
    LOG_LEVEL = 'INFO'
    LOG_FILE = 'autoforensics.log'