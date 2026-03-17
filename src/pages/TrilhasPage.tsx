import { useState } from "react";
import { ArrowLeft, Heart, Baby, Leaf, Dumbbell, ChevronRight } from "lucide-react";

const categories = [
  {
    id: "intima",
    title: "Saúde Íntima",
    icon: Heart,
    description: "Cuidados com a saúde íntima feminina",
    articles: [
      { title: "Higiene íntima: mitos e verdades", read: "3 min" },
      { title: "Corrimento vaginal: quando se preocupar?", read: "4 min" },
      { title: "Infecções urinárias recorrentes", read: "5 min" },
      { title: "Exames ginecológicos preventivos", read: "3 min" },
    ],
  },
  {
    id: "ciclo",
    title: "Ciclo de Vida",
    icon: Leaf,
    description: "Adolescência, Fase Adulta, Climatério e Senescência",
    articles: [
      { title: "Adolescência: primeiras mudanças", read: "4 min" },
      { title: "Fase adulta: fertilidade e saúde", read: "5 min" },
      { title: "Climatério e menopausa", read: "6 min" },
      { title: "Envelhecimento saudável", read: "4 min" },
    ],
  },
  {
    id: "maternidade",
    title: "Maternidade",
    icon: Baby,
    description: "Gestação, parto e pós-parto",
    articles: [
      { title: "Planejamento da gravidez", read: "4 min" },
      { title: "Pré-natal: a importância do acompanhamento", read: "5 min" },
      { title: "Amamentação: benefícios e desafios", read: "6 min" },
      { title: "Saúde mental no pós-parto", read: "4 min" },
    ],
  },
  {
    id: "habitos",
    title: "Hábitos Saudáveis",
    icon: Dumbbell,
    description: "Exercícios, nutrição e saúde mental",
    articles: [
      { title: "Exercícios físicos para cada fase", read: "3 min" },
      { title: "Alimentação e equilíbrio hormonal", read: "5 min" },
      { title: "Saúde mental e autocuidado", read: "4 min" },
      { title: "Sono e produtividade", read: "3 min" },
    ],
  },
];

const TrilhasPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const category = categories.find((c) => c.id === selectedCategory);

  if (category) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{category.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
        </div>
        <div className="space-y-3">
          {category.articles.map((article, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-sm text-foreground">{article.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">📖 Leitura de {article.read}</p>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Trilhas de Conteúdo</h1>
        <p className="text-sm text-muted-foreground mt-1">Explore temas importantes para a sua saúde</p>
      </div>
      <div className="space-y-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] text-left"
            >
              <div className="p-3 rounded-xl bg-accent shrink-0">
                <Icon size={24} className="text-primary" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-foreground">{cat.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
              </div>
              <ChevronRight size={18} className="text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TrilhasPage;
