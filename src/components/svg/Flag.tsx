/* bandeira tricolor italiana (selo, rodapé, tela de carregamento) */
export function Flag({ className = "" }: { className?: string }){
  return <span className={`flag ${className}`} aria-hidden="true"><i /><i /><i /></span>;
}
