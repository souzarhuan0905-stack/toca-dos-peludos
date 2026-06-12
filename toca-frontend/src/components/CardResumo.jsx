export default function CardResumo({ titulo, valor, subtitulo, cor = 'laranja' }) {
  return (
    <div className={`card-resumo card-resumo-${cor}`}>
      <span className="card-resumo-titulo">{titulo}</span>
      <strong className="card-resumo-valor">{valor}</strong>
      <span className="card-resumo-subtitulo">{subtitulo}</span>
    </div>
  );
}
