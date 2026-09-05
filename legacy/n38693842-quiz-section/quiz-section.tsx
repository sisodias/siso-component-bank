"use client"

import { useState } from "react"

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
    />
  </svg>
)

const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const Gift = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
    />
  </svg>
)

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

const quizData: Question[] = [
  {
    id: 1,
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Aluminum", "Gold", "Argon"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "How many bones are there in an adult human body?",
    options: ["186", "206", "226", "246"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "What is the speed of light in a vacuum?",
    options: ["299,792,458 m/s", "300,000,000 m/s", "186,000 miles/s", "All of the above"],
    correctAnswer: 0,
  },
]

export function Component() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quizData.length).fill(null))

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowFeedback(true)

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)

    if (answerIndex === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1])
      setShowFeedback(answers[currentQuestion + 1] !== null)
    } else {
      setQuizCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1])
      setShowFeedback(answers[currentQuestion - 1] !== null)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowFeedback(false)
    setQuizCompleted(false)
    setAnswers(Array(quizData.length).fill(null))
  }

  const calculateScore = () => {
    return answers.reduce((total, answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        return total + 1
      }
      return total
    }, 0)
  }

  const getScoreMessage = () => {
    const finalScore = calculateScore()
    const percentage = (finalScore / quizData.length) * 100
    if (percentage >= 80) return "Excellent! You're a science genius!"
    if (percentage >= 60) return "Great job! You know your science!"
    if (percentage >= 40) return "Not bad! Keep learning!"
    return "Keep studying and try again!"
  }

  if (quizCompleted) {
    const finalScore = calculateScore()
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl mx-auto shadow-2xl border-0 bg-white/95 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="text-center pb-8 p-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-blue-200/20 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-blue-400/30 rounded-full blur-xl animate-ping"></div>
              <div className="relative flex justify-center">
                <div className="animate-bounce">
                  <Trophy className="w-20 h-20 text-blue-500 dark:text-blue-400 drop-shadow-lg" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              Quiz Complete!
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Congratulations on completing the science trivia challenge!
            </p>
          </div>
          <div className="space-y-8 p-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 via-purple-100/10 to-blue-100/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-blue-400/20 rounded-2xl blur-sm"></div>
              <div className="relative bg-gradient-to-br from-white to-blue-50/5 dark:from-slate-800 dark:to-blue-900/10 rounded-2xl p-8 border border-blue-200/20 dark:border-blue-400/30">
                <div className="text-center space-y-4">
                  <div className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {finalScore}/{quizData.length}
                  </div>
                  <div className="text-2xl text-slate-600 dark:text-slate-300 font-medium">
                    {Math.round((finalScore / quizData.length) * 100)}% Correct
                  </div>
                  <div className="flex justify-center space-x-1 mt-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`transition-all duration-300 ${
                          i < Math.ceil((finalScore / quizData.length) * 5) ? "animate-pulse" : ""
                        }`}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <Star
                          className={`w-10 h-10 ${
                            i < Math.ceil((finalScore / quizData.length) * 5)
                              ? "text-yellow-400"
                              : "text-slate-300/30 dark:text-slate-600/20"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-blue-50/10 to-purple-50/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full px-6 py-3 border border-blue-200/20 dark:border-blue-400/30">
                <span className="text-lg font-medium text-slate-900 dark:text-slate-100">{getScoreMessage()}</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {quizData.map((_, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 border-2 transition-all duration-300 ${
                      answers[index] === quizData[index].correctAnswer
                        ? "bg-green-100/20 dark:bg-green-400/30 border-green-500 text-green-600 dark:text-green-400"
                        : "bg-red-100/10 dark:bg-red-400/20 border-red-300/30 dark:border-red-400/40 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {answers[index] === quizData[index].correctAnswer ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Q{index + 1}</span>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={resetQuiz}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 rounded-lg"
              >
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/5 dark:from-slate-900 dark:via-slate-800/90 dark:to-blue-900/10 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/95 rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Question {currentQuestion + 1} of {quizData.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Score: {calculateScore()}/{answers.filter((a) => a !== null).length}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {quizData.map((_, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div
                    className={`relative transition-all duration-500 ${
                      index <= currentQuestion ? "animate-bounce" : ""
                    }`}
                  >
                    <Gift
                      className={`w-8 h-8 transition-all duration-300 ${
                        answers[index] !== null
                          ? answers[index] === quizData[index].correctAnswer
                            ? "text-green-500"
                            : "text-red-500"
                          : index === currentQuestion
                            ? "text-blue-600 animate-pulse"
                            : "text-slate-400/40 dark:text-slate-600/30"
                      }`}
                    />
                    {answers[index] !== null && (
                      <div className="absolute -top-1 -right-1">
                        {answers[index] === quizData[index].correctAnswer ? (
                          <CheckCircle className="w-4 h-4 text-green-500 bg-white dark:bg-slate-800 rounded-full" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 bg-white dark:bg-slate-800 rounded-full" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{index + 1}</div>
                </div>
              ))}
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${((currentQuestion + (showFeedback ? 1 : 0)) / quizData.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-balance leading-tight mb-6">
            {quizData[currentQuestion].question}
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            {quizData[currentQuestion].options.map((option, index) => {
              let buttonClass =
                "w-full p-4 text-left border-2 transition-all duration-300 hover:border-blue-400/50 dark:hover:border-blue-500/60 hover:shadow-md dark:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] rounded-lg cursor-pointer"
              let icon = null

              if (showFeedback) {
                if (index === quizData[currentQuestion].correctAnswer) {
                  buttonClass +=
                    " bg-green-100/10 dark:bg-green-400/20 text-green-600 dark:text-green-400 border-green-500 shadow-lg animate-pulse"
                  icon = <CheckCircle className="w-5 h-5 ml-2" />
                } else if (index === selectedAnswer) {
                  buttonClass += " bg-red-100/10 dark:bg-red-400/20 text-red-600 dark:text-red-400 border-red-500"
                  icon = <XCircle className="w-5 h-5 ml-2" />
                } else {
                  buttonClass += " opacity-50 dark:opacity-40"
                }
              } else {
                if (index === selectedAnswer) {
                  buttonClass += " bg-blue-100/10 dark:bg-blue-500/20 border-blue-500"
                } else {
                  buttonClass +=
                    " hover:bg-slate-100/50 dark:hover:bg-slate-700/30 border-slate-200 dark:border-slate-600/50"
                }
              }

              return (
                <button
                  key={index}
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base font-medium">{option}</span>
                    {icon}
                  </div>
                </button>
              )
            })}
          </div>

          {showFeedback && (
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-slate-100/50 to-slate-100/30 dark:from-slate-700/30 dark:to-slate-700/20 border border-slate-300/20 dark:border-slate-600/30">
              <div className="text-center">
                {selectedAnswer === quizData[currentQuestion].correctAnswer ? (
                  <div className="text-green-600 dark:text-green-400 font-medium flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Correct! Well done!</span>
                  </div>
                ) : (
                  <div className="text-slate-600 dark:text-slate-400">
                    The correct answer is:{" "}
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {quizData[currentQuestion].options[quizData[currentQuestion].correctAnswer]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 bg-transparent hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              {selectedAnswer !== null ? "Answer selected" : "Select an answer"}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 px-4 py-2 rounded-lg"
            >
              <span>{currentQuestion === quizData.length - 1 ? "Finish" : "Next"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
