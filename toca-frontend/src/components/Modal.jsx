export default function Modal({ titulo, aberto, aoFechar, children, largura = 720 }) {
  if (!aberto) return null;
  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-caixa" style={{ maxWidth: largura }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecalho">
          <h2>{titulo}</h2>
          <button className="modal-fechar" onClick={aoFechar} aria-label="Fechar">×</button>
        </div>
        <div className="modal-corpo">{children}</div>
      </div>
    </div>
  );
}
