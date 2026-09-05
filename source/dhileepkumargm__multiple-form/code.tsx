import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Progress Indicator Component ---
const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            {/* Step circle */}
            <div className="relative">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                  i < currentStep
                    ? "bg-indigo-600 text-white"
                    : i === currentStep
                    ? "bg-indigo-500 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/30"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {i < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{i + 1}</span>
                )}
              </div>
              
              {/* Step label */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span 
                  className={`text-xs font-medium ${
                    i <= currentStep ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div 
                className={`flex-auto border-t-2 transition-colors duration-300 ${
                  i < currentStep ? "border-indigo-600" : "border-gray-300 dark:border-gray-700"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// --- Form Steps Components ---
const PersonalInfoStep = ({ formData, updateFormData, errors }) => (
  <div className="space-y-4">
    <div>
      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Full Name
      </label>
      <input
        type="text"
        id="fullName"
        name="fullName"
        value={formData.fullName || ''}
        onChange={updateFormData}
        className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
          errors.fullName 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900'
        }`}
        placeholder="John Doe"
      />
      {errors.fullName && (
        <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
      )}
    </div>
    
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Email Address
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email || ''}
        onChange={updateFormData}
        className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
          errors.email 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900'
        }`}
        placeholder="john@example.com"
      />
      {errors.email && (
        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
      )}
    </div>
    
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Phone Number
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={formData.phone || ''}
        onChange={updateFormData}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        placeholder="(123) 456-7890"
      />
    </div>
  </div>
);

const AddressStep = ({ formData, updateFormData, errors }) => (
  <div className="space-y-4">
    <div>
      <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Street Address
      </label>
      <input
        type="text"
        id="address"
        name="address"
        value={formData.address || ''}
        onChange={updateFormData}
        className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
          errors.address 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900'
        }`}
        placeholder="123 Main St"
      />
      {errors.address && (
        <p className="mt-1 text-sm text-red-500">{errors.address}</p>
      )}
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city || ''}
          onChange={updateFormData}
          className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.city 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900'
          }`}
          placeholder="New York"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-500">{errors.city}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          State / Province
        </label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.state || ''}
          onChange={updateFormData}
          className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.state 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900'
          }`}
          placeholder="NY"
        />
        {errors.state && (
          <p className="mt-1 text-sm text-red-500">{errors.state}</p>
        )}
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Postal Code
        </label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={formData.postalCode || ''}
          onChange={updateFormData}
          className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.postalCode 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900'
          }`}
          placeholder="10001"
        />
        {errors.postalCode && (
          <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Country
        </label>
        <select
          id="country"
          name="country"
          value={formData.country || ''}
          onChange={updateFormData}
          className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.country 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900'
          }`}
        >
          <option value="">Select Country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
          <option value="au">Australia</option>
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-500">{errors.country}</p>
        )}
      </div>
    </div>
  </div>
);

const AccountStep = ({ formData, updateFormData, errors }) => (
  <div className="space-y-4">
    <div>
      <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Username
      </label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username || ''}
        onChange={updateFormData}
        className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
          errors.username 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900'
        }`}
        placeholder="johndoe"
      />
      {errors.username && (
        <p className="mt-1 text-sm text-red-500">{errors.username}</p>
      )}
    </div>
    
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password || ''}
        onChange={updateFormData}
        className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
          errors.password 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900'
        }`}
        placeholder="••••••••••••"
      />
      {errors.password && (
        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
      )}
    </div>
    
    <div>
      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Confirm Password
      </label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword || ''}
        onChange={updateFormData}
        className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
          errors.confirmPassword 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900'
        }`}
        placeholder="••••••••••••"
      />
      {errors.confirmPassword && (
        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
      )}
    </div>
  </div>
);

const ReviewStep = ({ formData }) => (
  <div className="space-y-6">
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
      <h3 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">Personal Information</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Full Name</p>
          <p className="font-medium text-gray-900 dark:text-white">{formData.fullName}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Email</p>
          <p className="font-medium text-gray-900 dark:text-white">{formData.email}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Phone</p>
          <p className="font-medium text-gray-900 dark:text-white">{formData.phone || 'Not provided'}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
      <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Address</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="col-span-2">
          <p className="text-gray-600 dark:text-gray-400">Street Address</p>
          <p className="font-medium text-gray-900 dark:text-white">{formData.address}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">City</p>
          <p className="font-medium text-gray-900 dark:text-white">{formData.city}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">State / Province</p>
          <p className="font-medium text-gray-900 dark:text-white">{formData.state}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Postal Code</p>
          <p className="font-medium text-gray-900 dark:text-white">{formData.postalCode}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Country</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formData.country === 'us' && 'United States'}
            {formData.country === 'ca' && 'Canada'}
            {formData.country === 'uk' && 'United Kingdom'}
            {formData.country === 'au' && 'Australia'}
          </p>
        </div>
      </div>
    </div>
    
    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
      <h3 className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">Account Details</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Username</p>
          <p className="font-medium text-gray-900 dark:text-white">{formData.username}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Password</p>
          <p className="font-medium text-gray-900 dark:text-white">••••••••••••</p>
        </div>
      </div>
    </div>
    
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">Privacy Policy</a>
        </label>
      </div>
    </div>
  </div>
);

const SuccessStep = () => (
  <div className="text-center py-10">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 className="mt-3 text-xl font-medium text-gray-900 dark:text-white">Registration Complete!</h3>
    <p className="mt-2 text-gray-600 dark:text-gray-400">
      Thank you for signing up. Your account has been successfully created.
    </p>
    <div className="mt-6">
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => window.location.reload()}
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

// --- Main Component ---
const MultiStepForm = () => {
  const steps = [
    { label: "Personal", component: PersonalInfoStep, validationFields: ['fullName', 'email'] },
    { label: "Address", component: AddressStep, validationFields: ['address', 'city', 'state', 'postalCode', 'country'] },
    { label: "Account", component: AccountStep, validationFields: ['username', 'password', 'confirmPassword'] },
    { label: "Review", component: ReviewStep, validationFields: [] },
    { label: "Complete", component: SuccessStep, validationFields: [] }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState("right");

  const validateStep = () => {
    const currentValidationFields = steps[currentStep].validationFields;
    const newErrors = {};
    
    currentValidationFields.forEach(field => {
      // Basic required field validation
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
      
      // Email validation
      if (field === 'email' && formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
      }
      
      // Password validation
      if (field === 'password' && formData.password) {
        if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
      }
      
      // Password confirmation validation
      if (field === 'confirmPassword' && formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }

      // Postal code validation
      if (field === 'postalCode' && formData.postalCode) {
        if (!/^\d{5}(-\d{4})?$/.test(formData.postalCode) && formData.country === 'us') {
          newErrors.postalCode = 'Please enter a valid postal code';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      if (validateStep()) {
        setDirection("right");
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection("left");
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setIsSubmitting(true);
      
      // Simulate API submission
      setTimeout(() => {
        setIsSubmitting(false);
        setDirection("right");
        setCurrentStep(steps.length - 1);
      }, 1500);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  // Animation variants for sliding effect
  const slideVariants = {
    hidden: (direction) => ({
      x: direction === "right" ? 100 : -100,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    },
    exit: (direction) => ({
      x: direction === "right" ? -100 : 100,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    })
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-8 pt-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Fill out the form below to get started.</p>
          
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CurrentStepComponent
                  formData={formData}
                  updateFormData={handleInputChange}
                  errors={errors}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {currentStep !== steps.length - 1 && (
            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-650'
                }`}
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </button>
              
              {currentStep === steps.length - 2 ? (
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleNext}
                >
                  Next
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;