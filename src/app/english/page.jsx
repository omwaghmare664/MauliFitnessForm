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
        if (!value.trim()) error = 'Name is required'
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters'
        break
        
      case 'goal':
        if (!value) error = 'Please select a goal'
        break
        
      case 'weight':
        if (!value) error = 'Weight is required'
        else if (parseFloat(value) < 20 || parseFloat(value) > 300) error = 'Weight must be between 20-300 KG'
        break
        
      case 'heightFeet':
        if (value && (parseFloat(value) < 2 || parseFloat(value) > 8)) error = 'Feet must be between 2-8'
        break
        
      case 'heightInches':
        if (value && (parseFloat(value) < 0 || parseFloat(value) >= 12)) error = 'Inches must be between 0-11.9'
        break
        
      case 'heightCm':
        if (value && (parseFloat(value) < 50 || parseFloat(value) > 250)) error = 'Height must be between 50-250 cm'
        break
        
      case 'age':
        if (!value) error = 'Age is required'
        else if (parseInt(value) < 12 || parseInt(value) > 100) error = 'Age must be between 12-100'
        break
        
      case 'whatsapp':
        if (!value) error = 'WhatsApp number is required'
        else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) error = 'Enter a valid 10-digit WhatsApp number'
        break
        
      case 'email':
        if (!value) error = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email address'
        break
        
      case 'village':
        if (!value.trim()) error = 'Village is required'
        break
        
      case 'taluka':
        if (!value.trim()) error = 'Taluka is required'
        break
        
      case 'district':
        if (!value.trim()) error = 'District is required'
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
      newErrors.heightFeet = 'Please enter height in feet/inches or centimeters'
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
          nativeLanguage: 'English',
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
        <h1 className='font-bold text-2xl w-full flex items-center justify-center tracking-wide border-b py-5'>Fill Details</h1>

        <form className='w-full pt-8 h-full flex flex-col gap-6' onSubmit={handleSubmit}>
          {/* Name */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="name">Full Name: *</label>
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
            <label className='text-gray-700 font-medium' htmlFor="goal">Weight Goal: *</label>
            <select 
              name="goal" 
              value={formData.goal}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`px-4 py-3 w-full outline-none bg-gray-100 rounded-md border transition-colors ${
                errors.goal ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            >
              <option value="">Select your goal</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Weight Gain">Weight Gain</option>
              <option value="Weight Maintain">Fitness</option>
            </select>
            <ErrorMessage error={errors.goal} />
          </div>

          {/* Disorders */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="disorders">Any Disorder/Medical Condition:</label>
            <input 
              name='disorders' 
              value={formData.disorders}
              onChange={handleInputChange}
              placeholder='e.g., Diabetes, Thyroid, Sugar' 
              className='bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border border-gray-300 focus:border-blue-500 transition-colors' 
            />
          </div>

          {/* Weight */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="weight">Weight (KG): *</label>
            <input 
              name='weight' 
              type='number'
              step="0.1"
              min="20"
              max="300"
              value={formData.weight}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder='Enter weight in kilograms' 
              className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                errors.weight ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <ErrorMessage error={errors.weight} />
          </div>

          {/* Height */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium'>Height: *</label>
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
                    placeholder='Feet' 
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
                    placeholder='Inches' 
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
                  placeholder='Centimeters' 
                  className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                    errors.heightCm ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>
            <p className='text-sm text-gray-500 mt-2'>
              {formData.heightCm ? `Height: ${formData.heightCm} cm` : 'Enter height in feet/inches or centimeters'}
            </p>
            <ErrorMessage error={errors.heightFeet} />
          </div>

          {/* Age */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="age">Age: *</label>
            <input 
              name='age' 
              type='number'
              min="12"
              max="100"
              value={formData.age}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder='Enter your age' 
              className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                errors.age ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <ErrorMessage error={errors.age} />
          </div>

          {/* WhatsApp Number */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="whatsapp">WhatsApp Number: *</label>
            <input 
              name='whatsapp' 
              type='tel'
              value={formData.whatsapp}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder='Enter 10-digit WhatsApp number' 
              className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                errors.whatsapp ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <ErrorMessage error={errors.whatsapp} />
          </div>

          {/* Email */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium' htmlFor="email">Email: *</label>
            <input 
              name='email' 
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder='Enter your email address' 
              className={`bg-gray-100 pt-2 px-4 py-3 w-full rounded-md outline-none border transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            <ErrorMessage error={errors.email} />
          </div>

          {/* Address */}
          <div className='flex flex-col items-start gap-2 border-gray-400 border-b pb-5'>
            <label className='text-gray-700 font-medium'>Address: *</label>
            <div className='flex flex-col md:flex-row gap-4 w-full'>
              <div className='flex-1'>
                <input 
                  name='village' 
                  value={formData.village}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder='Village' 
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
                  placeholder='Taluka' 
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
                  placeholder='District' 
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