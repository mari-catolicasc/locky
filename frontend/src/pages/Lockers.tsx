import { useMemo, useState } from 'react'
import './Lockers.css'

type LockerStatus = 'available' | 'reserved' | 'occupied'
type LockerSize = 'small' | 'medium' | 'large'

type Locker = {
  id: number
  number: string
  status: LockerStatus
  size: LockerSize
}

const lockers: Locker[] = [
  { id: 1, number: '01', status: 'available', size: 'small' },
  { id: 2, number: '02', status: 'occupied', size: 'medium' },
  { id: 3, number: '03', status: 'reserved', size: 'large' },
  { id: 4, number: '04', status: 'available', size: 'medium' },
  { id: 5, number: '05', status: 'available', size: 'small' },
  { id: 6, number: '06', status: 'occupied', size: 'large' },
  { id: 7, number: '07', status: 'available', size: 'medium' },
  { id: 8, number: '08', status: 'reserved', size: 'small' },
  { id: 9, number: '09', status: 'available', size: 'large' },
  { id: 10, number: '10', status: 'occupied', size: 'small' },
  { id: 11, number: '11', status: 'available', size: 'medium' },
  { id: 12, number: '12', status: 'reserved', size: 'large' },
]

function Lockers() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [sizeFilter, setSizeFilter] = useState('all')
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null)
  const [reservationDate, setReservationDate] = useState('')
  const [reservationTime, setReservationTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const filteredLockers = useMemo(() => {
    return lockers.filter((locker) => {
      const matchesStatus =
        statusFilter === 'all' || locker.status === statusFilter

      const matchesSize =
        sizeFilter === 'all' || locker.size === sizeFilter

      return matchesStatus && matchesSize
    })
  }, [statusFilter, sizeFilter])

  function getStatusLabel(status: LockerStatus) {
    if (status === 'available') return 'Disponível'
    if (status === 'reserved') return 'Reservado'
    return 'Ocupado'
  }

  function getSizeLabel(size: LockerSize) {
    if (size === 'small') return 'Pequeno'
    if (size === 'medium') return 'Médio'
    return 'Grande'
  }

  function openReservation(locker: Locker) {
    if (locker.status !== 'available') return

    setSelectedLocker(locker)
    setReservationDate('')
    setReservationTime('')
    setSuccessMessage('')
  }

  function closeReservation() {
    if (loading) return

    setSelectedLocker(null)
    setReservationDate('')
    setReservationTime('')
    setSuccessMessage('')
  }

  function confirmReservation() {
    if (!reservationDate || !reservationTime) return

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setSuccessMessage('Reserva realizada com sucesso.')
    }, 1000)
  }

  return (
    <>
      <section className="lockers-page">
        <header className="lockers-page-header">
          <div>
            <span className="page-label">GERENCIAMENTO</span>
            <h1>Armários</h1>
            <p>
              Consulte a disponibilidade e encontre o armário ideal para sua
              necessidade.
            </p>
          </div>

          <div className="lockers-count">
            <span>Encontrados</span>
            <strong>{filteredLockers.length}</strong>
          </div>
        </header>

        <section className="lockers-filters">
          <div className="filter-group">
            <span>Status</span>

            <div className="filter-options">
              <button
                className={statusFilter === 'all' ? 'active' : ''}
                onClick={() => setStatusFilter('all')}
              >
                Todos
              </button>

              <button
                className={statusFilter === 'available' ? 'active' : ''}
                onClick={() => setStatusFilter('available')}
              >
                Disponíveis
              </button>

              <button
                className={statusFilter === 'reserved' ? 'active' : ''}
                onClick={() => setStatusFilter('reserved')}
              >
                Reservados
              </button>

              <button
                className={statusFilter === 'occupied' ? 'active' : ''}
                onClick={() => setStatusFilter('occupied')}
              >
                Ocupados
              </button>
            </div>
          </div>

          <div className="filter-group">
            <span>Tamanho</span>

            <div className="filter-options">
              <button
                className={sizeFilter === 'all' ? 'active' : ''}
                onClick={() => setSizeFilter('all')}
              >
                Todos
              </button>

              <button
                className={sizeFilter === 'small' ? 'active' : ''}
                onClick={() => setSizeFilter('small')}
              >
                Pequeno
              </button>

              <button
                className={sizeFilter === 'medium' ? 'active' : ''}
                onClick={() => setSizeFilter('medium')}
              >
                Médio
              </button>

              <button
                className={sizeFilter === 'large' ? 'active' : ''}
                onClick={() => setSizeFilter('large')}
              >
                Grande
              </button>
            </div>
          </div>
        </section>

        <section className="lockers-list-section">
          <div className="lockers-list-header">
            <div>
              <h2>Todos os armários</h2>
              <p>Selecione um armário disponível para iniciar uma reserva.</p>
            </div>

            <div className="status-legend">
              <span>
                <i className="status-dot available-dot" />
                Disponível
              </span>

              <span>
                <i className="status-dot reserved-dot" />
                Reservado
              </span>

              <span>
                <i className="status-dot occupied-dot" />
                Ocupado
              </span>
            </div>
          </div>

          {filteredLockers.length > 0 ? (
            <div className="lockers-page-grid">
              {filteredLockers.map((locker) => (
                <button
                  key={locker.id}
                  className={`locker-card ${locker.status}`}
                  disabled={locker.status !== 'available'}
                  onClick={() => openReservation(locker)}
                >
                  <div className="locker-top">
                    <span>ARMÁRIO</span>
                    <i />
                  </div>

                  <strong>{locker.number}</strong>

                  <div className="locker-info">
                    <span className="locker-size">
                      {getSizeLabel(locker.size)}
                    </span>

                    <span className="locker-status">
                      {getStatusLabel(locker.status)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="lockers-empty">
              <strong>Nenhum armário encontrado</strong>
              <p>Tente alterar os filtros selecionados.</p>
            </div>
          )}
        </section>
      </section>

      {selectedLocker && (
        <div className="reservation-overlay" onClick={closeReservation}>
          <div
            className="reservation-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="reservation-modal-header">
              <div>
                <span className="page-label">NOVA RESERVA</span>
                <h2>Armário {selectedLocker.number}</h2>
                <p>
                  {getSizeLabel(selectedLocker.size)} · Disponível para reserva
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeReservation}
              >
                ×
              </button>
            </div>

            <div className="reservation-locker-preview">
              <div>
                <span>ARMÁRIO</span>
                <strong>{selectedLocker.number}</strong>
              </div>

              <span className="reservation-size">
                {getSizeLabel(selectedLocker.size)}
              </span>
            </div>

            <div className="reservation-form">
              <div className="reservation-field">
                <label htmlFor="reservation-date">Data</label>

                <input
                  id="reservation-date"
                  type="date"
                  value={reservationDate}
                  onChange={(event) => setReservationDate(event.target.value)}
                />
              </div>

              <div className="reservation-field">
                <label htmlFor="reservation-time">Horário</label>

                <input
                  id="reservation-time"
                  type="time"
                  value={reservationTime}
                  onChange={(event) => setReservationTime(event.target.value)}
                />
              </div>
            </div>

            {successMessage && (
              <div className="reservation-success">
                {successMessage}
              </div>
            )}

            <div className="reservation-actions">
              <button
                type="button"
                className="reservation-cancel"
                onClick={closeReservation}
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="reservation-confirm"
                onClick={confirmReservation}
                disabled={
                  !reservationDate ||
                  !reservationTime ||
                  loading ||
                  Boolean(successMessage)
                }
              >
                {loading
                  ? 'Confirmando...'
                  : successMessage
                    ? 'Reservado'
                    : 'Confirmar reserva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Lockers