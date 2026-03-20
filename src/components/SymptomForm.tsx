import { useState } from "react";
import {
  X,
  AlertTriangle,
  ThermometerSun,
  Droplets,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { symptomLogSchema } from "@/lib/validations";

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
  { label: "Ardência ao urinar", value: "ardencia_urinar", alert: true },
];

const dischargeOptions = [
  { label: "Transparente / claro", value: "transparente" },
  { label: "Branco sem odor", value: "branco" },
  { label: "Amarelado / esverdeado", value: "amarelado_esverdeado", alert: true },
  { label: "Acinzentado", value: "acinzentado", alert: true },
  { label: "Grumoso com coceira", value: "grumoso_coceira", alert: true },
];

const otherAlertOptions = [
  { label: "Odor forte / fétido", value: "odor_forte", alert: true },
  { label: "Coceira intensa", value: "coceira_intensa", alert: true },
  { label: "Sangramento fora do período", value: "sangramento", alert: true },
];

const SymptomForm = ({ open, onClose }: SymptomFormProps) => {
  const [mood, setMood] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [discharge, setDischarge] = useState("");
  const [otherAlerts, setOtherAlerts] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggle = (
    list: string[],
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const hasAlertSymptom =
    symptoms.some((value) => symptomOptions.find((option) => option.value === value)?.alert) ||
    dischargeOptions.find((option) => option.value === discharge)?.alert ||
    otherAlerts.some((value) => otherAlertOptions.find((option) => option.value === value)?.alert);

  const handleSubmit = async () => {
    const result = symptomLogSchema.safeParse({
      mood,
      symptoms,
      discharge: discharge || undefined,
      otherSigns: otherAlerts,
    });

    if (!result.success) {
      setValidationError("Por favor, selecione como você está se sentindo antes de enviar.");
      setSubmitError("");
      return;
    }

    setValidationError("");
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) {
        setSubmitError("Faça login para salvar seu check-up.");
        return;
      }

      const { error } = await supabase.from("symptom_logs").insert({
        user_id: user.id,
        mood: result.data.mood,
        symptoms: result.data.symptoms,
        discharge: result.data.discharge ?? null,
        other_signs: result.data.otherSigns,
        alert_triggered: Boolean(hasAlertSymptom),
      });

      if (error) throw error;

      setSubmitted(true);
    } catch (error) {
      console.error("Erro ao salvar check-up:", error);
      setSubmitError("Não foi possível salvar seu check-up agora.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setMood("");
    setSymptoms([]);
    setDischarge("");
    setOtherAlerts([]);
    setSubmitted(false);
    setValidationError("");
    setSubmitError("");
    setIsSubmitting(false);
    onClose();
  };

  const openMaps = () => {
    window.open("https://www.google.com/maps/search/UBS+proxima", "_blank", "noopener,noreferrer");
  };

  if (!open) return null;

  const chipClass = (active: boolean) =>
    cn(
      "px-3 py-2 rounded-2xl border text-xs font-medium transition-all",
      active
        ? "border-primary bg-accent text-accent-foreground"
        : "border-border bg-card text-foreground hover:border-primary/50",
    );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-3xl bg-background animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background p-4">
          <h2 className="text-lg font-bold text-foreground">Check-up de Sinais</h2>
          <button onClick={handleReset} className="rounded-full p-1 hover:bg-muted" aria-label="Fechar formulário">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-6 p-4 pb-6">
            {!submitted ? (
              <>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Como você está se sentindo?</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {moodOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setMood(option.value);
                          setValidationError("");
                        }}
                        className={cn(
                          "rounded-2xl border p-3 text-sm font-medium transition-all",
                          mood === option.value
                            ? "border-primary bg-accent text-accent-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/50",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {validationError && <p className="mt-2 text-xs text-destructive">{validationError}</p>}
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Sintomas físicos</h3>
                  <div className="flex flex-wrap gap-2">
                    {symptomOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggle(symptoms, option.value, setSymptoms)}
                        className={chipClass(symptoms.includes(option.value))}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Droplets size={14} strokeWidth={1.8} />
                    Corrimento — Coloração e aspecto
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {dischargeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDischarge(option.value)}
                        className={chipClass(discharge === option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Outros sinais</h3>
                  <div className="flex flex-wrap gap-2">
                    {otherAlertOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggle(otherAlerts, option.value, setOtherAlerts)}
                        className={chipClass(otherAlerts.includes(option.value))}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {hasAlertSymptom && (
                  <div className="space-y-3 rounded-2xl border border-warning bg-warning-bg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={22} className="mt-0.5 shrink-0 text-warning" />
                      <div>
                        <p className="text-sm font-bold text-warning-foreground">AVISO</p>
                        <p className="mt-1 text-xs leading-relaxed text-warning-foreground/80">
                          Seus sintomas sugerem a necessidade de avaliação profissional. Procure a UBS mais próxima.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={openMaps}
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 rounded-2xl border-warning text-warning-foreground hover:bg-warning/10"
                    >
                      <MapPin size={14} /> Localizar UBS via Maps
                    </Button>
                  </div>
                )}

                {submitError && <p className="text-sm text-destructive">{submitError}</p>}
              </>
            ) : (
              <div className="space-y-3 py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                  <ThermometerSun size={28} className="text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Registrado com sucesso!</h3>
                <p className="text-sm text-muted-foreground">Seus sintomas foram salvos.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t border-border bg-background p-4">
          {!submitted ? (
            <Button onClick={handleSubmit} className="w-full rounded-2xl" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Registrar Check-up"}
            </Button>
          ) : (
            <Button onClick={handleReset} variant="outline" className="w-full rounded-2xl">
              Fechar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomForm;
