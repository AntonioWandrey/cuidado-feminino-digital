import { User, Bell, Shield, HelpCircle, LogOut } from "lucide-react";

const menuItems = [
  { icon: User, label: "Dados pessoais", desc: "Nome, idade e informações" },
  { icon: Bell, label: "Notificações", desc: "Alertas e lembretes" },
  { icon: Shield, label: "Privacidade", desc: "Segurança dos seus dados" },
  { icon: HelpCircle, label: "Ajuda", desc: "Perguntas frequentes" },
];

const PerfilPage = () => {
  return (
    <div className="space-y-6">
      {/* Avatar area */}
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
          <User size={36} className="text-primary" strokeWidth={1.5} />
        </div>
        <h1 className="text-lg font-bold text-foreground mt-3">Usuária</h1>
        <p className="text-sm text-muted-foreground">Cuidando da minha saúde 💕</p>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="p-2 rounded-xl bg-accent">
                <Icon size={18} className="text-primary" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground hover:text-destructive transition-colors">
        <LogOut size={16} /> Sair da conta
      </button>
    </div>
  );
};

export default PerfilPage;
