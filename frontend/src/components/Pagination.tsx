import './Pagination.css'

type PaginationProps = {
  total: number
  limit: number
  offset: number
  onChangeOffset: (offset: number) => void
}

function Pagination({ total, limit, offset, onChangeOffset }: PaginationProps) {
  if (total <= limit) return null

  const paginaAtual = Math.floor(offset / limit) + 1
  const totalPaginas = Math.ceil(total / limit)

  return (
    <div className="pagination">
      <button
        type="button"
        onClick={() => onChangeOffset(Math.max(0, offset - limit))}
        disabled={offset === 0}
      >
        Anterior
      </button>

      <span>
        Página {paginaAtual} de {totalPaginas} · {total} no total
      </span>

      <button
        type="button"
        onClick={() => onChangeOffset(offset + limit)}
        disabled={offset + limit >= total}
      >
        Próxima
      </button>
    </div>
  )
}

export default Pagination
