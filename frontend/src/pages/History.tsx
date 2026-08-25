import { useMemo, useState } from 'react'
import { getReservations } from '../services/reservationService.ts'
import type { ReservationStatus } from '../types/reservation'
import './History.css'

function History() {
  const historyData = getReservations().filter(
    (reservation) => reservation.status !== 'active',
  )

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredHistory = useMemo(() => {
    return historyData.filter((item) => {
      const matchesSearch =
        item.lockerNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.lockerSize.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter

      const [day, month, year] = item.date.split('/')
      const itemDate = new Date(`${year}-${month}-${day}T00:00:00`)

      const matchesStartDate =
        !startDate || itemDate >= new Date(`${startDate}T00:00:00`)

      const matchesEndDate =
        !endDate || itemDate <= new Date(`${endDate}T23:59:59`)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      )
    })
  }, [historyData, search, statusFilter, startDate, endDate])

  function getStatusLabel(status: ReservationStatus) {
    if (status === 'completed') return 'Concluída'
    if (status === 'cancelled') return 'Cancelada'
    return 'Ativa'
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('all')
    setStartDate('')
    setEndDate('')
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
          <strong>{filteredHistory.length}</strong>
        </div>
      </header>

      <section className="history-filters">
        <div className="history-search">
          <label htmlFor="history-search">Buscar</label>

          <input
            id="history-search"
            type="text"
            placeholder="Número ou tamanho do armário"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="history-filter">
          <label htmlFor="history-status">Status</label>

          <select
            id="history-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
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
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>

        <div className="history-filter">
          <label htmlFor="history-end">Data final</label>

          <input
            id="history-end"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>

        <button
          type="button"
          className="clear-history-filters"
          onClick={clearFilters}
        >
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

        {filteredHistory.length > 0 ? (
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
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>#{item.lockerNumber}</strong>
                    </td>

                    <td>{item.lockerSize}</td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>

                    <td>
                      <span className={`history-status ${item.status}`}>
                        {getStatusLabel(item.status)}
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