import { Button } from '@/components/ui/button';

interface ExamSelectionViewProps {
    years: number[];
    year: number | null;
    setYear: (year: number) => void;
    day: number | null;
    setDay: (day: number) => void;
    language: string | null;
    setLanguage: (lang: string) => void;
    isLoading: boolean;
    isError: boolean;
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
    isLoading,
    isError,
    getQuestions,
}: ExamSelectionViewProps) {
    return (
        <main className="min-h-screen w-full bg-white">
            <div className="mx-auto max-w-2xl bg-white px-8 py-14 shadow-[0_1px_3px_rgba(0,0,0,0.08)] min-h-[100dvh] md:shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:rounded-sm">
                <header className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl my-8">
                        PROVAS ENEM
                    </h1>
                </header>
                <div className="flex flex-col items-center gap-10 text-center text-neutral-800">
                    <section className="w-full max-w-md">
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Selecione o ano
                        </h2>
                        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                            {years.map((yearOption) => {
                                const isSelected = yearOption === year;
                                return (
                                    <Button
                                        key={yearOption}
                                        onClick={() => setYear(yearOption)}
                                        variant={isSelected ? 'selected' : 'outline'}
                                        size="sm"
                                        disabled={isLoading}
                                    >
                                        {yearOption}
                                    </Button>
                                );
                            })}
                        </div>
                    </section>
                    {year && (
                        <section className="w-full max-w-md">
                            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Selecione o dia
                            </h2>
                            <div className="flex flex-row items-center justify-center gap-3">
                                <Button
                                    onClick={() => setDay(1)}
                                    variant={day === 1 ? 'selected' : 'outline'}
                                    className="px-4 py-2"
                                    disabled={isLoading}
                                >
                                    1º dia - Linguagens e Ciências Humanas
                                </Button>
                                <Button
                                    onClick={() => setDay(2)}
                                    variant={day === 2 ? 'selected' : 'outline'}
                                    className="px-4 py-2"
                                    disabled={isLoading}
                                >
                                    2º dia - Matemática e Ciências da Natureza
                                </Button>
                            </div>
                        </section>
                    )}
                    {day === 1 && (
                        <section className="w-full max-w-md">
                            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Selecione o idioma
                            </h2>
                            <div className="flex flex-row flex-wrap items-center justify-center gap-3">
                                <Button
                                    onClick={() => setLanguage('ingles')}
                                    variant={language === 'ingles' ? 'selected' : 'outline'}
                                    className="px-4 py-2"
                                    disabled={isLoading}
                                >
                                    Inglês
                                </Button>
                                <Button
                                    onClick={() => setLanguage('espanhol')}
                                    variant={language === 'espanhol' ? 'selected' : 'outline'}
                                    className="px-4 py-2"
                                    disabled={isLoading}
                                >
                                    Espanhol
                                </Button>
                            </div>
                        </section>
                    )}
                    {year && (day === 2 || (day === 1 && language)) && (
                        <section className="pt-2">
                            <Button
                                onClick={() => getQuestions(year, day!, language)}
                                size="lg"
                                className={`font-semibold ${isError && 'bg-red-500 hover:bg-red-600'}`}
                                disabled={isLoading}
                            >
                                {isError ? 'Ops! Tentar de novo' : isLoading ? 'Carregando' : 'Iniciar'}
                            </Button>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}
