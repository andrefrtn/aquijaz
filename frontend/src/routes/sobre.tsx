import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/common/Button";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Aquijaz — Preservar também é lembrar" },
      {
        name: "description",
        content:
          "O Aquijaz é um arquivo aberto de fotografias e histórias de pessoas comuns. Conheça a ideia por trás do projeto.",
      },
      { property: "og:title", content: "Sobre o Aquijaz — Preservar também é lembrar" },
      {
        property: "og:description",
        content: "Um arquivo aberto de fotografias e histórias de pessoas comuns.",
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
      <p className="rule-label text-sage">Sobre</p>
      <h1 className="font-display mt-4 max-w-4xl text-4xl leading-[1.05] md:text-7xl">
        Preservar também é lembrar.
      </h1>

      <div className="mt-14 grid gap-12 border-t border-border pt-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <div className="space-y-6 text-[1.02rem] leading-relaxed text-foreground/85">
          <p>
            O Aquijaz nasceu de uma constatação simples: a maior parte das fotografias do mundo não
            está em museus. Está em caixas de sapato, gavetas, envelopes de laboratório e álbuns que
            ninguém abre há vinte anos.
          </p>
          <p>
            Essas imagens registram vidas que não foram públicas, mas que sustentaram bairros,
            ofícios, famílias e cidades inteiras. Quando elas desaparecem, desaparece também a única
            prova visual de que aquelas pessoas existiram.
          </p>
          <p>
            Aqui, cada pessoa tem um arquivo: uma fotografia principal, uma biografia, uma galeria
            aberta a quem tenha imagens para acrescentar, e um espaço para histórias contadas por
            quem conviveu.
          </p>
        </div>
        <div className="space-y-10">
          {[
            {
              title: "Um arquivo, não uma rede",
              text: "As curtidas ajudam memórias relevantes a aparecerem primeiro, mas o foco continua nas fichas, imagens e textos. O tempo de leitura é o do papel.",
            },
            {
              title: "Colaborativo por natureza",
              text: "Uma memória raramente pertence a uma pessoa só. Qualquer pessoa pode acrescentar uma fotografia, uma data aproximada, um nome de rua.",
            },
            {
              title: "Feito para durar",
              text: "A prioridade é a legibilidade a longo prazo: descrições, autoria, local e período aproximado acompanham cada imagem.",
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-border pt-6">
              <h2 className="font-display text-2xl">{item.title}</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 flex flex-col gap-4 border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between md:p-12">
        <p className="font-display max-w-xl text-2xl leading-snug md:text-3xl">
          Comece pelo nome de alguém que você não quer esquecer.
        </p>
        <Button asChild size="lg">
          <Link to="/criar-memoria">Criar memória</Link>
        </Button>
      </div>
    </div>
  );
}
