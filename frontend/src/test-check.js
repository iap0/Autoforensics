import React, { useState, useEffect } from 'react';
import { Shield, Upload, FileSearch, AlertTriangle, Download, Menu, X, Info, BookOpen, User, ArrowLeft, CheckCircle, TrendingUp, Activity, MapPin, Users, Calendar, FileText, UserCircle, Briefcase } from 'lucide-react';
import api from './services/api';
// Mock API for testing - Replace with real API in production
const mockAPI = {
  uploadFile: async (file, formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate hash generation
        const mockHash = 'a7f3c9e2b1d4f8e6c5a2b9d7e3f1c8a4b6d2e9f7c5a3b1d8e6f4c2a9b7d5e3f1';
        resolve({
          success: true,
          filename: `${Date.now()}_${file.name}`,
          original_filename: file.name,
          file_hash: mockHash,
          file_size: file.size,
          case_details: formData
        });
      }, 1000);
    });
  },
  
  analyzeSybilAttack: async (uploadData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          report: {
            attack_type: 'Sybil Attack',
            filename: uploadData.original_filename,
            file_hash: uploadData.file_hash,
            file_size: uploadData.file_size,
            case_details: uploadData.case_details,
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
  
  analyzePositionFalsification: async (uploadData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          report: {
            attack_type: 'Position Falsification',
            filename: uploadData.original_filename,
            file_hash: uploadData.file_hash,
            file_size: uploadData.file_size,
            case_details: uploadData.case_details,
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

  // Form state
  const [caseNumber, setCaseNumber] = useState('');
  const [caseDate, setCaseDate] = useState('');
  const [investigatorName, setInvestigatorName] = useState('');
  const [investigatorDesignation, setInvestigatorDesignation] = useState('');
  const [reportDate, setReportDate] = useState('');

  // Set default report date to current date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setReportDate(today);
  }, []);

  const validateForm = () => {
    if (!caseNumber.trim()) {
      setError('Please enter a case number');
      return false;
    }
    if (!caseDate) {
      setError('Please select a case date');
      return false;
    }
    if (!investigatorName.trim()) {
      setError('Please enter investigator name');
      return false;
    }
    if (!investigatorDesignation.trim()) {
      setError('Please enter investigator designation');
      return false;
    }
    if (!selectedFile) {
      setError('Please upload a file');
      return false;
    }
    return true;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleAnalysis = async (type) => {
    //enable form validation later 
    //if (!validateForm()) {
    //   return;
    // }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // First upload file with form data
      const formData = {
        caseNumber,
        caseDate,
        investigatorName,
        investigatorDesignation,
        reportDate
      };

      // const uploadResult = await mockAPI.uploadFile(selectedFile, formData);
      
        const uploadResult = await api.uploadFile(selectedFile, formData); // Replace with actual API call
        setUploadedFileData(uploadResult);
    

      // Then analyze
      let result;
      if (type === 'sybil') {
        result = await api.analyzeSybilAttack(uploadResult.filename);
        console.log('reply Data:', result);
        setAnalysisResult(result.report);
        // console.log('Analyzing Sybil Attack with uploaded file data:', uploadResult,selectedFile);
        setCurrentPage('sybil-report');
      } else {
        result = await api.analyzePositionFalsification(uploadResult.filename);
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
    alert('In production, this will download the PDF report with all case details and file hash.');
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setUploadedFileData(null);
    setAnalysisResult(null);
    setError(null);
    setCaseNumber('');
    setCaseDate('');
    setInvestigatorName('');
    setInvestigatorDesignation('');
    const today = new Date().toISOString().split('T')[0];
    setReportDate(today);
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
          <div className="space-y-8">
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
              <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 text-red-200 max-w-4xl mx-auto">
                {error}
              </div>
            )}

            {/* Case Information Form */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Case Information</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Case Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Case Number *
                  </label>
                  <input
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="Enter case number"
                    className="w-full px-4 py-3 bg-slate-900 bg-opacity-50 border border-blue-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Case Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Case Date *
                  </label>
                  <input
                    type="date"
                    value={caseDate}
                    onChange={(e) => setCaseDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 bg-opacity-50 border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Investigator Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <UserCircle className="w-4 h-4 inline mr-2" />
                    Investigator Name *
                  </label>
                  <input
                    type="text"
                    value={investigatorName}
                    onChange={(e) => setInvestigatorName(e.target.value)}
                    placeholder="Enter investigator name"
                    className="w-full px-4 py-3 bg-slate-900 bg-opacity-50 border border-blue-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Investigator Designation */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Investigator Designation *
                  </label>
                  <input
                    type="text"
                    value={investigatorDesignation}
                    onChange={(e) => setInvestigatorDesignation(e.target.value)}
                    placeholder="Enter designation"
                    className="w-full px-4 py-3 bg-slate-900 bg-opacity-50 border border-blue-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Report Date */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Report Date
                  </label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 bg-opacity-50 border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Default: Current date</p>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 rounded-2xl p-8 shadow-2xl">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <Upload className="w-16 h-16 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Upload Evidence File</h3>
                
                <div className="max-w-md mx-auto">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-blue-500 border-dashed rounded-xl cursor-pointer bg-slate-900 bg-opacity-50 hover:bg-opacity-70 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileSearch className="w-12 h-12 text-blue-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-300">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">CSV, JSON, TXT, LOG files</p>
                      {selectedFile && (
                        <div className="mt-3 text-center">
                          <p className="text-sm text-green-400 font-semibold">
                            ✓ {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      )}
                    </div>
                    <input type="file" className="hidden" onChange={handleFileChange} accept=".csv,.json,.txt,.log" />
                  </label>
                </div>
              </div>
            </div>

            {/* Analysis Options */}
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
                    disabled={isAnalyzing}
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
                    disabled={isAnalyzing}
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
                <h3 className="text-xl font-semibold text-white mb-3">Step 1: Fill Case Information</h3>
                <p>Enter all required case details including case number, date, investigator name, and designation. Report date defaults to current date.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Step 2: Upload Evidence File</h3>
                <p>Click on the upload area or drag and drop your forensic data file. Supported formats include CSV, JSON, TXT, and LOG files. File hash will be calculated automatically.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Step 3: Select Attack Type</h3>
                <p>Choose the type of attack you want to analyze:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Sybil Attack Detection - for identity-based threats</li>
                  <li>Position Falsification - for location-based threats</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Step 4: Review Results</h3>
                <p>Examine the detailed findings, threat levels, file hash, and recommendations provided in the analysis report.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Step 5: Download Report</h3>
                <p>Export the complete forensic report as a PDF with all case details, file hash, and analysis results.</p>
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
                <h3 className="text-2xl font-bold text-white mb-2">[Your Name]</h3>
                <p className="text-blue-300">[Your Title/Position]</p>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>[Add your background information, expertise in vehicular forensics, and motivation for creating this tool]</p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-900 bg-opacity-50 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Contact</h4>
                    <p className="text-sm">[Your Email]</p>
                    <p className="text-sm">[Your Institution]</p>
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

        {/* Sybil Attack Report Page */}
        {currentPage === 'sybil-report' && analysisResult && (
          <div className="space-y-6">
            <button onClick={resetAnalysis} className="text-blue-400 hover:text-blue-300 flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-900 bg-opacity-30 p-4 rounded-xl">
                    <AlertTriangle className="w-12 h-12 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Sybil Attack Analysis</h2>
                    <p className="text-gray-400">Forensic Report</p>
                  </div>
                </div>
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>

              {/* Case Details Section */}
              <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Case Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Case Number</p>
                    <p className="text-white font-semibold">{analysisResult.report.caseNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Case Date</p>
                    <p className="text-white font-semibold">{analysisResult.case_details.caseDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Investigator</p>
                    <p className="text-white font-semibold">{analysisResult.case_details.investigatorName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Designation</p>
                    <p className="text-white font-semibold">{analysisResult.case_details.investigatorDesignation}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-400 text-sm mb-1">Report Date</p>
                    <p className="text-white font-semibold">{analysisResult.case_details.reportDate}</p>
                  </div>
                </div>
              </div>

              {/* File Information Section */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Evidence File Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">File Name</p>
                    <p className="text-white font-mono text-sm break-all">{analysisResult.filename}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">File Size</p>
                    <p className="text-white font-semibold">{formatFileSize(analysisResult.file_size)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">File Hash (SHA-256)</p>
                    <p className="text-green-400 font-mono text-xs break-all">{analysisResult.file_hash}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Report ID</p>
                    <p className="text-white font-mono text-sm">{analysisResult.report_id}</p>
                  </div>
                </div>
              </div>

              {/* Threat Level Section */}
              <div className={`${getThreatBgColor(analysisResult.threat_level)} border rounded-xl p-6 mb-6`}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Threat Level</p>
                    <p className={`${getThreatColor(analysisResult.threat_level)} font-bold text-3xl`}>
                      {analysisResult.threat_level.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Confidence Score</p>
                    <p className="text-white font-bold text-3xl">{(analysisResult.confidence_score * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-blue-400" />
                  Executive Summary
                </h3>
                <p className="text-gray-300">{analysisResult.summary}</p>
              </div>

              {/* Key Findings */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Analysis Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Vehicles</span>
                      <span className="text-white font-bold">{analysisResult.analysis_results.findings.total_vehicles_analyzed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Suspicious Identities</span>
                      <span className="text-red-400 font-bold">{analysisResult.analysis_results.findings.suspicious_identities}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Duplicate Behaviors</span>
                      <span className="text-orange-400 font-bold">{analysisResult.analysis_results.findings.duplicate_behaviors_detected}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Network Anomalies</span>
                      <span className="text-yellow-400 font-bold">{analysisResult.analysis_results.findings.network_anomalies}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Detection Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Precision</span>
                      <span className="text-green-400 font-bold">{(analysisResult.analysis_results.findings.detection_metrics.precision * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Recall</span>
                      <span className="text-green-400 font-bold">{(analysisResult.analysis_results.findings.detection_metrics.recall * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">F1 Score</span>
                      <span className="text-green-400 font-bold">{(analysisResult.analysis_results.findings.detection_metrics.f1_score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Threat Indicators */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-red-400" />
                  Threat Indicators
                </h3>
                <ul className="space-y-2">
                  {analysisResult.analysis_results.findings.threat_indicators.map((indicator, idx) => (
                    <li key={idx} className="text-gray-300 flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Affected Nodes */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-400" />
                  Affected Nodes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.analysis_results.findings.affected_nodes.map((node, idx) => (
                    <span key={idx} className="bg-red-900 bg-opacity-30 border border-red-500 text-red-300 px-3 py-1 rounded-full text-sm font-mono">
                      {node}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Security Recommendations</h3>
                <ol className="space-y-3">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-gray-300">
                      <span className="text-blue-400 font-bold mr-2">{idx + 1}.</span>
                      {rec}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Download Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleDownloadReport}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-lg flex items-center space-x-3"
                >
                  <Download className="w-6 h-6" />
                  <span>Download Complete Report (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Position Falsification Report Page */}
        {currentPage === 'position-report' && analysisResult && (
          <div className="space-y-6">
            <button onClick={resetAnalysis} className="text-blue-400 hover:text-blue-300 flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-900 bg-opacity-30 p-4 rounded-xl">
                    <MapPin className="w-12 h-12 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Position Falsification Analysis</h2>
                    <p className="text-gray-400">Forensic Report</p>
                  </div>
                </div>
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>

              {/* Case Details Section */}
              <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Case Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Case Number</p>
                    <p className="text-white font-semibold">{analysisResult.case_details.caseNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Case Date</p>
                    <p className="text-white font-semibold">{analysisResult.case_details.caseDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Investigator</p>
                    <p className="text-white font-semibold">{analysisResult.case_details.investigatorName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Designation</p>
                    <p className="text-white font-semibold">{analysisResult.case_details.investigatorDesignation}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-400 text-sm mb-1">Report Date</p>
                    <p className="text-white font-semibold">{analysisResult.case_details.reportDate}</p>
                  </div>
                </div>
              </div>

              {/* File Information Section */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Evidence File Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">File Name</p>
                    <p className="text-white font-mono text-sm break-all">{analysisResult.filename}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">File Size</p>
                    <p className="text-white font-semibold">{formatFileSize(analysisResult.file_size)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">File Hash (SHA-256)</p>
                    <p className="text-green-400 font-mono text-xs break-all">{analysisResult.file_hash}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Report ID</p>
                    <p className="text-white font-mono text-sm">{analysisResult.report_id}</p>
                  </div>
                </div>
              </div>

              {/* Threat Level Section */}
              <div className={`${getThreatBgColor(analysisResult.threat_level)} border rounded-xl p-6 mb-6`}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Threat Level</p>
                    <p className={`${getThreatColor(analysisResult.threat_level)} font-bold text-3xl`}>
                      {analysisResult.threat_level.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Confidence Score</p>
                    <p className="text-white font-bold text-3xl">{(analysisResult.confidence_score * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-blue-400" />
                  Executive Summary
                </h3>
                <p className="text-gray-300">{analysisResult.summary}</p>
              </div>

              {/* Key Findings */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Position Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Positions</span>
                      <span className="text-white font-bold">{analysisResult.analysis_results.findings.total_positions_analyzed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Anomalous Positions</span>
                      <span className="text-red-400 font-bold">{analysisResult.analysis_results.findings.anomalous_positions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Impossible Movements</span>
                      <span className="text-orange-400 font-bold">{analysisResult.analysis_results.findings.impossible_movements}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Speed Violations</span>
                      <span className="text-yellow-400 font-bold">{analysisResult.analysis_results.findings.speed_violations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Off-Road Positions</span>
                      <span className="text-yellow-400 font-bold">{analysisResult.analysis_results.findings.off_road_positions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">GPS Spoofing</span>
                      <span className="text-red-400 font-bold">{analysisResult.analysis_results.findings.gps_spoofing_indicators}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Detection Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Precision</span>
                      <span className="text-green-400 font-bold">{(analysisResult.analysis_results.findings.detection_metrics.precision * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Recall</span>
                      <span className="text-green-400 font-bold">{(analysisResult.analysis_results.findings.detection_metrics.recall * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">F1 Score</span>
                      <span className="text-green-400 font-bold">{(analysisResult.analysis_results.findings.detection_metrics.f1_score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">False Positive Rate</span>
                      <span className="text-blue-400 font-bold">{(analysisResult.analysis_results.findings.detection_metrics.false_positive_rate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Threat Indicators */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-red-400" />
                  Threat Indicators
                </h3>
                <ul className="space-y-2">
                  {analysisResult.analysis_results.findings.threat_indicators.map((indicator, idx) => (
                    <li key={idx} className="text-gray-300 flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Affected Vehicles */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-400" />
                  Affected Vehicles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.analysis_results.findings.affected_vehicles.map((vehicle, idx) => (
                    <span key={idx} className="bg-orange-900 bg-opacity-30 border border-orange-500 text-orange-300 px-3 py-1 rounded-full text-sm font-mono">
                      {vehicle}
                    </span>
                  ))}
                </div>
              </div>

              {/* Geographic Hotspots */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-400" />
                  Geographic Hotspots
                </h3>
                <div className="space-y-3">
                  {analysisResult.analysis_results.findings.geographic_hotspots.map((spot, idx) => (
                    <div key={idx} className="bg-slate-800 bg-opacity-50 border border-orange-500 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Latitude</p>
                          <p className="text-white font-mono">{spot.lat.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Longitude</p>
                          <p className="text-white font-mono">{spot.lon.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Incidents</p>
                          <p className="text-orange-400 font-bold">{spot.incident_count}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-900 bg-opacity-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Security Recommendations</h3>
                <ol className="space-y-3">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-gray-300">
                      <span className="text-blue-400 font-bold mr-2">{idx + 1}.</span>
                      {rec}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Download Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleDownloadReport}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-lg flex items-center space-x-3"
                >
                  <Download className="w-6 h-6" />
                  <span>Download Complete Report (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            <h3 className="text-xl font-semibold text-white">Analyzing...</h3>
            <p className="text-gray-400">Processing forensic data and calculating file hash</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 border-t border-blue-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2024 Autoforensics. Smart Vehicular Forensics Analysis Tool.</p>
            <p className="mt-2">Designed for cybersecurity research and forensic investigation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AutoforensicsApp;