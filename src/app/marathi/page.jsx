'use client'
import React, { useState } from 'react'

export default function Page() {
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
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
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (name, value) => {
    let error = ''
    
   switch (name) {
  case 'name':
    if (!value.trim()) error = 'नाव आवश्यक आहे'
    else if (value.trim().length < 2) error = 'नाव किमान 2 अक्षरे असावे'
    break
    
  case 'goal':
    if (!value) error = 'कृपया एक लक्ष्य निवडा'
    break
    
  case 'weight':
    if (!value) error = 'वजन आवश्यक आहे'
    else if (parseFloat(value) < 20 || parseFloat(value) > 300) error = 'वजन 20-300 किलो दरम्यान असावे'
    break
    
  case 'heightFeet':
    if (value && (parseFloat(value) < 2 || parseFloat(value) > 8)) error = 'फूट 2-8 दरम्यान असावे'
    break
    
  case 'heightInches':
    if (value && (parseFloat(value) < 0 || parseFloat(value) >= 12)) error = 'इंच 0-11.9 दरम्यान असावे'
    break
    
  case 'heightCm':
    if (value && (parseFloat(value) < 50 || parseFloat(value) > 250)) error = 'उंची 50-250 सेमी दरम्यान असावी'
    break
    
  case 'age':
    if (!value) error = 'वय आवश्यक आहे'
    else if (parseInt(value) < 12 || parseInt(value) > 100) error = 'वय 12-100 दरम्यान असावे'
    break
    
  case 'whatsapp':
    if (!value) error = 'व्हाट्सएप नंबर आवश्यक आहे'
    else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) error = 'एक वैध 10-अंकी व्हाट्सएप नंबर प्रविष्ट करा'
    break
    
  case 'email':
    if (!value) error = 'ईमेल आवश्यक आहे'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'एक वैध ईमेल पत्ता प्रविष्ट करा'
    break
    
  case 'village':
    if (!value.trim()) error = 'गाव आवश्यक आहे'
    break
    
  case 'taluka':
    if (!value.trim()) error = 'तालुका आवश्यक आहे'
    break
    
  case 'district':
    if (!value.trim()) error = 'जिल्हा आवश्यक आहे'
    break
    
  default:
    break
}
    
    return error
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Height calculation with decimal support
    if (name === 'heightFeet' || name === 'heightInches') {
      const feet = name === 'heightFeet' ? value : formData.heightFeet
      const inches = name === 'heightInches' ? value : formData.heightInches
      
      if (feet && inches) {
        const totalInches = parseFloat(feet) * 12 + parseFloat(inches)
        const cm = (totalInches * 2.54).toFixed(1)
        setFormData(prev => ({
          ...prev,
          heightCm: cm
        }))
      }
    }

    if (name === 'heightCm' && value) {
      const totalInches = parseFloat(value) / 2.54
      const feet = Math.floor(totalInches / 12)
      const inches = (totalInches % 12).toFixed(1)
      setFormData(prev => ({
        ...prev,
        heightFeet: feet || '',
        heightInches: inches || ''
      }))
    }
  }

  const handleInputBlur = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validate all required fields
    const fieldsToValidate = [
      'name', 'goal', 'weight', 'age', 'whatsapp', 'email', 
      'village', 'taluka', 'district'
    ]
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
      }
    })
    
    // Validate at least one height field is filled
    if (!formData.heightFeet && !formData.heightCm) {
      newErrors.heightFeet = 'कृपया उंची फूट/इंच किंवा सेंटीमीटरमध्ये प्रविष्ट करा'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      const element = document.querySelector(`[name="${firstErrorField}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '253a67d7-604f-406d-87ac-080b4ceb92e0',
          name: formData.name,
          goal: formData.goal,
          disorders: formData.disorders || 'No any',
          weight: formData.weight,
          height: `${formData.heightFeet || ''}ft ${formData.heightInches || ''}in (${formData.heightCm || ''}cm)`,
          age: formData.age,
          whatsapp: formData.whatsapp,
          email: formData.email,
          address: `Village: ${formData.village}, Taluka: ${formData.taluka}, District: ${formData.district}`,
          nativeLanguage: 'Marathi',
          subject: `New Customer Registration - ${formData.name}`,

          from_name: 'Fitness Form'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Form submitted successfully! We will contact you soon.')
        // Reset form
        setFormData({
          name: '',
          goal: '',
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
        })
        setErrors({})
      } else {
        alert('Failed to submit form. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const ErrorMessage = ({ error }) => (
    error ? <span className="text-red-500 text-sm mt-1">{error}</span> : null
  )

  return (
    <div className='w-full min-h-screen flex items-center justify-center gradientBg py-8'>
      <div className='w-[90%] max-w-2xl h-auto px-6 py-6 bg-white rounded-xl shadow-lg'>
        <h1 className='font-bold text-2xl w-full flex items-center justify-center tracking-wide border-b py-5'>पुढील फॉर्म भरा</h1>

        <form className='w-full pt-8 h-full flex flex-col gap-6' onSubmit={handleSubmit}>
          {/* Name */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="name">पूर्णनाव : *</label>
            <input 
              name='name' 
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder='Enter your full name' 
              className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <ErrorMessage error={errors.name} />
          </div>

          {/* Goal */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="goal">वजनाचे लक्ष्य: *</label>
            <select 
              name="goal" 
              value={formData.goal}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`px-4 py-3 w-full outline-none bg-gray-100 rounded-md border transition-colors ${
                errors.goal ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            >
              <option value="">आपले लक्ष्य निवडा </option>
              <option value="Weight Loss">वजन कमी करणे</option>
              <option value="Weight Gain">वजन वाढवणे</option>
              <option value="Weight Maintain">फिटनेस साठी</option>
            </select>
            <ErrorMessage error={errors.goal} />
          </div>

          {/* Disorders */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="disorders">कोणतीही आजार/वैद्यकीय स्थिती:</label>
            <input 
              name='disorders' 
              value={formData.disorders}
              onChange={handleInputChange}
              placeholder='उदा., थायरॉईड, शुगर, इत्यादि.' 
              className='bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border border-gray-300 focus:border-blue-500 transition-colors' 
            />
          </div>

          {/* Weight */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="weight">वजन (किलो): *</label>
            <input 
              name='weight' 
              type='number'
              step="0.1"
              min="20"
              max="300"
              value={formData.weight}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder='किलोग्रॅममध्ये वजन प्रविष्ट करा' 
              className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                errors.weight ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <ErrorMessage error={errors.weight} />
          </div>

          {/* Height */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium'>उंची: *</label>
            <div className='flex flex-col md:flex-row gap-4 w-full'>
              <div className='flex-1 flex gap-2'>
                <div className='flex-1'>
                  <input 
                    name='heightFeet' 
                    type='number'
                    step="0.1"
                    min="2"
                    max="8"
                    value={formData.heightFeet}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder='फूट' 
                    className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                      errors.heightFeet ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                </div>
                <div className='flex-1'>
                  <input 
                    name='heightInches' 
                    type='number'
                    step="0.1"
                    min="0"
                    max="11.9"
                    value={formData.heightInches}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder='इंच' 
                    className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                      errors.heightInches ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>
              <div className='flex-1'>
                <input 
                  name='heightCm' 
                  type='number'
                  step="0.1"
                  min="50"
                  max="250"
                  value={formData.heightCm}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder='सेंटीमीटर' 
                  className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                    errors.heightCm ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>
            <p className='text-sm text-gray-500 mt-2'>
              {formData.heightCm ? `Height: ${formData.heightCm} cm` : 'उंची फूट/इंच किंवा सेंटीमीटरमध्ये प्रविष्ट करा'}
            </p>
            <ErrorMessage error={errors.heightFeet} />
          </div>

          {/* Age */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="age">वय: *</label>
            <input 
              name='age' 
              type='number'
              min="12"
              max="100"
              value={formData.age}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder='आपले वय प्रविष्ट करा' 
              className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                errors.age ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <ErrorMessage error={errors.age} />
          </div>

          {/* WhatsApp Number */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="whatsapp">व्हाट्सएप नंबर: *</label>
            <input 
              name='whatsapp' 
              type='tel'
              value={formData.whatsapp}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder='10-अंकी व्हाट्सएप नंबर प्रविष्ट करा' 
              className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                errors.whatsapp ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <ErrorMessage error={errors.whatsapp} />
          </div>

          {/* Email */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="email">ईमेल पत्ता: *</label>
            <input 
              name='email' 
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder='आपला ईमेल पत्ता प्रविष्ट करा' 
              className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <ErrorMessage error={errors.email} />
          </div>

          {/* Address */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium'>पत्ता: *</label>
            <div className='flex flex-col md:flex-row gap-4 w-full'>
              <div className='flex-1'>
                <input 
                  name='village' 
                  value={formData.village}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder='गाव' 
                  className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                    errors.village ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                <ErrorMessage error={errors.village} />
              </div>
              <div className='flex-1'>
                <input 
                  name='taluka' 
                  value={formData.taluka}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder='तालुका' 
                  className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                    errors.taluka ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                <ErrorMessage error={errors.taluka} />
              </div>
              <div className='flex-1'>
                <input 
                  name='district' 
                  value={formData.district}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder='जिल्हा' 
                  className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                    errors.district ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                <ErrorMessage error={errors.district} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-center pt-4'>
            <button 
              type='submit'
              disabled={isSubmitting}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}