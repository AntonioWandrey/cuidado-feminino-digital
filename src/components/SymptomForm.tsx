import { useState } from "react";
import { X, AlertTriangle, ThermometerSun, Frown, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SymptomFormProps {
  open: boolean;
  onClose: () => void;
}

const moodOptions = [
  { label: "😊 Bem", value: "bem" },
  { label: "😐 Normal", value: "normal" },
  { label: "😔 Cansada", value: "cansada" },
  { label: "😣 Desconfortável", value: "desconfortavel" },
];

const symptomOptions = [
  { label: "Dor de cabeça", value: "dor_cabeca" },
  { label: "Cólicas", value: "colicas" },
  { label: "Dor pélvica", value: "dor_pelvica", alert: true },
  { label: "Inchaço", value: "inchaco" },
  { label: "Náusea", value: "nausea" },
  { label: "Fadiga", value: "fadiga" },
];

const dischargeOptions = [
  { label: "Transparente", value: "transparente" },
  { label: "Branco", value: "branco" },
  { label: "Amarelado", value: "amarelado" },
  { label: "Esverdeado", value: "esverdeado", alert: true },
];

const otherAlertOptions = [
  { label: "Odor forte", value: "odor_forte", alert: true },
];

const SymptomForm = ({ open, onClose }: SymptomFormProps) => {
  const [mood, setMood] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [discharge, setDischarge] = useState("");
  const [otherAlerts, setOtherAlerts] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleSymptom = (val: string) =>
    setSymptoms((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );

  const toggleOther = (val: string) =>
    setOtherAlerts((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );

  const hasAlertSymptom =
    symptoms.some((s) => symptomOptions.find((o) => o.value === s)?.alert) ||
    dischargeOptions.find((o) => o.value === discharge)?.alert ||
    otherAlerts.some((s) => otherAlertOptions.find((o) => o.value === s)?.alert);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setMood("");
    setSymptoms([]);
    setDischarge("");
    setOtherAlerts([]);
    setSubmitted(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/30 flex items-end justify-center">
      <div className="bg-background w-full max-w-lg rounded-t-3xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 bg-background z-10 flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-lg text-foreground">Como estou hoje?</h2>
          <button onClick={handleReset} className="p-1 rounded-full hover:bg-muted">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {!submitted ? (
            <>
              {/* Mood */}
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-2">Como você está se sentindo?</h3>
                <div className="grid grid-cols-2 gap-2">
                  {moodOptions.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={cn(
                        "p-3 rounded-xl border text-sm font-medium transition-all",
                        mood === m.value
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-2">Sintomas</h3>
                <div className="flex flex-wrap gap-2">
                  {symptomOptions.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => toggleSymptom(s.value)}
                      className={cn(
                        "px-3 py-2 rounded-xl border text-xs font-medium transition-all",
                        symptoms.includes(s.value)
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discharge */}
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-1.5">
                  <Droplets size={14} strokeWidth={1.8} /> Corrimento
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dischargeOptions.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDischarge(d.value)}
                      className={cn(
                        "px-3 py-2 rounded-xl border text-xs font-medium transition-all",
                        discharge === d.value
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Other alerts */}
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-2">Outros sinais</h3>
                <div className="flex flex-wrap gap-2">
                  {otherAlertOptions.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => toggleOther(o.value)}
                      className={cn(
                        "px-3 py-2 rounded-xl border text-xs font-medium transition-all",
                        otherAlerts.includes(o.value)
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert card */}
              {hasAlertSymptom && (
                <div className="rounded-2xl border border-warning bg-warning-bg p-4 flex gap-3 items-start">
                  <AlertTriangle size={22} className="text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-warning-foreground">Atenção</p>
                    <p className="text-xs text-warning-foreground/80 mt-1 leading-relaxed">
                      Estes sintomas sugerem a necessidade de avaliação médica.
                      Procure a sua Unidade Básica de Saúde (UBS).
                    </p>
                  </div>
                </div>
              )}

              <Button onClick={handleSubmit} className="w-full rounded-xl" size="lg">
                Registar sintomas
              </Button>
            </>
          ) : (
            <div className="text-center py-8 space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-accent flex items-center justify-center">
                <ThermometerSun size={28} className="text-primary" />
              </div>
              <h3 className="font-bold text-foreground">Registado com sucesso!</h3>
              <p className="text-sm text-muted-foreground">
                Seus sintomas foram salvos. Continue monitorando seu bem-estar.
              </p>
              {hasAlertSymptom && (
                <div className="rounded-2xl border border-warning bg-warning-bg p-4 text-left mt-4">
                  <p className="text-xs text-warning-foreground font-medium">
                    ⚠️ Lembre-se: procure uma UBS para avaliação dos sintomas relatados.
                  </p>
                </div>
              )}
              <Button onClick={handleReset} variant="outline" className="mt-4 rounded-xl">
                Fechar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomForm;
