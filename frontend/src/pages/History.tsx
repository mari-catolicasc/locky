import { useEffect, useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { getErrorMessage } from '../services/api'
import { getReservationHistory } from '../services/reservationService'
import type { Reservation, ReservationStatus } from '../types/reservation'
import { formatDate, formatTime } from '../utils/format'
import { lockerSizeLabel, reservationStatusLabel } from '../utils/labels'
import './History.css'

type StatusFilter = ReservationStatus | 'all'

function History() {
  const [history, setHistory] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const debouncedSearch = useDebouncedValue(search, 300)

  useEffect(() => {
    getReservationHistory({
      search: debouncedSearch || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    })
      .then((response) => {
        setHistory(response.items)
        setError('')
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Não foi possível carregar o histórico.'))
      })
      .finally(() => setLoading(false))
  }, [debouncedSearch, statusFilter, startDate, endDate])

  function handleSearchChange(valor: string) {
    setSearch(valor)
    setLoading(true)
  }

  function handleStatusChange(valor: StatusFilter) {
    setStatusFilter(valor)
    setLoading(true)
  }

  function handleStartDateChange(valor: string) {
    setStartDate(valor)
    setLoading(true)
  }

  function handleEndDateChange(valor: string) {
    setEndDate(valor)
    setLoading(true)
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('all')
    setStartDate('')
    setEndDate('')
    setLoading(true)
  }

  return (
    <section className="history-page">
      <header className="history-header">
        <div>
          <span className="page-label">ATIVIDADES</span>
          <h1>Histórico</h1>
          <p>
            Consulte suas reservas anteriores e filtre os registros por período
            ou status.
          </p>
        </div>

        <div className="history-total-card">
          <span>Registros</span>
          <strong>{history.length}</strong>
        </div>
      </header>

      {error && <p className="api-error">{error}</p>}

      <section className="history-filters">
        <div className="history-search">
          <label htmlFor="history-search">Buscar</label>

          <input
            id="history-search"
            type="text"
            placeholder="Número do armário"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </div>

        <div className="history-filter">
          <label htmlFor="history-status">Status</label>

          <select
            id="history-status"
            value={statusFilter}
            onChange={(event) =>
              handleStatusChange(event.target.value as StatusFilter)
            }
          >
            <option value="all">Todos</option>
            <option value="completed">Concluída</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        <div className="history-filter">
          <label htmlFor="history-start">Data inicial</label>

          <input
            id="history-start"
            type="date"
            value={startDate}
            onChange={(event) => handleStartDateChange(event.target.value)}
          />
        </div>

        <div className="history-filter">
          <label htmlFor="history-end">Data final</label>

          <input
            id="history-end"
            type="date"
            value={endDate}
            onChange={(event) => handleEndDateChange(event.target.value)}
          />
        </div>

        <button type="button" className="clear-history-filters" onClick={clearFilters}>
          Limpar filtros
        </button>
      </section>

      <section className="history-list-section">
        <div className="history-list-header">
          <div>
            <h2>Reservas anteriores</h2>
            <p>Visualize todas as atividades registradas.</p>
          </div>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : history.length > 0 ? (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Armário</th>
                  <th>Tamanho</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>#{item.lockerNumber}</strong>
                    </td>

                    <td>{lockerSizeLabel(item.lockerSize)}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>{formatTime(item.time)}</td>

                    <td>
                      <span className={`history-status ${item.status}`}>
                        {reservationStatusLabel(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="history-empty">
            <strong>Nenhum registro encontrado</strong>
            <p>Tente alterar os filtros selecionados.</p>
          </div>
        )}
      </section>
    </section>
  )
}

export default History
