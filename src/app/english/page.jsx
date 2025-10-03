'use client'
import React, { useState, useEffect } from 'react'

export default function English() {
  const [formData, setFormData] = useState({
    name: '',
    weightGoal: '',
    disorders: '',
    weight: '',
    heightFeet: '',
    heightInches: '',
    heightCm: '',
    age: '',
    whatsapp: '',
    email: '',
    village: '',
    taluka: '',
    district: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [fieldFocus, setFieldFocus] = useState('');

  // Progress calculation
  useEffect(() => {
    const steps = [25, 50, 75, 100];
    setProgress(steps[currentStep - 1] || 25);
  }, [currentStep]);

  // Psychological micro-interactions
  const handleInputFocus = (fieldName) => {
    setFieldFocus(fieldName);
  };

  const handleInputBlur = () => {
    setFieldFocus('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate height in cm when feet/inches change
    if (name === 'heightFeet' || name === 'heightInches') {
      const feet = name === 'heightFeet' ? value : formData.heightFeet;
      const inches = name === 'heightInches' ? value : formData.heightInches;
      
      if (feet && inches) {
        const totalInches = parseInt(feet) * 12 + parseInt(inches);
        const cm = (totalInches * 2.54).toFixed(1);
        setFormData(prev => ({
          ...prev,
          heightCm: cm
        }));
      }
    }

    // Auto-calculate feet/inches when cm changes
    if (name === 'heightCm' && value) {
      const totalInches = value / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = (totalInches % 12).toFixed(1);
      setFormData(prev => ({
        ...prev,
        heightFeet: feet || '',
        heightInches: inches || ''
      }));
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '253a67d7-604f-406d-87ac-080b4ceb92e0',
          ...formData,
          subject: `New Customer - ${formData.name}`,
          from_name: `${formData.weightGoal}`
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          weightGoal: '',
          disorders: '',
          weight: '',
          heightFeet: '',
          heightInches: '',
          heightCm: '',
          age: '',
          whatsapp: '',
          email: '',
          village: '',
          taluka: '',
          district: ''
        });
        setCurrentStep(1);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Floating label animation component
  const FloatingInput = ({ label, name, type = 'text', required = false, ...props }) => (
    <div className="relative">
      <input
        {...props}
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        onFocus={() => handleInputFocus(name)}
        onBlur={handleInputBlur}
        required={required}
        className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:shadow-2xl smoothTransiotn outline-none text-gray-800 font-medium peer"
        placeholder=" "
      />
      <label className={`absolute left-4 transition-all duration-300 pointer-events-none smoothTransiotn ${
        formData[name] || fieldFocus === name 
          ? 'top-2 text-xs text-blue-600 font-semibold' 
          : 'top-4 text-gray-500'
      }`}>
        {label} {required && '*'}
      </label>
    </div>
  );

  return (
    <div className="w-full min-h-screen gradientBg py-4 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Progress Header */}
        <div className="text-center mb-8 fadein">
          <div className="inline-flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg mb-6">
            <div className="w-64 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full smoothTransiotn shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="ml-4 text-sm font-semibold text-gray-700 min-w-12">
              {progress}%
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Health Journey Starts Here
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            Let's create your personalized health plan together
          </p>
        </div>

        {/* Multi-step Form Container */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 smoothTransiotn hover:shadow-3xl border border-white/20">
          {/* Step Indicators */}
          <div className="flex justify-center mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center smoothTransiotn ${
                  currentStep >= step 
                    ? 'bg-blue-500 text-white shadow-lg scale-110' 
                    : 'bg-gray-200 text-gray-400'
                } font-semibold`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-8 h-1 mx-2 smoothTransiotn ${
                    currentStep > step ? 'bg-blue-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          {submitStatus === 'success' && (
            <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl fadein">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-green-800 text-center mb-2">Welcome to Your Health Journey!</h3>
              <p className="text-green-700 text-center">
                Your information has been received. Our health expert will contact you within 24 hours to begin your transformation.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl fadein">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-red-800">Connection Issue</span>
              </div>
              <p className="mt-2 text-red-700">
                Please check your connection and try again. Your data is saved locally.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="fadein space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">About You</h2>
                  <p className="text-gray-600">Let's start with your basic information</p>
                </div>
                
                <FloatingInput
                  label="Full Name"
                  name="name"
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput
                    label="Age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    required
                  />
                  
                  <div className="relative">
                    <select
                      name="weightGoal"
                      value={formData.weightGoal}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus('weightGoal')}
                      onBlur={handleInputBlur}
                      required
                      className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:shadow-2xl smoothTransiotn outline-none text-gray-800 font-medium appearance-none"
                    >
                      <option value="">Select Your Goal</option>
                      <option value="gain">🎯 Weight Gain</option>
                      <option value="lose">⚡ Weight Loss</option>
                      <option value="maintain">⚖️ Maintain Weight</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg smoothTransiotn transform hover:scale-105 active:scale-95"
                >
                  Continue to Health Details →
                </button>
              </div>
            )}

            {/* Step 2: Health Information */}
            {currentStep === 2 && (
              <div className="fadein space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Health Metrics</h2>
                  <p className="text-gray-600">Help us understand your current health status</p>
                </div>
                
                <FloatingInput
                  label="Current Weight (KG)"
                  name="weight"
                  type="number"
                  min="1"
                  step="0.1"
                  required
                />

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Height Measurement</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex gap-3">
                      <FloatingInput
                        label="Feet"
                        name="heightFeet"
                        type="number"
                        min="0"
                      />
                      <FloatingInput
                        label="Inches"
                        name="heightInches"
                        type="number"
                        min="0"
                        max="11"
                      />
                    </div>
                    <FloatingInput
                      label="Centimeters"
                      name="heightCm"
                      type="number"
                      min="1"
                      step="0.1"
                    />
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 flex items-center justify-center border-2 border-blue-100">
                      <span className="text-lg font-bold text-blue-600">
                        {formData.heightCm ? `${formData.heightCm} cm` : '---'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    name="disorders"
                    value={formData.disorders}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus('disorders')}
                    onBlur={handleInputBlur}
                    rows="4"
                    className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:shadow-2xl smoothTransiotn outline-none text-gray-800 font-medium resize-none peer"
                    placeholder=" "
                  />
                  <label className={`absolute left-4 transition-all duration-300 pointer-events-none smoothTransiotn ${
                    formData.disorders || fieldFocus === 'disorders' 
                      ? 'top-2 text-xs text-blue-600 font-semibold' 
                      : 'top-4 text-gray-500'
                  }`}>
                    Medical Conditions or Concerns (Optional)
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl smoothTransiotn transform hover:scale-105 active:scale-95"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg smoothTransiotn transform hover:scale-105 active:scale-95"
                  >
                    Continue to Contact →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <div className="fadein space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Get in Touch</h2>
                  <p className="text-gray-600">How should we reach you?</p>
                </div>
                
                <FloatingInput
                  label="WhatsApp Number"
                  name="whatsapp"
                  type="tel"
                  required
                />
                
                <FloatingInput
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                />

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl smoothTransiotn transform hover:scale-105 active:scale-95"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg smoothTransiotn transform hover:scale-105 active:scale-95"
                  >
                    Almost Done →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Address & Submit */}
            {currentStep === 4 && (
              <div className="fadein space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Details</h2>
                  <p className="text-gray-600">Final step to complete your registration</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FloatingInput
                    label="Village"
                    name="village"
                    required
                  />
                  <FloatingInput
                    label="Taluka"
                    name="taluka"
                    required
                  />
                  <FloatingInput
                    label="District"
                    name="district"
                    required
                  />
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Ready to Begin Your Journey?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your information is encrypted and secure. By submitting, you agree to receive personalized health guidance.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl smoothTransiotn transform hover:scale-105 active:scale-95"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-4 font-semibold rounded-2xl shadow-lg smoothTransiotn transform hover:scale-105 active:scale-95 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Starting Your Journey...
                      </div>
                    ) : (
                      '🎯 Start My Health Journey'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-8 fadein">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg inline-block">
            <p className="text-gray-600 text-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Your information is securely encrypted and confidential
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}