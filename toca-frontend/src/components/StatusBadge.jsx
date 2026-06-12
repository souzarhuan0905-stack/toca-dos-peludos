const MAPA = {
  PENDENTE: { rotulo: 'Pendente', classe: 'badge-pendente' },
  APROVADO: { rotulo: 'Aprovado', classe: 'badge-aprovado' },
  REJEITADO: { rotulo: 'Rejeitado', classe: 'badge-rejeitado' },
  DISPONIVEL: { rotulo: 'Disponível', classe: 'badge-aprovado' },
  EM_PROCESSO: { rotulo: 'Em processo', classe: 'badge-pendente' },
  ADOTADO: { rotulo: 'Adotado', classe: 'badge-adotado' },
  EM_ANDAMENTO: { rotulo: 'Em andamento', classe: 'badge-pendente' },
  CONCLUIDA: { rotulo: 'Concluída', classe: 'badge-aprovado' },
  CANCELADA: { rotulo: 'Cancelada', classe: 'badge-rejeitado' },
  ADMIN: { rotulo: 'Admin', classe: 'badge-admin' },
  VOLUNTARIO: { rotulo: 'Voluntário', classe: 'badge-aprovado' },
  CUIDADOR: { rotulo: 'Cuidador', classe: 'badge-pendente' },
};

export default function StatusBadge({ status }) {
  const info = MAPA[status] || { rotulo: status, classe: 'badge-adotado' };
  return <span className={`badge ${info.classe}`}>● {info.rotulo}</span>;
}
