import React, { useRef, useState } from 'react';
import { User, Sparkles } from 'lucide-react';

export function EnhancedBioForm() {
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textAreaRef = useRef(null);
  const maxChars = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    alert('Bio submitted successfully!');
  };

  const handleBioChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setBio(value);
      setCharCount(value.length);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Tell Your Story</h2>
                <p className="text-purple-100 text-sm mt-1">Share what makes you unique</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-3">
              <label htmlFor="bio" className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
                <Sparkles className="w-5 h-5 text-violet-600" />
                Your Bio
              </label>
              
              <div className="relative">
                <textarea
                  id="bio"
                  ref={textAreaRef}
                  value={bio}
                  onChange={handleBioChange}
                  placeholder="I'm passionate about... My journey began when... I love to..."
                  className="w-full min-h-[200px] p-4 bg-gradient-to-br from-gray-50 to-purple-50/30 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-300/50 focus:border-purple-400 text-gray-800 placeholder-gray-400 resize-none transition-all duration-300 shadow-sm"
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.6'
                  }}
                />
                
                {/* Character Count */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-200 shadow-sm">
                  <span className={`text-xs font-medium ${
                    charCount > maxChars * 0.9 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {charCount} / {maxChars}
                  </span>
                </div>
              </div>

              {/* Helpful Tips */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-sm text-gray-700 font-medium mb-2">💡 Tips for a great bio:</p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>• Share your passions and interests</li>
                  <li>• Mention your professional background</li>
                  <li>• Add a personal touch that makes you memorable</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || bio.trim().length === 0}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Bio</span>
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}