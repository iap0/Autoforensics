import React, { useState } from 'react';
import { Shield, Upload, FileSearch, AlertTriangle, Download, Menu, X, Info, BookOpen, User, ArrowLeft, CheckCircle, TrendingUp, Activity, MapPin, Users } from 'lucide-react';

// Mock API for testing - Replace with real API in production
const mockAPI = {
  uploadFile: async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          filename: `${Date.now()}_${file.name}`,
          original_filename: file.name
        });
      }, 1000);
    });
  },
  
  analyzeSybilAttack: async (filename) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          report: {
            attack_type: 'Sybil Attack',
            filename: filename,
            timestamp: new Date().toISOString(),
            threat_level: 'Medium',
            confidence_score: 0.87,
            report_id: `SYBIL_${Date.now()}`,
            analysis_results: {
              findings: {
                total_vehicles_analyzed: 150,
                suspicious_identities: 12,
                duplicate_behaviors_detected: 8,
                network_anomalies: 5,
                threat_indicators: [
                  'Multiple vehicles with similar MAC addresses',
                  'Synchronized message timing patterns',
                  'Identical certificate chains detected',
                  'Abnormal message frequency from suspected nodes'
                ],
                affected_nodes: ['Node_A45', 'Node_B72', 'Node_C89'],
                detection_metrics: {
                  precision: 0.87,
                  recall: 0.82,
                  f1_score: 0.84
                }
              }
            },
            summary: 'Moderate Sybil attack indicators found. Some suspicious identity patterns detected that warrant further investigation and monitoring.',
            recommendations: [
              'Implement robust identity verification mechanisms',
              'Deploy distributed trust management systems',
              'Monitor for duplicate MAC addresses and certificate chains',
              'Implement rate limiting for message broadcasts',
              'Use cryptographic authentication for all V2X communications'
            ]
          }
        });
      }, 3000);
    });
  },
  
  analyzePositionFalsification: async (filename) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          report: {
            attack_type: 'Position Falsification',
            filename: filename,
            timestamp: new Date().toISOString(),
            threat_level: 'High',
            confidence_score: 0.91,
            report_id: `POSITION_${Date.now()}`,
            analysis_results: {
              findings: {
                total_positions_analyzed: 2847,
                anomalous_positions: 23,
                impossible_movements: 7,
                speed_violations: 15,
                off_road_positions: 11,
                gps_spoofing_indicators: 4,
                threat_indicators: [
                  'Vehicle exceeding physical speed limits detected',
                  'Impossible position jumps (teleportation) identified',
                  'GPS coordinates off valid road network',
                  'Suspiciously consistent GPS accuracy values',
                  'Temporal gaps in position reporting'
                ],
                affected_vehicles: ['VEH_X12', 'VEH_Y34', 'VEH_Z56'],
                geographic_hotspots: [
                  { lat: 23.0225, lon: 72.5714, incident_count: 8 },
                  { lat: 23.0330, lon: 72.5850, incident_count: 5 }
                ],
                detection_metrics: {
                  precision: 0.91,
                  recall: 0.88,
                  f1_score: 0.89,
                  false_positive_rate: 0.05
                }
              }
            },
            summary: 'Significant position falsification detected. Multiple vehicles broadcasting false GPS coordinates. This poses serious safety and security risks to the vehicular network.',
            recommendations: [
              'URGENT: Flag and isolate vehicles with falsified positions',
              'Notify traffic management systems of compromised data',
              'Implement emergency position verification protocols',
              'Implement GPS signal authentication mechanisms',
              'Deploy multi-source location verification',
              'Cross-reference position data with neighboring vehicles'
            ]
          }
        });
      }, 3000);
    });
  }
};

const AutoforensicsApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      try {
        const result = await mockAPI.uploadFile(file);
        setUploadedFileData(result);
      } catch (err) {
        setError('Failed to upload file. Please try again.');
      }
    }
  };

  const handleAnalysis = async (type) => {
    if (!uploadedFileData) {
      setError('Please upload a file first!');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      let result;
      if (type === 'sybil') {
        result = await mockAPI.analyzeSybilAttack(uploadedFileData.filename);
        setAnalysisResult(result.report);
        setCurrentPage('sybil-report');
      } else {
        result = await mockAPI.analyzePositionFalsification(uploadedFileData.filename);
        setAnalysisResult(result.report);
        setCurrentPage('position-report');
      }
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = () => {
    alert('In production, this will download the PDF report generated by the backend.');
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setUploadedFileData(null);
    setAnalysisResult(null);
    setError(null);
    setCurrentPage('home');
  };

  const getThreatColor = (level) => {
    const colors = {
      'Low': 'text-green-400',
      'Medium': 'text-yellow-400',
      'High': 'text-orange-400',
      'Critical': 'text-red-400'
    };
    return colors[level] || 'text-gray-400';
  };

  const getThreatBgColor = (level) => {
    const colors = {
      'Low': 'bg-green-900 bg-opacity-30 border-green-500',
      'Medium': 'bg-yellow-900 bg-opacity-30 border-yellow-500',
      'High': 'bg-orange-900 bg-opacity-30 border-orange-500',
      'Critical': 'bg-red-900 bg-opacity-30 border-red-500'
    };
    return colors[level] || 'bg-gray-900 bg-opacity-30 border-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-black bg-opacity-50 backdrop-blur-md border-b border-blue-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={resetAnalysis}>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Autoforensics</h1>
                <p className="text-xs text-blue-300">Smart Vehicular Forensics</p>
              </div>
            </div>

            <div className="hidden md:flex space-x-6">
              <button onClick={() => setCurrentPage('about')} className="text-gray-300 hover:text-white transition-colors">
                <Info className="w-5 h-5 inline mr-1" />About
              </button>
              <button onClick={() => setCurrentPage('guide')} className="text-gray-300 hover:text-white transition-colors">
                <BookOpen className="w-5 h-5 inline mr-1" />Guide
              </button>
              <button onClick={() => setCurrentPage('creator')} className="text-gray-300 hover:text-white transition-colors">
                <User className="w-5 h-5 inline mr-1" />Creator
              </button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <button onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2">About</button>
              <button onClick={() => { setCurrentPage('guide'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2">Guide</button>
              <button onClick={() => { setCurrentPage('creator'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2">Creator</button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Home Page */}
        {currentPage === 'home' && (
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-6 rounded-2xl shadow-2xl">
                  <Shield className="w-24 h-24 text-white" />
                </div>
              </div>
              <h2 className="text-5xl font-bold text-white">Autoforensics</h2>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto">Advanced Smart Vehicular Forensics Analysis Tool</p>
              <p className="text-gray-400 max-w-3xl mx-auto">Detect and analyze security threats in smart vehicular networks with precision and reliability</p>
            </div>

            {error && (
              <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 text-red-200 max-w-2xl mx-auto">
                {error}
              </div>
            )}

            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 rounded-2xl p-8 shadow-2xl">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <Upload className="w-16 h-16 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Upload Target File</h3>
                
                <div className="max-w-md mx-auto">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-blue-500 border-dashed rounded-xl cursor-pointer bg-slate-900 bg-opacity-50 hover:bg-opacity-70 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileSearch className="w-12 h-12 text-blue-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-300">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">CSV, JSON, TXT, LOG files</p>
                      {selectedFile && (
                        <p className="mt-3 text-sm text-green-400 font-semibold">
                          ✓ {selectedFile.name}
                        </p>
                      )}
                    </div>
                    <input type="file" className="hidden" onChange={handleFileChange} accept=".csv,.json,.txt,.log" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-red-900 to-red-700 bg-opacity-30 backdrop-blur-sm border border-red-500 rounded-2xl p-8 shadow-2xl hover:shadow-red-500/50 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-10 h-10 text-red-400" />
                    <h3 className="text-2xl font-bold text-white">Sybil Attack</h3>
                  </div>
                  <p className="text-gray-300">
                    Detect malicious nodes creating multiple fake identities to gain disproportionate influence in the vehicular network.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Identity verification analysis</li>
                    <li>• Network behavior patterns</li>
                    <li>• Trust score evaluation</li>
                  </ul>
                  <button
                    onClick={() => handleAnalysis('sybil')}
                    disabled={!uploadedFileData || isAnalyzing}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg"
                  >
                    Analyze Sybil Attack
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-900 to-orange-700 bg-opacity-30 backdrop-blur-sm border border-orange-500 rounded-2xl p-8 shadow-2xl hover:shadow-orange-500/50 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-10 h-10 text-orange-400" />
                    <h3 className="text-2xl font-bold text-white">Position Falsification</h3>
                  </div>
                  <p className="text-gray-300">
                    Identify vehicles broadcasting false location data to manipulate traffic systems or evade detection.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• GPS coordinate validation</li>
                    <li>• Movement pattern analysis</li>
                    <li>• Location consistency check</li>
                  </ul>
                  <button
                    onClick={() => handleAnalysis('position')}
                    disabled={!uploadedFileData || isAnalyzing}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg"
                  >
                    Analyze Position Falsification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Page */}
        {currentPage === 'about' && (
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">About Autoforensics</h2>
            <div className="space-y-4 text-gray-300">
              <p>Autoforensics is a cutting-edge forensic analysis tool designed specifically for smart vehicular networks and V2X (Vehicle-to-Everything) communication systems.</p>
              <p>Our tool specializes in detecting and analyzing two critical security threats:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Sybil Attacks:</strong> Where malicious actors create multiple fake identities to compromise network integrity</li>
                <li><strong className="text-white">Position Falsification:</strong> Where vehicles broadcast false location information to manipulate traffic systems</li>
              </ul>
              <p>Built with advanced algorithms and machine learning techniques, Autoforensics provides comprehensive forensic reports that help security professionals identify, analyze, and respond to threats in vehicular networks.</p>
            </div>
          </div>
        )}

        {/* Guide Page */}
        {currentPage === 'guide' && (
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">User Guide</h2>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Step 1: Upload Target File</h3>
                <p>Click on the upload area or drag and drop your forensic data file. Supported formats include CSV, JSON, TXT, and LOG files containing vehicular network data.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Step 2: Select Attack Type</h3>
                <p>Choose the type of attack you want to analyze:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Sybil Attack Detection - for identity-based threats</li>
                  <li>Position Falsification - for location-based threats</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Step 3: Analyze</h3>
                <p>Click the corresponding analysis button. The system will process your file and generate a comprehensive forensic report.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Step 4: Review Results</h3>
                <p>Examine the detailed findings, threat levels, and recommendations provided in the analysis report.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Step 5: Download Report</h3>
                <p>Export the complete forensic report as a PDF for documentation and further analysis.</p>
              </div>
            </div>
          </div>
        )}

        {/* Creator Page */}
        {currentPage === 'creator' && (
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">Creator Information</h2>
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block bg-gradient-to-br from-blue-600 to-cyan-500 p-4 rounded-full mb-4">
                  <User className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Avaneesh Kumar Pandey</h3>
                <p className="text-blue-300">Security Student</p>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>Avaneesh Kumar Pandey is a dedicated security student with a keen interest in vehicular forensics. He aims to enhance the security of vehicular networks through innovative forensic analysis tools.</p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-900 bg-opacity-50 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Contact</h4>
                    <p className="text-sm">avaneesh.btmtcs2128@nfsu.ac.in</p>
                    <p className="text-sm">National Forensic Sciences University</p>
                  </div>
                  <div className="bg-slate-900 bg-opacity-50 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Research Interests</h4>
                    <p className="text-sm">Vehicular Network Security</p>
                    <p className="text-sm">Digital Forensics</p>
                    <p className="text-sm">Cyber Threat Detection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            <h3 className="text-xl font-semibold text-white">Analyzing...</h3>
            <p className="text-gray-400">Processing forensic data</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 border-t border-blue-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2025 Autoforensics. Smart Vehicular Forensics Analysis Tool.</p>
            <p className="mt-2">Designed for cybersecurity research and forensic investigation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AutoforensicsApp; 