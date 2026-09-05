import React, { useState } from 'react';
import { Star, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackComponent = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { id: 'quality', label: 'Product Quality' },
    { id: 'service', label: 'Customer Service' },
    { id: 'experience', label: 'User Experience' },
    { id: 'delivery', label: 'Delivery' }
  ];

  const handleSubmit = () => {
    if (rating > 0 && selectedCategory && feedback.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setRating(0);
        setFeedback('');
        setSelectedCategory('');
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Orthogonal Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 md:p-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Share Your Feedback
                </h2>
                <p className="text-slate-400 mb-8">
                  Your insights help us create exceptional experiences
                </p>

                <div className="space-y-8">
                  {/* Rating Section */}
                  <div>
                    <label className="block text-sm font-medium mb-4">
                      How would you rate your experience?
                    </label>
                    <div className="flex gap-2 justify-center md:justify-start">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-10 h-10 transition-all duration-200 ${
                              star <= (hoveredRating || rating)
                                ? 'text-amber-500 fill-current'
                                : 'text-slate-600'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-4">
                      What aspect would you like to comment on?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <motion.button
                          key={category.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedCategory === category.id
                              ? 'border-amber-500 bg-amber-500/10'
                              : 'border-slate-700 bg-slate-800/50'
                          }`}
                        >
                          <span className="text-sm font-medium">{category.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div>
                    <label className="block text-sm font-medium mb-4">
                      Share your thoughts
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us more about your experience..."
                      rows="5"
                      className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none text-slate-100"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!rating || !selectedCategory || !feedback.trim()}
                    onClick={handleSubmit}
                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                      rating && selectedCategory && feedback.trim()
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                        : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="p-12 flex flex-col items-center justify-center min-h-[500px]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/40"
                >
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </motion.div>
                <h3 className="text-3xl font-bold mb-4">Thank You!</h3>
                <p className="text-center text-slate-400">
                  Your feedback has been received and will help us improve our services.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackComponent;
