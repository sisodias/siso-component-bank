import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Check, Copy } from 'lucide-react';

const OTPInput = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPasted, setIsPasted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const allFilled = otp.every(digit => digit !== '');
    setIsComplete(allFilled);
  }, [otp]);

  const handleChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setIsPasted(false);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length > 0) {
      const newOtp = Array(6).fill('');
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      setIsPasted(true);
      
      // Focus the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      setTimeout(() => inputRefs.current[focusIndex]?.focus(), 0);
    }
  };

  const clearOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setIsPasted(false);
    setIsComplete(false);
    inputRefs.current[0]?.focus();
  };

  const copyOtp = () => {
    const otpString = otp.join('');
    navigator.clipboard.writeText(otpString);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses = {
    container: isDarkMode 
      ? 'bg-gray-900 text-white min-h-screen' 
      : 'bg-gray-50 text-gray-900 min-h-screen',
    card: isDarkMode 
      ? 'bg-gray-800 border-gray-700 shadow-xl' 
      : 'bg-white border-gray-200 shadow-lg',
    input: isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400' 
      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
    inputPasted: isDarkMode 
      ? 'bg-green-800 border-green-600 text-green-100' 
      : 'bg-green-50 border-green-400 text-green-800',
    inputComplete: isDarkMode 
      ? 'bg-blue-800 border-blue-600 text-blue-100' 
      : 'bg-blue-50 border-blue-400 text-blue-800',
    button: isDarkMode 
      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
      : 'bg-blue-500 hover:bg-blue-600 text-white',
    buttonSecondary: isDarkMode 
      ? 'bg-gray-600 hover:bg-gray-700 text-white border-gray-500' 
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
    themeButton: isDarkMode 
      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
  };

  return (
    <div className={`${themeClasses.container} w-full flex items-center justify-center p-4 transition-colors duration-200`}>
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleTheme}
            className={`${themeClasses.themeButton} p-2 rounded-lg transition-colors duration-200`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Main Card */}
        <div className={`${themeClasses.card} rounded-2xl border p-8 transition-colors duration-200`}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Enter Verification Code</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              We've sent a 6-digit code to your device
            </p>
          </div>

          {/* OTP Input Fields */}
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`
                  w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${isPasted ? themeClasses.inputPasted : 
                    isComplete ? themeClasses.inputComplete : 
                    themeClasses.input}
                  ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
                `}
                maxLength="1"
                autoComplete="off"
              />
            ))}
          </div>

          {/* Status Indicators */}
          {isPasted && (
            <div className="text-center mb-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-700'
              }`}>
                <Check size={14} />
                Code pasted successfully
              </span>
            </div>
          )}

          {isComplete && (
            <div className="text-center mb-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                isDarkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-700'
              }`}>
                <Check size={14} />
                Code complete: {otp.join('')}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => alert(`Verifying code: ${otp.join('')}`)}
              disabled={!isComplete}
              className={`
                w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
                ${isComplete 
                  ? `${themeClasses.button} shadow-md transform hover:scale-[1.02]` 
                  : `${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                }
              `}
            >
              Verify Code
            </button>

            <div className="flex gap-2">
              <button
                onClick={clearOtp}
                className={`flex-1 py-2 px-4 rounded-lg font-medium border transition-colors duration-200 ${themeClasses.buttonSecondary}`}
              >
                Clear
              </button>
              
              {isComplete && (
                <button
                  onClick={copyOtp}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${themeClasses.buttonSecondary}`}
                  title="Copy OTP"
                >
                  <Copy size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Didn't receive the code?{' '}
              <button className={`font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}>
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPInput;
