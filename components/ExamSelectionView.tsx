import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

interface ExamSelectionViewProps {
  years: number[];
  year: number;
  setYear: (year: number) => void;
  day: number | null;
  setDay: (day: number) => void;
  language: string | null;
  setLanguage: (lang: string) => void;
  loading: boolean;
  error: boolean;
  setError: (error: boolean) => void;
  getQuestions: (year: number, day: number, language: string | null) => void;
}

export function ExamSelectionView({
  years,
  year,
  setYear,
  day,
  setDay,
  language,
  setLanguage,
  loading,
  error,
  setError,
  getQuestions,
}: ExamSelectionViewProps) {
  return (
    <main className="min-h-dvh w-full bg-white" role="main">
      <div className="mx-auto max-w-2xl bg-white px-8 py-14 shadow-[0_1px_3px_rgba(0,0,0,0.08)] min-h-dvh flex flex-col md:shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:rounded-xs">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl my-8">
            PROVAS ENEM
          </h1>
        </header>
        <div className="flex flex-col items-center gap-10 text-center text-neutral-800 flex-1">
          <section
            className="w-fit max-w-md"
            aria-labelledby="year-selection-heading"
          >
            <label
              htmlFor="year-select"
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500"
            >
              Selecione o ano
            </label>
            <select
              id="year-select"
              value={year || ""}
              onChange={(e) => setYear(Number(e.target.value))}
              disabled={loading}
              className="w-full border-black bg-black text-white p-2 appearance-none border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-center text-lg font-semibold"
              aria-describedby="year-selection-heading"
            >
              {years.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
          </section>
          {year && (
            <section
              className="w-full max-w-md"
              aria-labelledby="day-selection-heading"
            >
              <h2
                id="day-selection-heading"
                className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500"
              >
                Selecione o dia
              </h2>
              <div
                className="flex flex-wrap sm:flex-row items-center justify-center gap-3"
                role="radiogroup"
                aria-label="Dias da prova"
              >
                <Button
                  onClick={() => setDay(1)}
                  variant={day === 1 ? "selected" : "outline"}
                  className="px-4 py-3 w-full sm:w-auto text-sm sm:text-base truncate"
                  disabled={loading}
                  aria-pressed={day === 1}
                  role="radio"
                  aria-checked={day === 1}
                >
                  <span className="truncate">
                    Linguagens e Ciências Humanas
                  </span>
                </Button>
                <Button
                  onClick={() => setDay(2)}
                  variant={day === 2 ? "selected" : "outline"}
                  className="px-4 py-3 w-full sm:w-auto text-sm sm:text-base truncate"
                  disabled={loading}
                  aria-pressed={day === 2}
                  role="radio"
                  aria-checked={day === 2}
                >
                  <span className="truncate">
                    Matemática e Ciências da Natureza
                  </span>
                </Button>
              </div>
            </section>
          )}
          {year > 2016 && day === 1 && (
            <section
              className="w-full max-w-md"
              aria-labelledby="language-selection-heading"
            >
              <h2
                id="language-selection-heading"
                className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500"
              >
                Selecione o idioma
              </h2>
              <div
                className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3"
                role="radiogroup"
                aria-label="Idiomas disponíveis"
              >
                <Button
                  onClick={() => setLanguage("ingles")}
                  variant={language === "ingles" ? "selected" : "outline"}
                  className="px-4 py-3 w-full sm:w-auto"
                  disabled={loading}
                  aria-pressed={language === "ingles"}
                  role="radio"
                  aria-checked={language === "ingles"}
                >
                  Inglês
                </Button>
                <Button
                  onClick={() => setLanguage("espanhol")}
                  variant={language === "espanhol" ? "selected" : "outline"}
                  className="px-4 py-3 w-full sm:w-auto"
                  disabled={loading}
                  aria-pressed={language === "espanhol"}
                  role="radio"
                  aria-checked={language === "espanhol"}
                >
                  Espanhol
                </Button>
              </div>
            </section>
          )}

          <section className="mt-auto pt-8 w-full" aria-live="polite">
            {year &&
              (day === 2 ||
                (year > 2016 ? day === 1 && language : day === 1)) && (
                <Button
                  onClick={() => getQuestions(year, day!, language)}
                  size="lg"
                  className="font-semibold"
                  disabled={loading}
                  aria-describedby={error ? "error-message" : undefined}
                >
                  {loading ? (
                    <span
                      className="flex items-center gap-2"
                      aria-live="polite"
                    >
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                        aria-hidden="true"
                      />
                      Carregando
                    </span>
                  ) : (
                    "Iniciar"
                  )}
                </Button>
              )}
          </section>
        </div>
      </div>
      <Toast
        open={error}
        onOpenChange={setError}
        title="Erro"
        description="Ocorreu um erro ao carregar as questões. Por favor, tente novamente."
      />
    </main>
  );
}
