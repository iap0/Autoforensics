import os
import json
import csv
from typing import Any, Dict, List
from werkzeug.utils import secure_filename


class FileHandler:
    """Utility class for handling file operations"""
    
    def __init__(self, upload_folder: str):
        self.upload_folder = upload_folder
        self.allowed_extensions = {'csv', 'json', 'txt', 'log', 'pcap'}
        
    def allowed_file(self, filename: str) -> bool:
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.allowed_extensions
    
    def get_file_extension(self, filename: str) -> str:
        """Get file extension"""
        return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    
    def read_json_file(self, filepath: str) -> Dict:
        """Read JSON file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            raise ValueError(f"Error reading JSON file: {str(e)}")
    
    def read_csv_file(self, filepath: str) -> List[Dict]:
        """Read CSV file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                return list(reader)
        except Exception as e:
            raise ValueError(f"Error reading CSV file: {str(e)}")
    
    def read_text_file(self, filepath: str) -> List[str]:
        """Read text or log file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.readlines()
        except Exception as e:
            raise ValueError(f"Error reading text file: {str(e)}")
    
    def get_file_info(self, filepath: str) -> Dict:
        """Get file information"""
        try:
            stats = os.stat(filepath)
            return {
                'size': stats.st_size,
                'created': stats.st_ctime,
                'modified': stats.st_mtime,
                'extension': self.get_file_extension(filepath)
            }
        except Exception as e:
            raise ValueError(f"Error getting file info: {str(e)}")
    
    def cleanup_old_files(self, max_age_hours: int = 24):
        """Remove files older than specified hours"""
        import time
        current_time = time.time()
        
        for filename in os.listdir(self.upload_folder):
            filepath = os.path.join(self.upload_folder, filename)
            if os.path.isfile(filepath):
                file_age = current_time - os.path.getmtime(filepath)
                if file_age > (max_age_hours * 3600):
                    try:
                        os.remove(filepath)
                    except Exception as e:
                        print(f"Error removing old file {filename}: {str(e)}")