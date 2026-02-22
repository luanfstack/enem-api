import { Button } from '@/components/ui/button';
import {
    ArrowLeftCircleIcon,
    ArrowRightCircleIcon,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { QuestionDetailSchema } from '@/lib/zod/schemas/questions';
import z from '@/lib/zod';

type QuestionDetail = z.infer<typeof QuestionDetailSchema>;

interface QuestionViewProps {
    questions: QuestionDetail[];
    index: number;
    setIndex: (updater: (index: number) => number) => void;
    answers: string[];
    isFinished: boolean;
    markAlternative: (alternative: string) => void;
    handleFinish: () => void;
}

export function QuestionView({
    questions,
    index,
    setIndex,
    answers,
    isFinished,
    markAlternative,
    handleFinish,
}: QuestionViewProps) {
    const question = questions[index];

    return (
        <main className="min-h-screen w-full bg-white">
            <div className="text-neutral-800 mx-auto max-w-2xl bg-white px-8 pt-10 shadow-[0_1px_3px_rgba(0,0,0,0.08)] min-h-[100dvh] md:shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:rounded-sm pb-16">
                <article className="space-y-8 pb-8">
                    <header>
                        <h1 className="mt-1 text-xl font-semibold leading-snug text-neutral-900 sm:text-2xl">
                            {question.title}
                        </h1>
                    </header>
                    <section className="[&_p]:leading-relaxed [&_p]:text-neutral-700 [&_p]:mb-3 last:[&_p]:mb-0 [&_img]:rounded-lg [&_strong]:font-semibold">
                        <ReactMarkdown>{question.context}</ReactMarkdown>
                    </section>
                    <section className="space-y-4">
                        <p className="text-sm font-medium text-neutral-600">
                            {question.alternativesIntroduction}
                        </p>
                        <ul className="space-y-3">
                            {question.alternatives.map((alternative) => (
                                <li
                                    key={alternative.letter}
                                    onClick={() => markAlternative(alternative.letter)}
                                    className={`flex cursor-pointer items-start gap-3 rounded-lg border py-3 px-4 transition-all duration-200 ${
                                        isFinished && alternative.isCorrect
                                            ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                                            : isFinished &&
                                              answers[index] === alternative.letter &&
                                              !alternative.isCorrect
                                            ? 'border-red-500 bg-red-50 ring-1 ring-red-500'
                                            : answers[index] === alternative.letter
                                            ? 'border-neutral-900 border-2 bg-neutral-50 shadow-sm'
                                            : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                                    }`}
                                >
                                    <span
                                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                                            isFinished && alternative.isCorrect
                                                ? 'bg-green-600 text-white'
                                                : isFinished &&
                                                  answers[index] === alternative.letter &&
                                                  !alternative.isCorrect
                                                ? 'bg-red-600 text-white'
                                                : answers[index] === alternative.letter
                                                ? 'bg-neutral-900 text-white'
                                                : 'bg-neutral-100 text-neutral-500'
                                        }`}
                                    >
                                        {alternative.letter}
                                    </span>
                                    <div className="flex flex-1 justify-between items-center">
                                        <span className="text-neutral-800">
                                            {alternative.text}
                                        </span>
                                        {isFinished && alternative.isCorrect && (
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        )}
                                        {isFinished &&
                                            answers[index] === alternative.letter &&
                                            !alternative.isCorrect && (
                                                <XCircle className="h-5 w-5 text-red-600" />
                                            )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </article>
                <nav className="fixed bottom-0 left-0 right-0 flex justify-center bg-white/95 backdrop-blur-sm py-4 border-t border-neutral-100">
                    <div className="flex w-full max-w-2xl justify-between items-center px-8">
                        <div className="w-10">
                            {index > 0 && (
                                <ArrowLeftCircleIcon
                                    className="cursor-pointer h-11"
                                    onClick={() => setIndex((idx) => idx - 1)}
                                />
                            )}
                        </div>
                        <div>
                            <Button
                                onClick={handleFinish}
                                size="md"
                                className="font-semibold"
                            >
                                {isFinished ? 'Voltar' : 'Finalizar'}
                            </Button>
                        </div>
                        <div className="w-10 flex justify-end">
                            {index < questions.length - 1 && (
                                <ArrowRightCircleIcon
                                    className="cursor-pointer h-11"
                                    onClick={() => setIndex((idx) => idx + 1)}
                                />
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </main>
    );
}
