from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import json

from forensics.sybil_attack import SybilAttackDetector
from forensics.position_falsification import PositionFalsificationDetector
from utils.pdf_generator import PDFReportGenerator
from utils.file_handler import FileHandler
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize components
file_handler = FileHandler(app.config['UPLOAD_FOLDER'])
pdf_generator = PDFReportGenerator()

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and file_handler.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_filename = f"{timestamp}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            file.save(filepath)
            
            return jsonify({
                'success': True,
                'filename': unique_filename,
                'original_filename': filename,
                'message': 'File uploaded successfully'
            }), 200
        else:
            return jsonify({'error': 'Invalid file type'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analyze/sybil', methods=['POST'])
def analyze_sybil_attack():
    """Analyze file for Sybil attack"""
    try:
        data = request.get_json()
        filename = data.get('filename')
        
        if not filename:
            return jsonify({'error': 'No filename provided'}), 400
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404
        
        # Initialize detector
        detector = SybilAttackDetector()
        
        # Perform analysis
        analysis_results = detector.analyze(filepath)
        
        # Generate report data
        report_data = {
            'attack_type': 'Sybil Attack',
            'filename': data.get('original_filename', filename),
            'timestamp': datetime.now().isoformat(),
            'analysis_results': analysis_results,
            'report_id': f"SYBIL_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
        
        return jsonify({
            'success': True,
            'report': report_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analyze/position', methods=['POST'])
def analyze_position_falsification():
    """Analyze file for Position Falsification"""
    try:
        data = request.get_json()
        filename = data.get('filename')
        
        if not filename:
            return jsonify({'error': 'No filename provided'}), 400
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404
        
        # Initialize detector
        detector = PositionFalsificationDetector()
        
        # Perform analysis
        analysis_results = detector.analyze(filepath)
        
        # Generate report data
        report_data = {
            'attack_type': 'Position Falsification',
            'filename': data.get('original_filename', filename),
            'timestamp': datetime.now().isoformat(),
            'analysis_results': analysis_results,
            'report_id': f"POSITION_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
        
        return jsonify({
            'success': True,
            'report': report_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/download/pdf/<report_type>', methods=['POST'])
def download_pdf_report(report_type):
    """Generate and download PDF report"""
    try:
        data = request.get_json()
        report_data = data.get('report')
        
        if not report_data:
            return jsonify({'error': 'No report data provided'}), 400
        
        # Generate PDF
        pdf_path = pdf_generator.generate_report(report_data, report_type)
        
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"Autoforensics_{report_type}_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/cleanup/<filename>', methods=['DELETE'])
def cleanup_file(filename):
    """Clean up uploaded file after analysis"""
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if os.path.exists(filepath):
            os.remove(filepath)
            return jsonify({'success': True, 'message': 'File deleted'}), 200
        else:
            return jsonify({'error': 'File not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)