"use client";

import { useEffect, useMemo, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const QUESTION_CUSTOM_ID = "__custom__";

function optionBadge(idx: number) {
  return String.fromCharCode(65 + idx);
}

function IconQuestion({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 20l1.3 -3.9a9 9 0 1 1 3.4 2.9z" />
      <path d="M12 16v.01" />
      <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
    </svg>
  );
}

function IconChevronUp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 15l6 -6l6 6" />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6l6 -6" />
    </svg>
  );
}

export type QuestionOption = {
  id: string;
  label: string;
  description?: string;
};

export type QuestionConfig = {
  kind: "single" | "multi" | "text";
  title: string;
  description?: string;
  options?: QuestionOption[];
  allowCustom?: boolean;
  customLabel?: string;
  customPlaceholder?: string;
  minSelections?: number;
  maxSelections?: number;
  placeholder?: string;
};

export type QuestionAnswer = {
  kind: "single" | "multi" | "text" | "skip";
  selectedIds?: string[];
  text?: string;
};

export type QuestionPromptProps = {
  questions: QuestionConfig[];
  questionIndex?: number;
  totalQuestions?: number;
  onPreviousQuestion?: () => void;
  onNextQuestion?: () => void;
  initialAnswer?: QuestionAnswer;
  submitLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  allowSkip?: boolean;
  onSubmit: (answer: QuestionAnswer) => void;
  onSkip?: () => void;
  className?: string;
};

export function QuestionPrompt({
  questions,
  questionIndex = 1,
  totalQuestions,
  onPreviousQuestion,
  onNextQuestion,
  submitLabel = "Send",
  nextLabel = "Next",
  skipLabel = "Skip",
  allowSkip = true,
  initialAnswer,
  onSubmit,
  onSkip,
  className,
}: QuestionPromptProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");
  const [textValue, setTextValue] = useState("");
  const resolvedTotal = totalQuestions ?? questions.length;
  const clampedIndex = Math.max(1, Math.min(questionIndex, resolvedTotal));
  const activeQuestion = questions[clampedIndex - 1];
  const customEnabled = activeQuestion?.allowCustom ?? false;
  const showNav =
    resolvedTotal > 1 && (!!onPreviousQuestion || !!onNextQuestion);
  const canGoPrev = clampedIndex > 1;
  const canGoNext = clampedIndex < resolvedTotal;
  const isLastQuestion = clampedIndex >= resolvedTotal;
  const primaryLabel = isLastQuestion ? submitLabel : nextLabel;

  useEffect(() => {
    if (!initialAnswer || initialAnswer.kind === "skip") {
      setSelectedIds([]);
      setCustomText("");
      setTextValue("");
      return;
    }
    if (activeQuestion?.kind === "text") {
      setSelectedIds([]);
      setCustomText("");
      setTextValue(initialAnswer.text ?? "");
      return;
    }
    const nextSelected = new Set(initialAnswer.selectedIds ?? []);
    const nextCustomText = initialAnswer.text ?? "";
    if (customEnabled && nextCustomText.trim().length > 0) {
      nextSelected.add(QUESTION_CUSTOM_ID);
    }
    setSelectedIds(Array.from(nextSelected));
    setCustomText(nextCustomText);
    setTextValue("");
  }, [
    activeQuestion?.kind,
    clampedIndex,
    customEnabled,
    initialAnswer?.kind,
    initialAnswer?.text,
    initialAnswer?.selectedIds?.join("|"),
  ]);

  const canSubmit = useMemo(() => {
    if (activeQuestion?.kind === "text") return textValue.trim().length > 0;
    const selectedNonCustom = selectedIds.filter(
      (id) => id !== QUESTION_CUSTOM_ID,
    ).length;
    const hasCustomText = customText.trim().length > 0;
    const total = selectedNonCustom + (hasCustomText ? 1 : 0);
    if (activeQuestion?.kind === "single") return total === 1;
    const min = activeQuestion?.minSelections ?? 1;
    const max = activeQuestion?.maxSelections;
    if (total < min) return false;
    if (typeof max === "number" && total > max) return false;
    return total > 0;
  }, [
    activeQuestion?.kind,
    activeQuestion?.minSelections,
    activeQuestion?.maxSelections,
    selectedIds,
    customText,
    textValue,
  ]);

  const toggleMulti = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSingleSelect = (id: string) => {
    setSelectedIds([id]);
  };

  const handleCustomTextChange = (nextValue: string) => {
    setCustomText(nextValue);
    if (!activeQuestion) return;
    if (activeQuestion.kind === "single") {
      setSelectedIds(nextValue.trim().length > 0 ? [QUESTION_CUSTOM_ID] : []);
      return;
    }
    setSelectedIds((prev) => {
      const hasCustom = prev.includes(QUESTION_CUSTOM_ID);
      if (nextValue.trim().length > 0 && !hasCustom) {
        return [...prev, QUESTION_CUSTOM_ID];
      }
      if (nextValue.trim().length === 0 && hasCustom) {
        return prev.filter((id) => id !== QUESTION_CUSTOM_ID);
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (!canSubmit || !activeQuestion) return;
    if (activeQuestion.kind === "text") {
      onSubmit({ kind: "text", text: textValue.trim() });
      return;
    }
    const selectedNonCustom = selectedIds.filter(
      (id) => id !== QUESTION_CUSTOM_ID,
    );
    const answerText = customText.trim() || undefined;
    onSubmit({
      kind: activeQuestion.kind,
      selectedIds: selectedNonCustom,
      text: answerText || undefined,
    });
  };

  const handleSkip = () => {
    onSkip?.();
    onSubmit({ kind: "skip" });
  };

  if (!activeQuestion) return null;

  const optionRowBase =
    "w-full text-left rounded-md px-2 py-1.5 flex items-center gap-2 -mx-2 hover:bg-neutral-100 dark:hover:bg-neutral-800";
  const badgeBase =
    "h-5 min-w-5 px-1 rounded-[4px] inline-flex items-center justify-center text-sm font-medium border";
  const badgeOff =
    "bg-transparent text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";
  const badgeOn =
    "bg-blue-500 text-white border-blue-500 dark:bg-blue-400 dark:text-neutral-950 dark:border-blue-400";

  return (
    <div
      className={cn(
        "px-3 py-2 space-y-2 bg-white dark:bg-neutral-950",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-px">
        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100">
          <span className="h-5 min-w-5 px-1 rounded-[4px] inline-flex items-center justify-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {clampedIndex}
          </span>
          <span>{activeQuestion.title}</span>
        </div>
      </div>

      {activeQuestion.kind !== "text" &&
        (activeQuestion.options?.length ?? 0) > 0 && (
          <div className="space-y-px">
            {activeQuestion.options!.map((option, idx) => {
              const checked = selectedIds.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    if (activeQuestion.kind === "single") {
                      handleSingleSelect(option.id);
                      if (customEnabled) setCustomText("");
                    } else {
                      toggleMulti(option.id);
                    }
                  }}
                  className={optionRowBase}
                >
                  <span className={cn(badgeBase, checked ? badgeOn : badgeOff)}>
                    {optionBadge(idx)}
                  </span>
                  <span className="text-sm text-neutral-900 dark:text-neutral-100">
                    {option.label}
                    {option.description && (
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {" "}
                        {option.description}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}

            {customEnabled && (
              <div className="pt-1 flex items-center gap-2">
                <span
                  className={cn(
                    badgeBase,
                    selectedIds.includes(QUESTION_CUSTOM_ID)
                      ? badgeOn
                      : badgeOff,
                  )}
                >
                  {optionBadge(activeQuestion.options!.length)}
                </span>
                <input
                  value={customText}
                  onChange={(event) =>
                    handleCustomTextChange(event.target.value)
                  }
                  placeholder={
                    activeQuestion.customPlaceholder ?? "Type your answer"
                  }
                  className="w-full h-7 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
                />
              </div>
            )}
          </div>
        )}

      {activeQuestion.kind === "text" && (
        <textarea
          value={textValue}
          onChange={(event) => setTextValue(event.target.value)}
          placeholder={activeQuestion.placeholder ?? "Type your answer"}
          rows={3}
          className="w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-2 py-1.5 text-sm text-neutral-900 dark:text-neutral-100 resize-y outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
        />
      )}

      <div
        className={cn(
          "flex items-center gap-1.5",
          showNav ? "justify-between" : "justify-end",
        )}
      >
        {showNav && (
          <div className="flex items-center gap-1.5">
            {onPreviousQuestion && (
              <button
                type="button"
                onClick={onPreviousQuestion}
                disabled={!canGoPrev}
                className="h-6 px-2 rounded-[4px] text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:opacity-60"
              >
                Previous
              </button>
            )}
            {onNextQuestion && (
              <button
                type="button"
                onClick={onNextQuestion}
                disabled={!canGoNext}
                className="h-6 px-2 rounded-[4px] text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:opacity-60"
              >
                Next
              </button>
            )}
          </div>
        )}
        <div className="flex items-center justify-end gap-1.5">
          {allowSkip && (
            <button
              type="button"
              onClick={handleSkip}
              className="h-6 px-2 rounded-[4px] text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.98] transition-[background-color,color,transform] duration-150"
            >
              {skipLabel}
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-6 px-2.5 rounded-[4px] text-sm font-medium bg-blue-500 text-white dark:bg-blue-400 dark:text-neutral-950 hover:bg-blue-600 dark:hover:bg-blue-300 active:scale-[0.98] transition-[background-color,transform] duration-150 disabled:opacity-60 disabled:hover:bg-blue-500 dark:disabled:hover:bg-blue-400 disabled:active:scale-100"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatAnswer(answer: QuestionAnswer) {
  if (answer.kind === "skip") return "Skipped";
  if (answer.kind === "text") return answer.text || "Answered";
  const ids = answer.selectedIds?.length ? answer.selectedIds.join(", ") : "";
  if (answer.text) return ids ? `${ids} (${answer.text})` : answer.text;
  return ids || "Answered";
}

export type QuestionToolProps = {
  questions: QuestionConfig[];
  questionIndex?: number;
  totalQuestions?: number;
  onPreviousQuestion?: () => void;
  onNextQuestion?: () => void;
  submitLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  allowSkip?: boolean;
  onSubmitAnswer?: (answer: QuestionAnswer) => void;
  /** When provided, renders the summary state with this answer. */
  output?: { answer?: QuestionAnswer };
  /** Stable id used to reset internal state when the question set changes. */
  toolCallId?: string;
  className?: string;
};

export function QuestionTool({
  questions,
  questionIndex,
  totalQuestions: totalQuestionsProp,
  onPreviousQuestion,
  onNextQuestion,
  submitLabel,
  nextLabel,
  skipLabel,
  allowSkip,
  onSubmitAnswer,
  output,
  toolCallId,
  className,
}: QuestionToolProps) {
  const totalQuestions = totalQuestionsProp ?? questions.length;
  const [localIndex, setLocalIndex] = useState(questionIndex ?? 1);
  const isControlled = typeof questionIndex === "number";
  const effectiveIndex = isControlled
    ? (questionIndex ?? 1)
    : questions.length > 0
      ? localIndex
      : 1;
  const clampedIndex = Math.max(1, Math.min(effectiveIndex, totalQuestions));
  const question = questions[clampedIndex - 1];
  const [localAnswers, setLocalAnswers] = useState<
    Record<number, QuestionAnswer>
  >({});

  useEffect(() => {
    if (typeof questionIndex === "number") {
      setLocalIndex(questionIndex);
    }
  }, [questionIndex]);

  useEffect(() => {
    setLocalAnswers({});
    setLocalIndex(questionIndex ?? 1);
  }, [toolCallId]);

  const outputAnswer = output?.answer;
  const answeredCount = Object.keys(localAnswers).length;
  const isComplete =
    totalQuestions === 1
      ? !!outputAnswer || answeredCount >= 1
      : totalQuestions > 0 && answeredCount >= totalQuestions;
  const showNavigation = totalQuestions > 1 && !isComplete;
  const canGoPrev = clampedIndex > 1;
  const canGoNext = clampedIndex < totalQuestions;

  const summaryAnswers = useMemo(() => {
    if (!isComplete || totalQuestions <= 1) return [];
    return Array.from({ length: totalQuestions }, (_, idx) => ({
      index: idx + 1,
      answer: localAnswers[idx + 1],
    }));
  }, [isComplete, localAnswers, totalQuestions]);

  const summaryText = useMemo(() => {
    if (!isComplete) return "";
    if (summaryAnswers.length > 0) {
      return summaryAnswers
        .map(
          (item) =>
            `${item.index}: ${
              item.answer ? formatAnswer(item.answer) : "Pending"
            }`,
        )
        .join(" • ");
    }
    if (outputAnswer) return formatAnswer(outputAnswer);
    if (localAnswers[clampedIndex])
      return formatAnswer(localAnswers[clampedIndex]);
    return "Pending";
  }, [isComplete, summaryAnswers, outputAnswer, localAnswers, clampedIndex]);

  const goPrev = () => {
    if (!canGoPrev) return;
    onPreviousQuestion?.();
    if (!isControlled) {
      setLocalIndex((prev) => Math.max(1, prev - 1));
    }
  };

  const goNext = () => {
    if (!canGoNext) return;
    onNextQuestion?.();
    if (!isControlled) {
      setLocalIndex((prev) => Math.min(totalQuestions, prev + 1));
    }
  };

  if (!question) return null;

  return (
    <div
      className={cn(
        "rounded-[10px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden",
        className,
      )}
    >
      <div className="h-7 border-b border-neutral-200 dark:border-neutral-800 px-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <div className="inline-flex items-center gap-1.5">
          <IconQuestion className="w-3.5 h-3.5" />
          Question
        </div>
        {showNavigation && (
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              className="size-5 inline-flex items-center justify-center rounded-[4px] hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
              aria-label="Previous question"
            >
              <IconChevronUp className="w-3.5 h-3.5" />
            </button>
            <span>
              {clampedIndex} of {totalQuestions}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="size-5 inline-flex items-center justify-center rounded-[4px] hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
              aria-label="Next question"
            >
              <IconChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {isComplete ? (
        <div className="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-950">
          {summaryText}
        </div>
      ) : (
        <QuestionPrompt
          key={`${clampedIndex}-${question.title}`}
          questions={questions}
          questionIndex={clampedIndex}
          totalQuestions={totalQuestions}
          initialAnswer={localAnswers[clampedIndex]}
          submitLabel={submitLabel}
          nextLabel={nextLabel}
          skipLabel={skipLabel}
          allowSkip={allowSkip}
          onSubmit={(nextAnswer) => {
            setLocalAnswers((prev) => ({
              ...prev,
              [clampedIndex]: nextAnswer,
            }));
            onSubmitAnswer?.(nextAnswer);
            if (clampedIndex < totalQuestions) {
              goNext();
            }
          }}
        />
      )}
    </div>
  );
}
