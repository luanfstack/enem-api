"use client";
import z from "@/lib/zod";
import { QuestionDetailSchema } from "@/lib/zod/schemas/questions";
import { useState, useEffect } from "react";
import { ExamSelectionView } from "@/components/ExamSelectionView";
import { QuestionView } from "@/components/QuestionView";
import { ResultView } from "@/components/ResultView";

type QuestionDetail = z.infer<typeof QuestionDetailSchema>;

export default function Home() {
  const years = Array.from(
    { length: 2023 - 2009 + 1 },
    (_, index) => 2009 + index,
  );
  const [year, setYear] = useState<number | null>(2023);
  const [day, setDay] = useState<number | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const getQuestions = async (
    year: number,
    day: number,
    language: string | null,
  ) => {
    setError(false);
    setLoading(true);
    try {
      const response = await fetch(
        `/v1/exams/${year}/questions?limit=90&offset=${
          (day - 1) * 90
        }${language ? `&language=${language}` : ""}`,
      );
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setAnswers(Array(data.questions.length).fill(null));
        setIndex(0);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const markAlternative = (alternative: string) => {
    if (finished) return;
    if (answers[index] === alternative && index < questions.length - 1) {
      setIndex((idx) => idx + 1);
    } else {
      const newAlternatives = [...answers];
      newAlternatives[index] = alternative;
      setAnswers(newAlternatives);
    }
  };

  if (showResult) {
    return (
      <ResultView
        questions={questions}
        answers={answers}
        setAnswers={setAnswers}
        finished={finished}
        setIndex={setIndex}
        setShowResult={setShowResult}
        setYear={setYear}
        setDay={setDay}
        setLanguage={setLanguage}
        setQuestions={setQuestions}
        setFinished={setFinished}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <ExamSelectionView
        years={years}
        year={year}
        setYear={setYear}
        day={day}
        setDay={setDay}
        language={language}
        setLanguage={setLanguage}
        loading={loading}
        error={error}
        setError={setError}
        getQuestions={getQuestions}
      />
    );
  }

  return (
    <QuestionView
      questions={questions}
      index={index}
      setIndex={setIndex}
      answers={answers}
      finished={finished}
      markAlternative={markAlternative}
      setShowResult={setShowResult}
    />
  );
}
