import { Button } from "@/components/ui/button";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { QuestionDetailSchema } from "@/lib/zod/schemas/questions";
import z from "@/lib/zod";

type QuestionDetail = z.infer<typeof QuestionDetailSchema>;

interface QuestionViewProps {
  questions: QuestionDetail[];
  index: number;
  setIndex: (updater: (index: number) => number) => void;
  answers: string[];
  finished: boolean;
  markAlternative: (alternative: string) => void;
  setShowResult: (show: boolean) => void;
}

export function QuestionView({
  questions,
  index,
  setIndex,
  answers,
  finished,
  markAlternative,
  setShowResult,
}: QuestionViewProps) {
  const question = questions[index];

  return (
    <main className="min-h-dvh w-full bg-white" role="main">
      <div className="text-neutral-800 mx-auto max-w-2xl bg-white px-8 pt-10 shadow-[0_1px_3px_rgba(0,0,0,0.08)] min-h-dvh md:shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:rounded-xs pb-24">
        <article className="space-y-8 pb-8" aria-labelledby="question-title">
          <header className="flex justify-between items-center">
            <div className="w-10">
              {index > 0 && (
                <button
                  onClick={() => setIndex((idx) => idx - 1)}
                  className="flex items-center justify-center p-1 rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors"
                  aria-label="Questão anterior"
                >
                  <ArrowLeftCircleIcon className="h-11" />
                </button>
              )}
            </div>
            <h1
              id="question-title"
              className="mt-1 text-xl font-semibold leading-snug text-neutral-900 sm:text-2xl"
            >
              {question.title}
            </h1>
            <div className="w-10 flex justify-end">
              {index < questions.length - 1 && (
                <button
                  onClick={() => setIndex((idx) => idx + 1)}
                  className="flex items-center justify-center p-1 rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors"
                  aria-label="Próxima questão"
                >
                  <ArrowRightCircleIcon className="h-11" />
                </button>
              )}
            </div>
          </header>
          <section className="flex flex-col items-center [&_p]:leading-relaxed [&_p]:text-neutral-700 [&_p]:mb-3 [&_p]:last:mb-0 [&_img]:rounded-lg [&_strong]:font-semibold">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p className="text-left block" {...props} />
                ),
              }}
            >
              {question.context}
            </ReactMarkdown>
          </section>
          <section className="space-y-4" aria-labelledby="alternatives-intro">
            <p
              id="alternatives-intro"
              className="text-sm font-medium text-neutral-600"
            >
              {question.alternativesIntroduction}
            </p>
            <ul
              className="space-y-3"
              role="radiogroup"
              aria-labelledby="alternatives-intro"
            >
              {question.alternatives.map((alternative) => (
                <li
                  key={alternative.letter}
                  onClick={() => markAlternative(alternative.letter)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      markAlternative(alternative.letter);
                    }
                  }}
                  tabIndex={0}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border py-3 px-4 transition-all duration-200 ${
                    finished && alternative.isCorrect
                      ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                      : finished &&
                          (answers[index] === null ||
                            (answers[index] === alternative.letter &&
                              !alternative.isCorrect))
                        ? "border-red-500 bg-red-50 ring-1 ring-red-500"
                        : answers[index] === alternative.letter
                          ? "border-neutral-900 border-2 bg-neutral-50 shadow-xs"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                  role="radio"
                  aria-checked={answers[index] === alternative.letter}
                  aria-disabled={finished}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      finished && alternative.isCorrect
                        ? "bg-green-600 text-white"
                        : finished &&
                            (!answers[index] ||
                              answers[index] === alternative.letter) &&
                            !alternative.isCorrect
                          ? "bg-red-600 text-white"
                          : answers[index] === alternative.letter
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-100 text-neutral-500"
                    }`}
                    aria-hidden="true"
                  >
                    {alternative.letter}
                  </span>
                  <div className="flex flex-1 justify-between items-center">
                    <span className="text-neutral-800">{alternative.text}</span>
                    {finished && alternative.isCorrect && (
                      <CheckCircle2
                        className="h-5 w-5 text-green-600"
                        aria-hidden="true"
                      />
                    )}
                    {finished &&
                      answers[index] === alternative.letter &&
                      !alternative.isCorrect && (
                        <XCircle
                          className="h-5 w-5 text-red-600"
                          aria-hidden="true"
                        />
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </article>
        <div className="flex justify-center items-center px-8">
          <div>
            <Button
              onClick={() => setShowResult(true)}
              size="md"
              className="font-semibold"
              aria-label={finished ? "Voltar para os resultados" : "Navegação"}
            >
              {finished ? "Voltar" : "Navegação"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
