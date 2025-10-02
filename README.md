# Autoforensics - Smart Vehicular Forensics Tool

Advanced forensic analysis tool for detecting security threats in smart vehicular networks.

## Features

- **Sybil Attack Detection**: Identify malicious nodes creating multiple fake identities
- **Position Falsification Detection**: Detect vehicles broadcasting false GPS coordinates
- **Automated Analysis**: Python-based backend for comprehensive forensic investigation
- **PDF Report Generation**: Professional forensic reports with detailed findings
- **Modern Web Interface**: React-based frontend with intuitive user experience

## Project Structure

```
autoforensics/
├── backend/
│   ├── app.py                          # Flask application
│   ├── config.py                       # Configuration
│   ├── requirements.txt                # Python dependencies
│   ├── forensics/
│   │   ├── __init__.py
│   │   ├── sybil_attack.py            # Sybil detection logic
│   │   └── position_falsification.py  # Position detection logic
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── file_handler.py            # File operations
│   │   └── pdf_generator.py           # PDF generation
│   └── uploads/                        # Temporary file storage
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                     # Main component
│   │   ├── index.js                   # Entry point
│   │   ├── index.css                  # Global styles
│   │   └── services/
│   │       └── api.js                 # API service
│   └── package.json
└── README.md
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create necessary directories:
```bash
mkdir uploads reports
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start Backend Server

```bash
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Upload File**: Select a forensic data file (CSV, JSON, TXT, LOG)
2. **Choose Analysis**: Select either Sybil Attack or Position Falsification analysis
3. **Review Results**: Examine detailed findings and threat indicators
4. **Download Report**: Export comprehensive PDF forensic report

## Implementing Your Investigation Logic

### Sybil Attack Detection

Edit `backend/forensics/sybil_attack.py`:

```python
def analyze(self, filepath: str) -> Dict[str, Any]:
    # Your investigation logic here
    # 1. Extract vehicle identities
    # 2. Analyze identity patterns
    # 3. Check for duplicate behaviors
    # 4. Calculate threat level
    pass
```

### Position Falsification Detection

Edit `backend/forensics/position_falsification.py`:

```python
def analyze(self, filepath: str) -> Dict[str, Any]:
    # Your investigation logic here
    # 1. Extract GPS data
    # 2. Validate coordinates
    # 3. Analyze movement patterns
    # 4. Detect impossible movements
    pass
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/upload` - Upload file for analysis
- `POST /api/analyze/sybil` - Analyze for Sybil attack
- `POST /api/analyze/position` - Analyze for position falsification
- `POST /api/download/pdf/<type>` - Download PDF report
- `DELETE /api/cleanup/<filename>` - Clean up uploaded file

## Configuration

Edit `backend/config.py` to modify:
- Upload folder location
- Maximum file size
- Allowed file extensions
- Session timeout
- CORS origins

## File Format Requirements

### CSV Format
```csv
vehicle_id,timestamp,latitude,longitude,speed,...
VEH001,2024-01-01T10:00:00,23.0225,72.5714,45,...
```

### JSON Format
```json
{
  "vehicles": [
    {
      "id": "VEH001",
      "timestamp": "2024-01-01T10:00:00",
      "position": {"lat": 23.0225, "lon": 72.5714},
      "speed": 45
    }
  ]
}
```

## Security Considerations

- File uploads are sanitized and validated
- Files are stored with unique timestamps
- Automatic cleanup of old files
- CORS configuration for allowed origins
- Input validation on all endpoints

## Development

### Adding New Analysis Types

1. Create new detector class in `backend/forensics/`
2. Add API endpoint in `backend/app.py`
3. Create report page component in frontend
4. Update API service in `frontend/src/services/api.js`

### Customizing PDF Reports

Edit `backend/utils/pdf_generator.py` to modify:
- Report layout and styling
- Sections and content
- Tables and visualizations
- Header and footer

## Troubleshooting

### Backend Issues

- **Port already in use**: Change port in `app.py`
- **Module not found**: Ensure virtual environment is activated
- **File upload fails**: Check `uploads/` directory permissions

### Frontend Issues

- **API connection fails**: Verify backend is running on port 5000
- **Module not found**: Run `npm install`
- **Build fails**: Clear node_modules and reinstall

## License

[Your License Here]

## Contact

[Your Contact Information]

## Acknowledgments

Developed for vehicular network security research and forensic analysis.