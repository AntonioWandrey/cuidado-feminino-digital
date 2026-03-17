import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Plus, X, Stethoscope, Syringe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Appointment {
  date: Date;
  title: string;
  type: "consulta" | "vacina";
}

const CalendarioPage = () => {
  const [selected, setSelected] = useState<Date | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"consulta" | "vacina">("consulta");

  const appointmentDates = appointments.map((a) => a.date.toDateString());

  const handleAddAppointment = () => {
    if (!selected || !newTitle.trim()) return;
    setAppointments((prev) => [...prev, { date: selected, title: newTitle.trim(), type: newType }]);
    setNewTitle("");
    setShowForm(false);
  };

  const removeAppointment = (index: number) => {
    setAppointments((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedAppointments = appointments.filter(
    (a) => selected && a.date.toDateString() === selected.toDateString()
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Calendário</h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe consultas e vacinas</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-3 shadow-sm">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          locale={pt}
          className="pointer-events-auto"
          modifiers={{ booked: appointments.map((a) => a.date) }}
          modifiersClassNames={{ booked: "bg-primary/20 text-primary font-bold rounded-full" }}
        />
      </div>

      {selected && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-foreground">
              {format(selected, "dd 'de' MMMM", { locale: pt })}
            </h2>
            <Button
              size="sm"
              onClick={() => setShowForm(!showForm)}
              className="rounded-xl gap-1.5 text-xs"
            >
              <Plus size={14} /> Agendar
            </Button>
          </div>

          {showForm && (
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Consulta ginecológica"
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2">
                {(["consulta", "vacina"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    className={cn(
                      "flex-1 py-2 rounded-xl border text-xs font-medium transition-all",
                      newType === t
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-card text-foreground"
                    )}
                  >
                    {t === "consulta" ? "🩺 Consulta" : "💉 Vacina"}
                  </button>
                ))}
              </div>
              <Button onClick={handleAddAppointment} className="w-full rounded-xl" size="sm">
                Confirmar
              </Button>
            </div>
          )}

          {selectedAppointments.length > 0 ? (
            <div className="space-y-2">
              {selectedAppointments.map((apt, i) => {
                const Icon = apt.type === "consulta" ? Stethoscope : Syringe;
                return (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3 shadow-sm"
                  >
                    <div className="p-2 rounded-xl bg-accent">
                      <Icon size={18} className="text-primary" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{apt.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{apt.type}</p>
                    </div>
                    <button onClick={() => removeAppointment(appointments.indexOf(apt))} className="p-1 rounded-full hover:bg-muted">
                      <X size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum compromisso nesta data
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarioPage;
