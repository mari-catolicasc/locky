import { useEffect, useState } from 'react'
import Pagination from '../components/Pagination'
import { getErrorMessage } from '../services/api'
import { getLockers } from '../services/lockerService'
import { createReservation } from '../services/reservationService'
import type { Locker, LockerSize, LockerStatus } from '../types/locker'
import { lockerSizeLabel, lockerStatusLabel } from '../utils/labels'
import './Lockers.css'

type StatusFilter = LockerStatus | 'all'
type SizeFilter = LockerSize | 'all'

const TAMANHO_PAGINA = 20

function Lockers() {
  const [lockers, setLockers] = useState<Locker[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all')

  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null)
  const [reservationDate, setReservationDate] = useState('')
  const [reservationTime, setReservationTime] = useState('')
  const [reserving, setReserving] = useState(false)
  const [reservationError, setReservationError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    getLockers({
      status: statusFilter === 'all' ? undefined : statusFilter,
      size: sizeFilter === 'all' ? undefined : sizeFilter,
      limit: TAMANHO_PAGINA,
      offset,
    })
      .then((response) => {
        setLockers(response.items)
        setTotal(response.total)
        setError('')
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Não foi possível carregar os armários.'))
      })
      .finally(() => setLoading(false))
  }, [statusFilter, sizeFilter, offset])

  function selecionarStatus(valor: StatusFilter) {
    setStatusFilter(valor)
    setOffset(0)
    setLoading(true)
  }

  function selecionarTamanho(valor: SizeFilter) {
    setSizeFilter(valor)
    setOffset(0)
    setLoading(true)
  }

  function irParaPagina(novoOffset: number) {
    setOffset(novoOffset)
    setLoading(true)
  }

  function openReservation(locker: Locker) {
    if (locker.status !== 'available') return

    setSelectedLocker(locker)
    setReservationDate('')
    setReservationTime('')
    setReservationError('')
    setSuccessMessage('')
  }

  function closeReservation() {
    if (reserving) return

    setSelectedLocker(null)
    setReservationDate('')
    setReservationTime('')
    setReservationError('')
    setSuccessMessage('')
  }

  async function confirmReservation() {
    if (!selectedLocker || !reservationDate || !reservationTime) return

    setReserving(true)
    setReservationError('')

    try {
      await createReservation({
        locker_id: selectedLocker.id,
        date: reservationDate,
        time: reservationTime,
      })
      setSuccessMessage('Reserva realizada com sucesso.')

      const response = await getLockers({
        status: statusFilter === 'all' ? undefined : statusFilter,
        size: sizeFilter === 'all' ? undefined : sizeFilter,
        limit: TAMANHO_PAGINA,
        offset,
      })
      setLockers(response.items)
      setTotal(response.total)
    } catch (err) {
      setReservationError(getErrorMessage(err, 'Não foi possível concluir a reserva.'))
    } finally {
      setReserving(false)
    }
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
            <strong>{total}</strong>
          </div>
        </header>

        {error && <p className="api-error">{error}</p>}

        <section className="lockers-filters">
          <div className="filter-group">
            <span>Status</span>

            <div className="filter-options">
              <button
                className={statusFilter === 'all' ? 'active' : ''}
                onClick={() => selecionarStatus('all')}
              >
                Todos
              </button>

              <button
                className={statusFilter === 'available' ? 'active' : ''}
                onClick={() => selecionarStatus('available')}
              >
                Disponíveis
              </button>

              <button
                className={statusFilter === 'reserved' ? 'active' : ''}
                onClick={() => selecionarStatus('reserved')}
              >
                Reservados
              </button>

              <button
                className={statusFilter === 'occupied' ? 'active' : ''}
                onClick={() => selecionarStatus('occupied')}
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
                onClick={() => selecionarTamanho('all')}
              >
                Todos
              </button>

              <button
                className={sizeFilter === 'small' ? 'active' : ''}
                onClick={() => selecionarTamanho('small')}
              >
                Pequeno
              </button>

              <button
                className={sizeFilter === 'medium' ? 'active' : ''}
                onClick={() => selecionarTamanho('medium')}
              >
                Médio
              </button>

              <button
                className={sizeFilter === 'large' ? 'active' : ''}
                onClick={() => selecionarTamanho('large')}
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

          {loading ? (
            <p>Carregando armários...</p>
          ) : lockers.length > 0 ? (
            <div className="lockers-page-grid">
              {lockers.map((locker) => (
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
                    <span className="locker-size">{lockerSizeLabel(locker.size)}</span>

                    <span className="locker-status">
                      {lockerStatusLabel(locker.status)}
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

          <Pagination
            total={total}
            limit={TAMANHO_PAGINA}
            offset={offset}
            onChangeOffset={irParaPagina}
          />
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
                <p>{lockerSizeLabel(selectedLocker.size)} · Disponível para reserva</p>
              </div>

              <button type="button" className="modal-close" onClick={closeReservation}>
                ×
              </button>
            </div>

            <div className="reservation-locker-preview">
              <div>
                <span>ARMÁRIO</span>
                <strong>{selectedLocker.number}</strong>
              </div>

              <span className="reservation-size">
                {lockerSizeLabel(selectedLocker.size)}
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

            {reservationError && <p className="api-error">{reservationError}</p>}

            {successMessage && <div className="reservation-success">{successMessage}</div>}

            <div className="reservation-actions">
              <button
                type="button"
                className="reservation-cancel"
                onClick={closeReservation}
                disabled={reserving}
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
                  reserving ||
                  Boolean(successMessage)
                }
              >
                {reserving
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
