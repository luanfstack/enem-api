import { Button } from "@/components/ui/button";
import { QuestionDetailSchema } from "@/lib/zod/schemas/questions";
import z from "@/lib/zod";
import { useState } from "react";

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

  const toltalComplete = answers.reduce(
    (acc, answer) => (answer ? acc + 1 : acc),
    0,
  );

  const totalCorrect = answers.reduce(
    (acc, answer, idx) =>
      answer === questions[idx].correctAlternative ? acc + 1 : acc,
    0,
  );

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
        <div className="mx-auto max-w-2xl bg-white px-8 py-14 shadow-[0_1px_3px_rgba(0,0,0,0.08)] min-h-dvh md:shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:rounded-xs">
          <header className="text-center">
            <div className="flex flex-wrap sm:flex-row items-center justify-center gap-2 mb-6">
              <label
                htmlFor="filter-select"
                className="text-lg font-semibold text-neutral-700"
              >
                Filtrar por:
              </label>
              <select
                id="filter-select"
                className="w-fit appearance-none border-black bg-black text-white sm:w-auto p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-center text-lg font-semibold"
                value={filter}
                onChange={(e) => setFilter(Number(e.target.value))}
              >
                <option value={FILTER.ALL}>Todas ({questions.length})</option>
                <option value={finished ? FILTER.CORRECT : FILTER.COMPLETE}>
                  {finished
                    ? `Corretas (${totalCorrect})`
                    : `Completas (${toltalComplete})`}
                </option>
                <option value={finished ? FILTER.INCORRECT : FILTER.INCOMPLETE}>
                  {finished
                    ? `Incorretas (${questions.length - totalCorrect})`
                    : `Incompletas (${questions.length - toltalComplete})`}
                </option>
              </select>
            </div>
          </header>
          <section
            className="flex flex-wrap justify-center"
            aria-labelledby="results-title"
            aria-describedby="results-instruction"
          >
            {filteredQuestions.map((question) => {
              const answer =
                answers[questions.findIndex((q) => q.index === question.index)];
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
                      ? answer === question.correctAlternative
                        ? "border-green-500 bg-green-50 ring-1 ring-green-500 hover:bg-green-100"
                        : answer === null
                          ? "border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500 hover:bg-yellow-100"
                          : "border-red-500 bg-red-50 ring-1 ring-red-500 hover:bg-red-100"
                      : answers[(question.index % 90) - 1]
                        ? "border-black bg-black text-white hover:bg-neutral-800"
                        : "border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
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
                  setYear(2023);
                  setDay(null);
                  setLanguage(null);
                  setShowResult(false);
                  setQuestions([]);
                  setAnswers([]);
                  setFinished(false);
                  setFilter(FILTER.ALL);
                  setAlert(false);
                } else {
                  if (toltalComplete < questions.length && !alert) {
                    setAlert(true);
                  } else {
                    setAlert(false);
                    setFinished(true);
                    setFilter(FILTER.ALL);
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
