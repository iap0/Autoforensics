from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.platypus import Image as RLImage
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
import os
from typing import Dict, Any


class PDFReportGenerator:
    """Generate PDF forensic reports"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
        
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e3a8a'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Section heading style
        self.styles.add(ParagraphStyle(
            name='SectionHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#2563eb'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        ))
        
        # Threat level style
        self.styles.add(ParagraphStyle(
            name='ThreatLevel',
            parent=self.styles['Normal'],
            fontSize=14,
            spaceAfter=10,
            fontName='Helvetica-Bold'
        ))
    
    def generate_report(self, report_data: Dict[str, Any], report_type: str) -> str:
        """
        Generate PDF report from analysis data
        
        Args:
            report_data: Dictionary containing report information
            report_type: Type of report ('sybil' or 'position')
            
        Returns:
            Path to generated PDF file
        """
        # Create reports directory if it doesn't exist
        reports_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'reports')
        os.makedirs(reports_dir, exist_ok=True)
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"Autoforensics_{report_type}_{timestamp}.pdf"
        filepath = os.path.join(reports_dir, filename)
        
        # Create PDF document
        doc = SimpleDocTemplate(filepath, pagesize=letter,
                              rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=72)
        
        # Build story (content elements)
        story = []
        
        # Add content based on report type
        if report_type == 'sybil':
            story = self._build_sybil_report(report_data)
        elif report_type == 'position':
            story = self._build_position_report(report_data)
        else:
            raise ValueError(f"Unknown report type: {report_type}")
        
        # Build PDF
        doc.build(story)
        
        return filepath
    
    def _build_sybil_report(self, data: Dict) -> list:
        """Build content for Sybil Attack report"""
        story = []
        
        # Header
        story.append(Paragraph("AUTOFORENSICS", self.styles['CustomTitle']))
        story.append(Paragraph("Sybil Attack Forensic Report", self.styles['Heading2']))
        story.append(Spacer(1, 0.3*inch))
        
        # Report metadata
        story.append(self._create_metadata_table(data))
        story.append(Spacer(1, 0.3*inch))
        
        # Threat Level
        threat_color = self._get_threat_color(data.get('threat_level', 'Unknown'))
        threat_text = f"<font color='{threat_color}'>THREAT LEVEL: {data.get('threat_level', 'Unknown').upper()}</font>"
        story.append(Paragraph(threat_text, self.styles['ThreatLevel']))
        story.append(Spacer(1, 0.2*inch))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", self.styles['SectionHeading']))
        summary = data.get('summary', 'No summary available')
        story.append(Paragraph(summary, self.styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Analysis Results
        story.append(Paragraph("Analysis Results", self.styles['SectionHeading']))
        findings = data.get('analysis_results', {}).get('findings', {})
        
        if findings:
            results_data = [
                ['Metric', 'Value'],
                ['Total Vehicles Analyzed', str(findings.get('total_vehicles_analyzed', 'N/A'))],
                ['Suspicious Identities', str(findings.get('suspicious_identities', 'N/A'))],
                ['Duplicate Behaviors Detected', str(findings.get('duplicate_behaviors_detected', 'N/A'))],
                ['Network Anomalies', str(findings.get('network_anomalies', 'N/A'))]
            ]
            
            story.append(self._create_styled_table(results_data))
            story.append(Spacer(1, 0.2*inch))
        
        # Threat Indicators
        threat_indicators = findings.get('threat_indicators', [])
        if threat_indicators:
            story.append(Paragraph("Threat Indicators", self.styles['SectionHeading']))
            for indicator in threat_indicators:
                story.append(Paragraph(f"• {indicator}", self.styles['Normal']))
            story.append(Spacer(1, 0.2*inch))
        
        # Affected Nodes
        affected_nodes = findings.get('affected_nodes', [])
        if affected_nodes:
            story.append(Paragraph("Affected Nodes", self.styles['SectionHeading']))
            story.append(Paragraph(", ".join(affected_nodes), self.styles['Normal']))
            story.append(Spacer(1, 0.2*inch))
        
        # Detection Metrics
        metrics = findings.get('detection_metrics', {})
        if metrics:
            story.append(Paragraph("Detection Metrics", self.styles['SectionHeading']))
            metrics_data = [
                ['Metric', 'Score'],
                ['Precision', f"{metrics.get('precision', 0):.2f}"],
                ['Recall', f"{metrics.get('recall', 0):.2f}"],
                ['F1 Score', f"{metrics.get('f1_score', 0):.2f}"]
            ]
            story.append(self._create_styled_table(metrics_data))
            story.append(Spacer(1, 0.2*inch))
        
        # Recommendations
        story.append(PageBreak())
        story.append(Paragraph("Security Recommendations", self.styles['SectionHeading']))
        recommendations = data.get('recommendations', [])
        for i, rec in enumerate(recommendations, 1):
            story.append(Paragraph(f"{i}. {rec}", self.styles['Normal']))
            story.append(Spacer(1, 0.1*inch))
        
        # Footer
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph("—" * 50, self.styles['Normal']))
        story.append(Paragraph(
            f"Report generated by Autoforensics on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            self.styles['Normal']
        ))
        
        return story
    
    def _build_position_report(self, data: Dict) -> list:
        """Build content for Position Falsification report"""
        story = []
        
        # Header
        story.append(Paragraph("AUTOFORENSICS", self.styles['CustomTitle']))
        story.append(Paragraph("Position Falsification Forensic Report", self.styles['Heading2']))
        story.append(Spacer(1, 0.3*inch))
        
        # Report metadata
        story.append(self._create_metadata_table(data))
        story.append(Spacer(1, 0.3*inch))
        
        # Threat Level
        threat_color = self._get_threat_color(data.get('threat_level', 'Unknown'))
        threat_text = f"<font color='{threat_color}'>THREAT LEVEL: {data.get('threat_level', 'Unknown').upper()}</font>"
        story.append(Paragraph(threat_text, self.styles['ThreatLevel']))
        story.append(Spacer(1, 0.2*inch))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", self.styles['SectionHeading']))
        summary = data.get('summary', 'No summary available')
        story.append(Paragraph(summary, self.styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Analysis Results
        story.append(Paragraph("Analysis Results", self.styles['SectionHeading']))
        findings = data.get('analysis_results', {}).get('findings', {})
        
        if findings:
            results_data = [
                ['Metric', 'Value'],
                ['Total Positions Analyzed', str(findings.get('total_positions_analyzed', 'N/A'))],
                ['Anomalous Positions', str(findings.get('anomalous_positions', 'N/A'))],
                ['Impossible Movements', str(findings.get('impossible_movements', 'N/A'))],
                ['Speed Violations', str(findings.get('speed_violations', 'N/A'))],
                ['Off-Road Positions', str(findings.get('off_road_positions', 'N/A'))],
                ['GPS Spoofing Indicators', str(findings.get('gps_spoofing_indicators', 'N/A'))]
            ]
            
            story.append(self._create_styled_table(results_data))
            story.append(Spacer(1, 0.2*inch))
        
        # Threat Indicators
        threat_indicators = findings.get('threat_indicators', [])
        if threat_indicators:
            story.append(Paragraph("Threat Indicators", self.styles['SectionHeading']))
            for indicator in threat_indicators:
                story.append(Paragraph(f"• {indicator}", self.styles['Normal']))
            story.append(Spacer(1, 0.2*inch))
        
        # Affected Vehicles
        affected_vehicles = findings.get('affected_vehicles', [])
        if affected_vehicles:
            story.append(Paragraph("Affected Vehicles", self.styles['SectionHeading']))
            story.append(Paragraph(", ".join(affected_vehicles), self.styles['Normal']))
            story.append(Spacer(1, 0.2*inch))
        
        # Geographic Hotspots
        hotspots = findings.get('geographic_hotspots', [])
        if hotspots:
            story.append(Paragraph("Geographic Hotspots", self.styles['SectionHeading']))
            hotspot_data = [['Latitude', 'Longitude', 'Incident Count']]
            for spot in hotspots:
                hotspot_data.append([
                    f"{spot.get('lat', 'N/A'):.4f}",
                    f"{spot.get('lon', 'N/A'):.4f}",
                    str(spot.get('incident_count', 'N/A'))
                ])
            story.append(self._create_styled_table(hotspot_data))
            story.append(Spacer(1, 0.2*inch))
        
        # Detection Metrics
        metrics = findings.get('detection_metrics', {})
        if metrics:
            story.append(Paragraph("Detection Metrics", self.styles['SectionHeading']))
            metrics_data = [
                ['Metric', 'Score'],
                ['Precision', f"{metrics.get('precision', 0):.2f}"],
                ['Recall', f"{metrics.get('recall', 0):.2f}"],
                ['F1 Score', f"{metrics.get('f1_score', 0):.2f}"],
                ['False Positive Rate', f"{metrics.get('false_positive_rate', 0):.2f}"]
            ]
            story.append(self._create_styled_table(metrics_data))
            story.append(Spacer(1, 0.2*inch))
        
        # Recommendations
        story.append(PageBreak())
        story.append(Paragraph("Security Recommendations", self.styles['SectionHeading']))
        recommendations = data.get('recommendations', [])
        for i, rec in enumerate(recommendations, 1):
            story.append(Paragraph(f"{i}. {rec}", self.styles['Normal']))
            story.append(Spacer(1, 0.1*inch))
        
        # Footer
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph("—" * 50, self.styles['Normal']))
        story.append(Paragraph(
            f"Report generated by Autoforensics on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            self.styles['Normal']
        ))
        
        return story
    
    def _create_metadata_table(self, data: Dict) -> Table:
        """Create metadata information table"""
        metadata = [
            ['Report ID', data.get('report_id', 'N/A')],
            ['Analysis Type', data.get('attack_type', 'N/A')],
            ['File Analyzed', data.get('filename', 'N/A')],
            ['Analysis Date', datetime.fromisoformat(data.get('analysis_timestamp', datetime.now().isoformat())).strftime('%Y-%m-%d %H:%M:%S')],
            ['Confidence Score', f"{data.get('confidence_score', 0):.2%}"]
        ]
        
        return self._create_styled_table(metadata)
    
    def _create_styled_table(self, data: list) -> Table:
        """Create a styled table"""
        table = Table(data, hAlign='LEFT')
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('TOPPADDING', (0, 1), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ]))
        return table
    
    def _get_threat_color(self, threat_level: str) -> str:
        """Get color code for threat level"""
        colors_map = {
            'Low': '#22c55e',
            'Medium': '#eab308',
            'High': '#f97316',
            'Critical': '#ef4444',
            'Unknown': '#6b7280'
        }
        return colors_map.get(threat_level, colors_map['Unknown'])