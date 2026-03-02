import { Button } from "@/components/ui/button";
import {
  ArrowBigLeft,
  ArrowBigRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { QuestionDetailSchema } from "@/lib/zod/schemas/questions";
import z from "@/lib/zod";
import { useRef } from "react";

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
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === 0) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 100) {
      if (diffX > 0 && index < questions.length - 1) {
        setIndex((idx) => idx + 1);
      } else if (diffX < 0 && index > 0) {
        setIndex((idx) => idx - 1);
      }
    }

    touchStartX.current = 0;
  };

  return (
    <main
      className="min-h-dvh w-full bg-white"
      role="main"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={(e) => e.preventDefault()}
    >
      <div className="text-neutral-800 mx-auto max-w-2xl bg-white px-8 pt-10 shadow-[0_1px_3px_rgba(0,0,0,0.08)] min-h-dvh md:shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:rounded-xs pb-24">
        <article className="space-y-8 pb-8" aria-labelledby="question-title">
          <header className="flex justify-between items-center">
            <div className="w-10">
              {index > 0 && (
                <button
                  onClick={() => setIndex((idx) => idx - 1)}
                  className="flex items-center justify-center p-1 rounded-full focus-outline-none transition-colors"
                  aria-label="Questão anterior"
                >
                  <ArrowBigLeft className="h-11" />
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
                  className="flex items-center justify-center p-1 rounded-full focus:outline-none transition-colors"
                  aria-label="Próxima questão"
                >
                  <ArrowBigRight className="h-11" />
                </button>
              )}
            </div>
          </header>
          <section className="flex flex-col items-center [&_p]:leading-relaxed [&_p]:text-neutral-700 [&_p]:mb-3 [&_p]:last:mb-0 [&_img]:rounded-lg [&_strong]:font-semibold">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p className="text-left block break-all" {...props} />
                ),
              }}
            >
              {question.context}
            </ReactMarkdown>
          </section>
          <section className="space-y-4" aria-labelledby="alternatives-intro">
            <p id="alternatives-intro">{question.alternativesIntroduction}</p>
            <ul
              className="space-y-3"
              role="radiogroup"
              aria-labelledby="alternatives-intro"
            >
              {question.alternatives.map((alternative) => (
                <li
                  key={alternative.letter}
                  onClick={() => markAlternative(alternative.letter)}
                  tabIndex={0}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border py-3 px-4 transition-all duration-200 ${
                    finished
                      ? alternative.isCorrect
                        ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                        : answers[index] === null
                          ? "border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500 "
                          : answers[index] === alternative.letter &&
                            "border-red-500 bg-red-50 ring-1 ring-red-500"
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
                      finished
                        ? alternative.isCorrect
                          ? "bg-green-600 text-white"
                          : answers[index] === null
                            ? "bg-yellow-500 text-white"
                            : answers[index] === alternative.letter &&
                              "bg-red-600 text-white"
                        : answers[index] === alternative.letter
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-500"
                    }`}
                    aria-hidden="true"
                  >
                    {alternative.letter}
                  </span>
                  <div className="flex flex-1 justify-between items-center">
                    {alternative.text ? (
                      <span className="text-neutral-800">
                        {alternative.text}
                      </span>
                    ) : (
                      alternative.file && <img src={alternative.file} />
                    )}
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
