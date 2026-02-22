'use client';
import z from '@/lib/zod';
import { QuestionDetailSchema } from '@/lib/zod/schemas/questions';
import { useState } from 'react';
import { ExamSelectionView } from '@/components/ExamSelectionView';
import { QuestionView } from '@/components/QuestionView';
import { ResultView } from '@/components/ResultView';

type QuestionDetail = z.infer<typeof QuestionDetailSchema>;

export default function Home() {
    const years = Array.from(
        { length: 2023 - 2009 + 1 },
        (_, index) => 2009 + index,
    );
    const [year, setYear] = useState<number | null>(2022);
    const [day, setDay] = useState<number | null>(1);
    const [language, setLanguage] = useState<string | null>('ingles');
    const [questions, setQuestions] = useState<QuestionDetail[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isError, setError] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const getQuestions = async (
        year: number,
        day: number,
        language: string | null,
    ) => {
        setError(false);
        setIsLoading(true);
        try {
            const response = await fetch(
                `/v1/exams/${year}/questions?limit=90&offset=${
                    (day - 1) * 90
                }&language=${language}`,
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
            setIsLoading(false);
        }
    };

    const markAlternative = (alternative: string) => {
        if (isFinished) return;
        const newAlternatives = [...answers];
        newAlternatives[index] = alternative;
        setAnswers(newAlternatives);
    };

    const handleFinish = () => {
        if (isFinished) {
            setShowResult(true);
        } else {
            setIsFinished(true);
            setShowResult(true);
        }
    };

    if (showResult) {
        return (
            <ResultView
                questions={questions}
                answers={answers}
                setIndex={setIndex}
                setShowResult={setShowResult}
                setYear={setYear}
                setDay={setDay}
                setLanguage={setLanguage}
                setQuestions={setQuestions}
                setIsFinished={setIsFinished}
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
                isLoading={isLoading}
                isError={isError}
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
            isFinished={isFinished}
            markAlternative={markAlternative}
            handleFinish={handleFinish}
        />
    );
}
