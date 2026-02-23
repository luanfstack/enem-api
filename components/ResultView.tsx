import { Button } from "@/components/ui/button";
import { QuestionDetailSchema } from "@/lib/zod/schemas/questions";
import z from "@/lib/zod";
import { useState } from "react";
import { Separator } from "./ui/separator";

type QuestionDetail = z.infer<typeof QuestionDetailSchema>;

interface ResultViewProps {
  questions: QuestionDetail[];
  answers: string[];
  setAnswers: (asnwers: string[]) => void;
  finished: boolean;
  setIndex: (index: number) => void;
  setShowResult: (show: boolean) => void;
  setYear: (year: number | null) => void;
  setDay: (day: number | null) => void;
  setLanguage: (language: string | null) => void;
  setQuestions: (questions: QuestionDetail[]) => void;
  setFinished: (finished: boolean) => void;
}

const FILTER = {
  ALL: 0,
  COMPLETE: 1,
  CORRECT: 2,
  INCOMPLETE: 3,
  INCORRECT: 4,
};

export function ResultView({
  questions,
  answers,
  setAnswers,
  finished,
  setIndex,
  setShowResult,
  setYear,
  setDay,
  setLanguage,
  setQuestions,
  setFinished,
}: ResultViewProps) {
  const [filter, setFilter] = useState(FILTER.ALL);
  const [alert, setAlert] = useState(false);

  const toltaComplete = answers.reduce(
    (acc, answer) => (answer ? acc + 1 : acc),
    0,
  );

  const totalCorrect = answers.reduce(
    (acc, answer, idx) =>
      answer === questions[idx].correctAlternative ? acc + 1 : acc,
    0,
  );

  const handleFilter = (value: number) => {
    setFilter(value);
  };

  const filteredQuestions = questions.filter((_, index) => {
    switch (filter) {
      case FILTER.COMPLETE:
        return answers[index] !== null && answers[index] !== undefined;
      case FILTER.CORRECT:
        return (
          answers[index] &&
          answers[index] === questions[index].correctAlternative
        );
      case FILTER.INCOMPLETE:
        return answers[index] === null;
      case FILTER.INCORRECT:
        return answers[index] !== questions[index].correctAlternative;
      default:
        return true;
    }
  });

  return (
    <>
      <main className="min-h-dvh w-full bg-white" role="main">
        <div
          className="mx-auto max-w-2xl bg-white px-8 py-14 shadow-[0_
1px_3px_rgba(0,0,0,0.08)] min-h-dvh md:shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:rounded-xs"
        >
          <header className="text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Clique para filtrar
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {finished ? (
                <>
                  <Button
                    className="flex-1 min-w-[120px]"
                    onClick={() => handleFilter(FILTER.ALL)}
                  >
                    Todas {`(${questions.length})`}
                  </Button>
                  <Button
                    className="flex-1 min-w-[120px] text-neutral-600 border-green-500 bg-green-50 ring-1 ring-green-500 hover:bg-green-100"
                    onClick={() => handleFilter(FILTER.CORRECT)}
                  >
                    Corretas {`(${totalCorrect})`}
                  </Button>
                  <Button
                    className="flex-1 min-w-[120px] text-neutral-600 border-red-500 bg-red-50 ring-1 ring-red-500 hover:bg-red-100"
                    onClick={() => handleFilter(FILTER.INCORRECT)}
                  >
                    Erradas {`(${questions.length - totalCorrect})`}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="flex-1 min-w-[120px]"
                    onClick={() => handleFilter(FILTER.ALL)}
                  >
                    Todas {`(${questions.length})`}
                  </Button>
                  <Button
                    className="flex-1 min-w-[120px] border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
                    onClick={() => handleFilter(FILTER.INCOMPLETE)}
                  >
                    Em Branco {`(${questions.length - toltaComplete})`}
                  </Button>
                  <Button
                    className="flex-1 min-w-[120px]"
                    onClick={() => handleFilter(FILTER.COMPLETE)}
                  >
                    Respondidas {`(${toltaComplete})`}
                  </Button>
                </>
              )}
            </div>
          </header>
          <section
            className="flex flex-wrap"
            aria-labelledby="results-title"
            aria-describedby="results-instruction"
          >
            {filteredQuestions.map((question) => {
              const isCorrect =
                question.correctAlternative === answers[question.index % 90];
              return (
                <Button
                  key={question.index}
                  onClick={() => {
                    setIndex(
                      questions.findIndex((q) => q.index === question.index),
                    );
                    setShowResult(false);
                  }}
                  className={`mx-2 text-sm font-medium text-neutral-600 w-12 h-12 sm:w-10 sm:h-10 my-2 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 ${
                    finished
                      ? isCorrect
                        ? "border-green-500 bg-green-50 ring-1 ring-green-500 hover:bg-green-100"
                        : "border-red-500 bg-red-50 ring-1 ring-red-500 hover:bg-red-100"
                      : answers[(question.index % 90) - 1]
                        ? "border-black bg-black text-white hover:bg-neutral-800"
                        : "border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                  aria-label={`Questão ${question.index}: ${isCorrect ? "Correta" : "Incorreta"}. Clique para visualizar.`}
                  aria-pressed={false}
                >
                  {question.index}
                </Button>
              );
            })}
          </section>
          <section
            className="flex w-full max-w-2xl justify-center items-center px-8 mt-8 flex-col"
            aria-label="Ações"
          >
            {alert && (
              <p className="text-red-500 mb-4">
                Tem certeza que deseja finalizar?
              </p>
            )}
            <Button
              onClick={() => {
                if (finished) {
                  setYear(null);
                  setDay(null);
                  setLanguage(null);
                  setShowResult(false);
                  setQuestions([]);
                  setAnswers([]);
                  setFinished(false);
                  setFilter(FILTER.ALL);
                  setAlert(false);
                } else {
                  if (toltaComplete < questions.length && !alert) {
                    setAlert(true);
                  } else {
                    setFinished(true);
                  }
                }
              }}
              size="md"
              className="font-semibold"
              aria-label="Iniciar nova prova"
            >
              {finished ? "Nova Prova" : "Finalizar"}
            </Button>
          </section>
        </div>
      </main>
    </>
  );
}
