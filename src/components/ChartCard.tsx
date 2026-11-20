import type { ReactNode } from "react";

interface Props {
  title: string;
  /** Pergunta de partida que o gráfico ajuda a responder. */
  question: string;
  /** Como os dados estão codificados (canais visuais). */
  encoding: string;
  /** Por que esta visualização e não outra (efetividade e expressividade). */
  why: string;
  reactsTo: string[];
  wide?: boolean;
  children: ReactNode;
}

export default function ChartCard({ title, question, encoding, why, reactsTo, wide, children }: Props) {
  return (
    <section className={`card${wide ? " card-wide" : ""}`}>
      <header>
        <h3>{title}</h3>
        <p className="question">{question}</p>
      </header>
      <div className="card-body">{children}</div>
      <footer>
        <details>
          <summary>Por que este gráfico?</summary>
          <p>
            <strong>Codificação.</strong> {encoding}
          </p>
          <p>
            <strong>Escolha.</strong> {why}
          </p>
        </details>
        <p className="reacts">
          {reactsTo.length ? `Reage a: ${reactsTo.join(", ")}.` : "Não reage a filtros (dados já agregados)."}
        </p>
      </footer>
    </section>
  );
}
