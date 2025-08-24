import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Camera, User, Send, CheckCircle, X, Play, Square } from 'lucide-react';

// Native Camera component using only browser APIs
const NativeCamera = ({ onCapture, onClose, className }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState(null);
    const [facingMode, setFacingMode] = useState('environment');

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [facingMode]);

    const startCamera = async () => {
        try {
            setError(null);
            
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 },
                    facingMode: facingMode,
                    aspectRatio: { ideal: 16/9 }
                },
                audio: false
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
                
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().then(() => {
                        setIsReady(true);
                    }).catch(e => {
                        console.error('Error playing video:', e);
                        setError('Failed to start video playback');
                    });
                };
            }
        } catch (err) {
            console.error('Camera access error:', err);
            if (err.name === 'NotAllowedError') {
                setError('Camera access denied. Please allow camera permissions and try again.');
            } else if (err.name === 'NotFoundError') {
                setError('No camera found on this device.');
            } else if (err.name === 'NotSupportedError') {
                setError('Camera not supported on this device.');
            } else {
                setError('Unable to access camera. Please try again.');
            }
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
            });
            setStream(null);
        }
        setIsReady(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !isReady) {
            console.error('Video not ready for capture');
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current || document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        const capturedImage = {
            id: Date.now(),
            src: dataUrl,
            timestamp: new Date().toLocaleString(),
            width: canvas.width,
            height: canvas.height
        };

        if (onCapture) {
            onCapture(capturedImage);
        }
    };

    const switchCamera = () => {
        const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
        setFacingMode(newFacingMode);
        setIsReady(false);
    };

    const handleClose = () => {
        stopCamera();
        if (onClose) {
            onClose();
        }
    };

    if (error) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 m-4 max-w-sm">
                    <div className="text-center">
                        <Camera className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Camera Error</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <div className="space-y-2">
                            <button
                                onClick={startCamera}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <div className="flex justify-between items-center p-4 bg-black text-white">
                <button
                    onClick={handleClose}
                    className="flex items-center text-white hover:text-gray-300 transition-colors"
                >
                    <X className="w-6 h-6 mr-2" />
                    Close
                </button>
                <h2 className="text-lg font-semibold">Camera</h2>
                <button
                    onClick={switchCamera}
                    className="text-white hover:text-gray-300 transition-colors text-sm"
                >
                    {facingMode === 'environment' ? 'Front' : 'Back'}
                </button>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                />
                
                {!isReady && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <p>Starting camera...</p>
                        </div>
                    </div>
                )}

                {isReady && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                        <button
                            onClick={capturePhoto}
                            className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-all shadow-lg flex items-center justify-center"
                            title="Take a photo"
                        >
                            <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-400"></div>
                        </button>
                        <p className="text-white text-sm text-center mt-2">Tap to Capture</p>
                    </div>
                )}

                {isReady && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-4">
                            <div className="w-full h-full border border-white border-opacity-30">
                                <div className="absolute top-1/3 left-0 right-0 border-t border-white border-opacity-20"></div>
                                <div className="absolute top-2/3 left-0 right-0 border-t border-white border-opacity-20"></div>
                                <div className="absolute left-1/3 top-0 bottom-0 border-l border-white border-opacity-20"></div>
                                <div className="absolute left-2/3 top-0 bottom-0 border-l border-white border-opacity-20"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Configuration - Update these based on your setup
const API_BASE_URL = 'http://localhost:5000'; // Your backend URL
const PHONE_DATABASE = ['+919123605369']; // Should match your backend

const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="font-medium">Back to Dashboard</span>
    </button>
);

const ReportComponent = ({ setCurrentRoute }) => {
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [backendStatus, setBackendStatus] = useState({ online: false, checked: false });
    const [formData, setFormData] = useState({
        reporterName: '',
        reporterPhone: '',
        reporterEmail: '',
        location: '',
        date: '',
        time: '',
        description: '',
        animalCount: '1',
        behavior: '',
        photos: []
    });

    // Check backend connectivity on component mount
    useEffect(() => {
        checkBackendStatus();
    }, []);

    const checkBackendStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/test`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setBackendStatus({ 
                    online: true, 
                    checked: true, 
                    message: data.message,
                    twilioConfigured: data.twilioConfigured 
                });
                console.log('✅ Backend is online:', data);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            setBackendStatus({ 
                online: false, 
                checked: true, 
                error: error.message 
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCapture = (capturedImage) => {
        setCapturedImages(prev => [...prev, capturedImage]);
        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, capturedImage]
        }));
        console.log('Photo captured successfully!');
    };

    const retakePhoto = (imageId) => {
        setCapturedImages(prev => prev.filter(img => img.id !== imageId));
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter(img => img.id !== imageId)
        }));
    };

    const openCamera = () => setShowCamera(true);
    const closeCamera = () => setShowCamera(false);
    const handleInitialSubmit = () => {
        if (selectedAnimal) {
            setShowForm(true);
        }
    };

    // Updated SMS function with proper error handling
    const sendSMSAlert = async (messageContent) => {
        const timestamp = new Date().toISOString();
        setDebugInfo(`[${timestamp}] 🚀 Starting SMS send process...`);
        
        try {
            // Check if backend is online first
            if (!backendStatus.online) {
                throw new Error('Backend server is not available. Please ensure server is running on port 5000.');
            }

            const requestUrl = `${API_BASE_URL}/send-sms`;
            const requestBody = { message: messageContent };
            
            setDebugInfo(prev => prev + `\n[${timestamp}] 📡 Sending request to: ${requestUrl}`);
            setDebugInfo(prev => prev + `\n[${timestamp}] 📝 Request body: ${JSON.stringify(requestBody, null, 2)}`);

            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            setDebugInfo(prev => prev + `\n[${timestamp}] 📥 Response received - Status: ${response.status}`);
            setDebugInfo(prev => prev + `\n[${timestamp}] 📥 Response OK: ${response.ok}`);

            // Get response text first
            const responseText = await response.text();
            setDebugInfo(prev => prev + `\n[${timestamp}] 📄 Raw response: ${responseText}`);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error(`Invalid JSON response: ${responseText}`);
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${responseData.error || responseData.message || 'Unknown error'}`);
            }

            setDebugInfo(prev => prev + `\n[${timestamp}] ✅ Response Data: ${JSON.stringify(responseData, null, 2)}`);
            
            return responseData;

        } catch (error) {
            const errorTimestamp = new Date().toISOString();
            const errorMessage = error.message || 'Unknown error occurred';
            
            setDebugInfo(prev => prev + `\n[${errorTimestamp}] ❌ SMS Error: ${errorMessage}`);
            
            if (error.name === 'TypeError' && errorMessage.includes('Failed to fetch')) {
                setDebugInfo(prev => prev + `\n[${errorTimestamp}] 🔗 Network Error: Cannot connect to backend server`);
                setDebugInfo(prev => prev + `\n[${errorTimestamp}] 💡 Make sure your backend server is running on ${API_BASE_URL}`);
            }
            
            console.error('SMS sending error:', error);
            
            return {
                success: false,
                error: errorMessage,
                details: error.toString()
            };
        }
    };

    // Updated form submission with better error handling
    const handleFormSubmit = async () => {
  if (!isFormValid()) return; // don't submit if form invalid

  setIsSubmitting(true);
  try {
    const response = await fetch("http://localhost:5000/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: formData.description, // 👈 send the textarea content
      }),
    });

    const data = await response.json();
    if (data.success) {
      alert("SMS sent successfully!");
      setFormData({ ...formData, description: "" }); // clear description
    } else {
      alert("Failed to send SMS: " + data.error);
    }
  } catch (err) {
    console.error("Error sending SMS:", err);
    alert("Something went wrong while sending SMS");
  } finally {
    setIsSubmitting(false);
  }
};


    const isFormValid = () => {
        return formData.reporterName && 
               formData.reporterPhone && 
               formData.location && 
               formData.date && 
               formData.time && 
               formData.description;
    };

    if (showCamera) {
        return <NativeCamera onCapture={handleCapture} onClose={closeCamera} />;
    }

    if (showSuccess) {
        return (
            <div className="space-y-6">
                <BackButton onClick={() => setCurrentRoute('/')} />
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Report Submitted Successfully!</h2>
                    <p className="text-slate-600 mb-4">
                        SMS notifications have been sent to {PHONE_DATABASE.length} registered contacts.
                    </p>
                    <p className="text-sm text-slate-500">
                        Redirecting to dashboard in a few seconds...
                    </p>
                </div>
            </div>
        );
    }

    if (showForm) {
        return (
            <div className="space-y-6">
                <BackButton onClick={() => setShowForm(false)} />
                
                {/* Backend Status Indicator */}
                {backendStatus.checked && (
                    <div className={`p-4 rounded-lg border ${
                        backendStatus.online 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                    }`}>
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                                backendStatus.online ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className={`text-sm font-medium ${
                                backendStatus.online ? 'text-green-800' : 'text-red-800'
                            }`}>
                                Backend Status: {backendStatus.online ? 'Online' : 'Offline'}
                            </span>
                        </div>
                        {!backendStatus.online && (
                            <p className="text-red-600 text-sm mt-1">
                                Please ensure your backend server is running on {API_BASE_URL}
                            </p>
                        )}
                        {backendStatus.online && backendStatus.twilioConfigured === false && (
                            <p className="text-yellow-600 text-sm mt-1">
                                ⚠️ Twilio credentials not configured in backend
                            </p>
                        )}
                    </div>
                )}

                {/* Error Display */}
                {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-bold text-red-800 text-sm mb-2">Submission Error:</h4>
                        <p className="text-red-600 text-sm">{submitError}</p>
                    </div>
                )}
                
                {/* Debug Info Panel - Remove this in production */}
                {debugInfo && (
                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                        <h4 className="font-bold text-sm mb-2">Debug Information:</h4>
                        <pre className="text-xs whitespace-pre-wrap overflow-x-auto bg-white p-2 rounded border max-h-40 overflow-y-auto">
                            {debugInfo}
                        </pre>
                    </div>
                )}

                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Your Report</h1>
                    <p className="text-slate-600">Animal: <span className="font-semibold text-emerald-600">{selectedAnimal}</span></p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                    {/* Reporter Information */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Reporter Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="reporterName"
                                    value={formData.reporterName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="reporterPhone"
                                    value={formData.reporterPhone}
                                    onChange={handleInputChange}
                                    placeholder="+91XXXXXXXXXX"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    name="reporterEmail"
                                    value={formData.reporterEmail}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sighting Details */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Sighting Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Near Bandipur National Park, Karnataka"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Number of Animals
                                    </label>
                                    <select
                                        name="animalCount"
                                        value={formData.animalCount}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Behavior
                                    </label>
                                    <select
                                        name="behavior"
                                        value={formData.behavior}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    >
                                        <option value="">Select behavior</option>
                                        <option value="Calm/Peaceful">Calm/Peaceful</option>
                                        <option value="Aggressive">Aggressive</option>
                                        <option value="Feeding">Feeding</option>
                                        <option value="With young">With young</option>
                                        <option value="Crossing road">Crossing road</option>
                                        <option value="Near human settlement">Near human settlement</option>
                                        <option value="Injured">Injured</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Detailed Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Provide detailed description of the sighting, animal behavior, surroundings, etc."
                            rows="4"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>

                    {/* Photo Capture */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <Camera className="w-4 h-4 inline mr-1" />
                            Photos
                        </label>
                        
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={openCamera}
                                className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2"
                            >
                                <Camera className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-600">Open Camera to Take Photos</span>
                            </button>

                            {capturedImages.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-2">
                                        Captured Photos ({capturedImages.length})
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {capturedImages.map((image) => (
                                            <div key={image.id} className="relative">
                                                <img
                                                    src={image.src}
                                                    alt="Captured wildlife"
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => retakePhoto(image.id)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                                    title="Remove photo"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded text-center">
                                                    {image.timestamp}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Click to open camera and capture photos of the wildlife sighting
                        </p>
                    </div>

                    {/* Submit Button */}
                   <div className="pt-4 border-t">
  <button
    type="button"
    onClick={handleFormSubmit}
    disabled={!isFormValid() || isSubmitting || !backendStatus.online}
    className={`w-full py-4 rounded-lg font-medium transition-all flex items-center justify-center ${
      isFormValid() && !isSubmitting && backendStatus.online
        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
    }`}
  >
    {isSubmitting ? (
      <>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        Sending SMS Notifications...
      </>
    ) : !backendStatus.online ? (
      <>
        <X className="w-5 h-5 mr-2" />
        Backend Offline - Cannot Submit
      </>
    ) : (
      <>
        <Send className="w-5 h-5 mr-2" />
        Submit Report & Send SMS Alerts
      </>
    )}
  </button>

  <p className="text-xs text-slate-500 mt-2 text-center">
    This will send SMS notifications to {PHONE_DATABASE.length} registered contacts
  </p>

  {!backendStatus.online && (
    <p className="text-xs text-red-500 mt-1 text-center">
      Please start your backend server on {API_BASE_URL} to enable SMS functionality
    </p>
  )}

</div>

                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <BackButton onClick={() => setCurrentRoute('/')} />
            
            {/* Backend Status Indicator */}
            {backendStatus.checked && (
                <div className={`p-3 rounded-lg border ${
                    backendStatus.online 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-yellow-50 border-yellow-200'
                }`}>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                            backendStatus.online ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className={`text-sm ${
                            backendStatus.online ? 'text-green-800' : 'text-yellow-800'
                        }`}>
                            {backendStatus.online 
                                ? 'SMS service is online and ready' 
                                : 'SMS service is offline - reports will be saved locally'
                            }
                        </span>
                        <button
                            onClick={checkBackendStatus}
                            className="ml-auto text-xs px-2 py-1 rounded bg-white border hover:bg-gray-50"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Submit Report</h1>
                <p className="text-slate-600">Report wildlife sightings to help our AI system</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-lg font-bold mb-6">What did you see?</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {['Elephant', 'Tiger', 'Sloth Bear', 'Leopard', 'Wild Boar', 'Gaur', 'Deer', 'Monkey', 'Rhino'].map((animal) => {
                        const emojis = {
                            Elephant: '🐘',
                            Tiger: '🐅',
                            'Sloth Bear': '🐻',
                            Leopard: '🐆',
                            'Wild Boar': '🐗',
                            Gaur: '🐃',
                            Deer: '🦌',
                            Monkey: '🐒',
                            Rhino: '🦏',
                        };

                        return (
                            <button
                                key={animal}
                                onClick={() => setSelectedAnimal(animal)}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    selectedAnimal === animal
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <div className="text-2xl mb-2">{emojis[animal]}</div>
                                <p className="font-medium">{animal}</p>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={handleInitialSubmit}
                    disabled={!selectedAnimal}
                    className={`w-full py-4 rounded-lg font-medium transition-all ${
                        selectedAnimal
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                >
                    Continue to Report Details
                </button>
            </div>
        </div>
    );
};

export default ReportComponent;
