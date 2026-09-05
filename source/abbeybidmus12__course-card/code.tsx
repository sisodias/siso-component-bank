import React, { useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number;
  codePreview: string;
  isStarted: boolean;
}

const defaultCourse: Course = {
  id: '1',
  title: 'Python Fundamentals',
  description: 'Master the basics of Python programming with hands-on exercises',
  language: 'Python',
  difficulty: 'Beginner',
  duration: '4 weeks',
  progress: 65,
  codePreview: `def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
  isStarted: true,
};

export default function CourseCard() {
  const [isHovered, setIsHovered] = useState(false);
  const course = defaultCourse;

  const getDifficultyColor = () => {
    switch (course.difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Advanced': return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const getLanguageColor = () => {
    switch (course.language) {
      case 'Python': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'JavaScript': return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20';
      case 'SQL': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div 
      className="group relative w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Header */}
      <div className="relative space-y-3 p-6">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h3 className="font-mono text-lg font-semibold text-white">
            {course.title}
          </h3>
        </div>
        
        <p className="font-mono text-sm text-gray-400">
          {course.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs ${getLanguageColor()}`}>
            {course.language}
          </span>
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs ${getDifficultyColor()}`}>
            {course.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-gray-700 px-2 py-0.5 font-mono text-xs text-gray-400">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative space-y-4 px-6 pb-6">
        {course.progress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-gray-400">Progress</span>
              <span className="font-semibold text-blue-500">{course.progress}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-blue-500/20">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="relative overflow-hidden rounded-md border border-gray-700 bg-black/40 p-3 backdrop-blur-sm">
          <div className="absolute right-2 top-2">
            <span className="rounded-md border border-gray-700 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
              preview
            </span>
          </div>
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-gray-300">
            <code>{course.codePreview}</code>
          </pre>
        </div>
      </div>

      {/* Footer */}
      <div className="relative px-6 pb-6">
        <button className="group/btn flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2 font-mono font-semibold text-black transition-all duration-300 hover:bg-blue-500 hover:text-white">
          {course.isStarted ? (
            <>
              Continue Learning
              <svg 
                className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          ) : (
            <>
              Start Course
              <svg 
                className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}