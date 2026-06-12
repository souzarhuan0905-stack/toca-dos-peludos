export default function FormInput({ rotulo, obrigatorio, children, largura }) {
  return (
    <label className="form-campo" style={largura ? { gridColumn: largura } : undefined}>
      <span className="form-rotulo">
        {rotulo} {obrigatorio && <em>*</em>}
      </span>
      {children}
    </label>
  );
}
