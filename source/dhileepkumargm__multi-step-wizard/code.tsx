import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// --- SVG Icon Components ---
const CheckCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
  </svg>
);

const UserIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

const BuildingOfficeIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-4.5A.75.75 0 019 19.5z" clipRule="evenodd" />
  </svg>
);

const PuzzlePieceIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
  </svg>
);

const FlagIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z" clipRule="evenodd" />
  </svg>
);

// Main Onboarding Wizard Component
export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal info
    firstName: "",
    lastName: "",
    email: "",
    // Company info
    companyName: "",
    role: "",
    teamSize: "",
    // Preferences
    preferences: [],
    // Completed
    completed: false
  });
  const [errors, setErrors] = useState({});
  const [animationDirection, setAnimationDirection] = useState("forward");

  // Step configuration
  const steps = [
    {
      id: "personal",
      title: "Personal Information",
      icon: UserIcon,
      description: "Tell us about yourself"
    },
    {
      id: "company",
      title: "Company Details",
      icon: BuildingOfficeIcon,
      description: "Your work information"
    },
    {
      id: "preferences",
      icon: PuzzlePieceIcon,
      title: "Preferences",
      description: "Customize your experience"
    },
    {
      id: "completed",
      icon: FlagIcon,
      title: "All Set!",
      description: "You're ready to go"
    }
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => {
        const updatedPreferences = checked 
          ? [...prev.preferences, value]
          : prev.preferences.filter(item => item !== value);
        
        return { ...prev, preferences: updatedPreferences };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Navigate to next step
  const handleNext = () => {
    const currentStepId = steps[currentStep].id;
    const newErrors = {};
    
    // Validate current step
    if (currentStepId === "personal") {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    } else if (currentStepId === "company") {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!formData.role.trim()) newErrors.role = "Role is required";
      if (!formData.teamSize) newErrors.teamSize = "Team size is required";
    } else if (currentStepId === "preferences") {
      if (formData.preferences.length === 0) {
        newErrors.preferences = "Please select at least one preference";
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // If validation passes, proceed to next step
    setAnimationDirection("forward");
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    
    // Mark as completed if on last step
    if (currentStep === steps.length - 2) {
      setFormData(prev => ({ ...prev, completed: true }));
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    setAnimationDirection("backward");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Complete the onboarding process
  const handleComplete = () => {
    console.log("Onboarding completed with data:", formData);
    // Here you would typically submit the data to your backend
    alert("Onboarding completed! Check console for submitted data.");
  };
  
  // Animation variants
  const pageVariants = {
    initial: (direction) => ({
      x: direction === "forward" ? "100%" : "-100%",
      opacity: 0
    }),
    in: {
      x: 0,
      opacity: 1
    },
    out: (direction) => ({
      x: direction === "forward" ? "-100%" : "100%",
      opacity: 0
    })
  };
  
  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Progress indicator */}
        <div className="px-6 pt-8 pb-6 md:px-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Get Started</h1>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden h-2 mb-6 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
              <div 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 dark:bg-indigo-500 transition-all duration-500 ease-in-out"
              ></div>
            </div>
            
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div 
                    className={`rounded-full flex items-center justify-center transition-colors ${
                      index <= currentStep 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    } ${index === currentStep ? 'ring-4 ring-indigo-100 dark:ring-indigo-900' : ''} w-10 h-10`}
                  >
                    {index < currentStep ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden sm:block mt-2">
                    <p className={`text-xs font-medium ${
                      index <= currentStep 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Form steps */}
        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 pb-8 pt-6 md:px-10">
          <AnimatePresence initial={false} custom={animationDirection} mode="wait">
            <motion.div
              key={currentStep}
              custom={animationDirection}
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
              className="min-h-[320px] sm:min-h-[350px]"
            >
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{steps[currentStep].title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{steps[currentStep].description}</p>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          First name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 rounded-lg border ${
                            errors.firstName 
                              ? 'border-red-500 dark:border-red-400' 
                              : 'border-gray-300 dark:border-gray-600'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white`}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Last name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 rounded-lg border ${
                            errors.lastName 
                              ? 'border-red-500 dark:border-red-400' 
                              : 'border-gray-300 dark:border-gray-600'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white`}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.email 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white`}
                        placeholder="johndoe@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 2: Company Details */}
              {currentStep === 1 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{steps[currentStep].title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{steps[currentStep].description}</p>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company name
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.companyName 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white`}
                        placeholder="Acme Inc."
                      />
                      {errors.companyName && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.companyName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your role
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.role 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white`}
                        placeholder="Product Manager"
                      />
                      {errors.role && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.role}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Team size
                      </label>
                      <select
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.teamSize 
                            ? 'border-red-500 dark:border-red-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:text-white`}
                      >
                        <option value="">Select team size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501+">501+ employees</option>
                      </select>
                      {errors.teamSize && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.teamSize}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Preferences */}
              {currentStep === 2 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{steps[currentStep].title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{steps[currentStep].description}</p>
                  </div>
                  
                  <div>
                    <fieldset>
                      <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        What are you interested in?
                      </legend>
                      <div className="space-y-3">
                        {[
                          { id: 'analytics', label: 'Analytics & Reporting' },
                          { id: 'automation', label: 'Workflow Automation' },
                          { id: 'collaboration', label: 'Team Collaboration' },
                          { id: 'integration', label: 'Third-party Integrations' },
                          { id: 'security', label: 'Security & Compliance' }
                        ].map((item) => (
                          <div key={item.id} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id={item.id}
                                name="preferences"
                                type="checkbox"
                                value={item.id}
                                checked={formData.preferences.includes(item.id)}
                                onChange={handleChange}
                                className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor={item.id} className="font-medium text-gray-700 dark:text-gray-300">
                                {item.label}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.preferences && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.preferences}</p>
                      )}
                    </fieldset>
                  </div>
                </div>
              )}
              
              {/* Step 4: Completed */}
              {currentStep === 3 && (
                <div className="text-center py-8">
                  <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6">
                      <CheckCircleIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    You're all set!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Thank you for completing the onboarding process, {formData.firstName}. 
                    Your account has been created and is ready to use.
                  </p>
                  
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-6 max-w-md mx-auto text-left mb-8">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Account summary:</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</li>
                      <li><span className="font-medium">Email:</span> {formData.email}</li>
                      <li><span className="font-medium">Company:</span> {formData.companyName}</li>
                      <li><span className="font-medium">Role:</span> {formData.role}</li>
                      <li><span className="font-medium">Team size:</span> {formData.teamSize}</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation buttons */}
          <div className={`mt-8 flex ${currentStep === 0 ? 'justify-end' : 'justify-between'}`}>
            {currentStep > 0 && currentStep < 3 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center justify-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors"
              >
                {currentStep === 2 ? "Finish" : "Next"}
                {currentStep !== 2 && <ArrowRightIcon className="w-5 h-5 ml-2" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="flex items-center justify-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors"
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}