// Upload controlado: valida extensão e tamanho ANTES de enviar ao servidor
const EXTENSOES = ['pdf', 'jpg', 'jpeg', 'png'];
const TAMANHO_MAX = 5 * 1024 * 1024; // 5 MB

export default function FileUpload({ rotulo, arquivo, aoSelecionar, obrigatorio }) {
  function selecionar(e) {
    const escolhido = e.target.files[0];
    if (!escolhido) return;

    const extensao = escolhido.name.split('.').pop().toLowerCase();
    if (!EXTENSOES.includes(extensao)) {
      alert('Extensão não permitida. Envie arquivos PDF, JPG ou PNG.');
      e.target.value = '';
      return;
    }
    if (escolhido.size > TAMANHO_MAX) {
      alert('O arquivo excede o tamanho máximo de 5 MB.');
      e.target.value = '';
      return;
    }
    aoSelecionar(escolhido);
  }

  return (
    <div className="upload-campo">
      <span className="form-rotulo">
        {rotulo} {obrigatorio && <em>*</em>}
      </span>
      <label className={`upload-area ${arquivo ? 'upload-ok' : ''}`}>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={selecionar} hidden />
        {arquivo ? (
          <span>✅ {arquivo.name}</span>
        ) : (
          <span>📎 Clique para selecionar (PDF, JPG ou PNG · máx. 5 MB)</span>
        )}
      </label>
    </div>
  );
}
