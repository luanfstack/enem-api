import { Button } from '@/components/ui/button';
import { QuestionDetailSchema } from '@/lib/zod/schemas/questions';
import z from '@/lib/zod';

type QuestionDetail = z.infer<typeof QuestionDetailSchema>;

interface ResultViewProps {
    questions: QuestionDetail[];
    answers: string[];
    setIndex: (index: number) => void;
    setShowResult: (show: boolean) => void;
    setYear: (year: number | null) => void;
    setDay: (day: number | null) => void;
    setLanguage: (language: string | null) => void;
    setQuestions: (questions: QuestionDetail[]) => void;
    setIsFinished: (isFinished: boolean) => void;
}

export function ResultView({
    questions,
    answers,
    setIndex,
    setShowResult,
    setYear,
    setDay,
    setLanguage,
    setQuestions,
    setIsFinished,
}: ResultViewProps) {
    const totalCorrect = answers.reduce((acc, answer, idx) => {
        const question = questions[idx];
        const correctAlternative = question.alternatives.find((a) => a.isCorrect);
        return answer === correctAlternative?.letter ? acc + 1 : acc;
    }, 0);

    return (
        <main className="min-h-screen w-full bg-white">
            <div className="mx-auto max-w-2xl bg-white px-8 py-14 shadow-[0_1px_3px_rgba(0,0,0,0.08)] min-h-[100dvh] md:shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:rounded-sm">
                <header className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                        RESULTADO: {`${totalCorrect}/${questions.length}`}
                    </h1>
                    <p className="text-center text-sm font-medium text-neutral-600 col-span-full my-4">
                        Clique em uma questão para revisar
                    </p>
                </header>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(60px,1fr))]">
                    {answers.map((answer, idx) => {
                        return (
                            <Button
                                key={idx}
                                onClick={() => {
                                    setIndex(idx);
                                    setShowResult(false);
                                }}
                                className={`text-sm font-medium text-neutral-600 w-10 h-10 my-2 ${
                                    answer === questions[idx].correctAlternative
                                        ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                                        : 'border-red-500 bg-red-50 ring-1 ring-red-500'
                                }`}
                            >
                                {idx + 1}
                            </Button>
                        );
                    })}
                </div>
                <div className="flex w-full max-w-2xl justify-center items-center px-8 mt-8">
                    <Button
                        onClick={() => {
                            setYear(null);
                            setDay(null);
                            setLanguage(null);
                            setShowResult(false);
                            setQuestions([]);
                            setIsFinished(false);
                        }}
                        size="md"
                        className="font-semibold"
                    >
                        Nova Prova
                    </Button>
                </div>
            </div>
        </main>
    );
}
