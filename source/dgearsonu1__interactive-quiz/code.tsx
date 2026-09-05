import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ChevronRight, HelpCircle } from 'lucide-react';

// Note: This component requires 'framer-motion'.

// --- Internal Data Structure ---
export interface QuizOption {
  /** Unique key for the option. */
  key: string;
  /** The text of the answer choice. */
  text: string;
}

export interface QuizQuestion {
  /** Unique ID for the question. */
  id: string;
  /** The question text. */
  question: string;
  /** Array of multiple-choice options. */
  options: QuizOption[];
  /** The key of the correct answer. */
  correctAnswerKey: string;
  /** Optional explanation provided after submission. */
  explanation?: string;
}

// --- 📦 API (Props) Definition ---
export interface QuizQuestionCardProps {
  /** The question data object. */
  questionData: QuizQuestion;
  /** The index of the current question (1-indexed) for display. */
  questionNumber: number;
  /** Callback function when the user submits their answer. */
  onSubmitAnswer: (questionId: string, isCorrect: boolean) => void;
  /** If true, the card is disabled for interaction (e.g., waiting for next question). */
  disabled?: boolean;
  /** Optional class name for the card container. */
  className?: string;
}

/**
 * An animated, interactive card component for presenting a single quiz question.
 * Provides selection handling, validation, and feedback using Framer Motion.
 */
const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  questionData,
  questionNumber,
  onSubmitAnswer,
  disabled = false,
  className,
}) => {
  const { id, question, options, correctAnswerKey, explanation } = questionData;
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isAnswered = selectedKey !== null;
  const isCorrect = isSubmitted && selectedKey === correctAnswerKey;
  const isIncorrect = isSubmitted && selectedKey !== correctAnswerKey;

  const handleSubmit = useCallback(() => {
    if (!isAnswered || isSubmitted || disabled) return;
    
    const correct = selectedKey === correctAnswerKey;
    setIsSubmitted(true);
    onSubmitAnswer(id, correct);
  }, [id, selectedKey, correctAnswerKey, isSubmitted, disabled, isAnswered, onSubmitAnswer]);


  // Framer Motion variants for the options (subtle scale on select/hover)
  const optionVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.98 },
    hover: { scale: 1.01, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  };
  
  // Logic to determine option styling
  const getOptionClasses = (key: string) => {
    const isSelected = key === selectedKey;
    
    if (!isSubmitted) {
      // Pre-submission styling
      return cn(
        "border-border bg-card text-foreground hover:bg-muted/70",
        isSelected && "border-primary bg-primary/10"
      );
    }

    // Post-submission styling
    if (key === correctAnswerKey) {
      return "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"; // Correct answer
    }
    if (isSelected && isIncorrect) {
      return "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"; // User's incorrect answer
    }
    return "border-border bg-card text-muted-foreground opacity-70"; // Unselected/Neutral
  };


  return (
    <Card className={cn("w-full max-w-2xl mx-auto transition-shadow duration-300", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Question {questionNumber}
        </CardTitle>
        <CardDescription className="text-base text-foreground mt-2">
          {question}
        </CardDescription>
        {/* Optional: Placeholder for images/videos */}
        {/* <div className="h-40 w-full bg-muted mt-4 rounded-md flex items-center justify-center text-muted-foreground">Media Placeholder</div> */}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {options.map((option) => (
          <motion.div
            key={option.key}
            variants={optionVariants}
            whileHover={!isSubmitted ? "hover" : undefined}
            whileTap={!isSubmitted ? "tap" : undefined}
            onClick={() => !isSubmitted && !disabled && setSelectedKey(option.key)}
            className={cn(
              "p-3 border rounded-lg cursor-pointer transition-all duration-200",
              "text-sm font-medium",
              getOptionClasses(option.key),
              (isSubmitted || disabled) && "pointer-events-none"
            )}
            role="radio"
            aria-checked={option.key === selectedKey}
            aria-disabled={isSubmitted || disabled}
          >
            {isSubmitted && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {option.key === correctAnswerKey && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {option.key === selectedKey && isIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
            )}
            <span className={cn("inline-block", isSubmitted && "pl-8")}>
                {option.text}
            </span>
          </motion.div>
        ))}
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t pt-4">
        {/* Submission Feedback and Explanation */}
        <div className="flex flex-col space-y-2">
            {isSubmitted && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("text-sm font-semibold flex items-center space-x-2", isCorrect ? "text-green-500" : "text-red-500")}
                    role="status"
                >
                    {isCorrect ? (
                        <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Correct! Well done.</span>
                        </>
                    ) : (
                        <>
                            <XCircle className="h-4 w-4" />
                            <span>Incorrect. Try to review the explanation.</span>
                        </>
                    )}
                </motion.div>
            )}
            {isSubmitted && explanation && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="text-xs text-muted-foreground flex items-start mt-1"
                >
                    <HelpCircle className="h-4 w-4 mr-1 shrink-0" />
                    <span className="flex-grow">{explanation}</span>
                </motion.div>
            )}
        </div>
        
        {/* Action Button */}
        <Button 
          onClick={isSubmitted ? onSubmitAnswer : handleSubmit}
          disabled={disabled || !isAnswered}
          variant={isSubmitted ? "secondary" : "default"}
          aria-label={isSubmitted ? "Next question" : "Submit answer"}
        >
          {isSubmitted ? (
            <>
              Next Question
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            "Submit Answer"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};


const mockQuestion: QuizQuestion = {
  id: "q_react_1",
  question: "What primary purpose does the 'useState' hook serve in React functional components?",
  options: [
    { key: "a", text: "To define lifecycle methods." },
    { key: "b", text: "To introduce state variables." },
    { key: "c", text: "To perform side effects after rendering." },
    { key: "d", text: "To optimize component rendering." },
  ],
  correctAnswerKey: "b",
  explanation: "The useState hook is the primary way to manage component-specific, reactive data (state) in modern React functional components.",
};

const ExampleUsage = () => {
  const [feedback, setFeedback] = useState<string>('Select an answer and submit.');
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);

  const handleSubmit = (questionId: string, isCorrect: boolean) => {
    setFeedback(isCorrect ? 'Correct! Ready for next question.' : 'Incorrect. Review the explanation.');
    setIsQuestionAnswered(true); // Disable further interaction on the question
    console.log(`Question ${questionId} submitted. Correct: ${isCorrect}`);
    
    // In a real app, this would trigger navigation or state update to load the next question
  };
  
  const handleNextQuestion = () => {
      // Simulate moving to the next question by resetting state
      alert("Moving to the next question...");
      setIsQuestionAnswered(false);
      setFeedback('Select an answer and submit.');
      // Re-render the QuizQuestionCard with the next questionData prop here
  }

  return (
    <div className="p-8 bg-background border rounded-lg max-w-3xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-6">Interactive Quiz Demo</h3>
      
      <QuizQuestionCard
        questionData={mockQuestion}
        questionNumber={1}
        onSubmitAnswer={isQuestionAnswered ? handleNextQuestion : handleSubmit}
        disabled={false}
      />
      
      <p className="mt-6 text-sm text-muted-foreground text-center">
        Status: <strong className="text-foreground">{feedback}</strong>
      </p>
    </div>
  );
};

export default ExampleUsage;