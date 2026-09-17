import { useEffect, useState } from 'react'
import { getErrorMessage } from '../services/api'
import {
  cancelReservation,
  getMyReservations,
  getReservationHistory,
} from '../services/reservationService'
import type { Reservation } from '../types/reservation'
import { formatDate, formatTime } from '../utils/format'
import { lockerSizeLabel, reservationStatusLabel } from '../utils/labels'
import './Reservations.css'

function Reservations() {
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null)
  const [historyReservations, setHistoryReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(
    null,
  )
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  function carregarReservas() {
    Promise.all([getMyReservations('active'), getReservationHistory()])
      .then(([ativas, historico]) => {
        setActiveReservation(ativas[0] ?? null)
        setHistoryReservations(historico.items)
        setError('')
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Não foi possível carregar suas reservas.'))
      })
      .finally(() => setLoading(false))
  }

  useEffect(carregarReservas, [])

  function openCancelModal(reservation: Reservation) {
    setReservationToCancel(reservation)
    setCancelError('')
    setCancelModalOpen(true)
  }

  function closeCancelModal() {
    if (cancelling) return

    setCancelModalOpen(false)
    setReservationToCancel(null)
    setCancelError('')
  }

  async function confirmCancellation() {
    if (!reservationToCancel) return

    setCancelling(true)
    setCancelError('')

    try {
      await cancelReservation(reservationToCancel.id)
      setCancelModalOpen(false)
      setReservationToCancel(null)
      carregarReservas()
    } catch (err) {
      setCancelError(getErrorMessage(err, 'Não foi possível cancelar a reserva.'))
    } finally {
      setCancelling(false)
    }
  }

  return (
    <>
      <section className="reservations-page">
        <header className="reservations-header">
          <div>
            <span className="page-label">GERENCIAMENTO</span>
            <h1>Reservas</h1>
            <p>Acompanhe sua reserva atual e consulte seu histórico de utilização.</p>
          </div>
        </header>

        {error && <p className="api-error">{error}</p>}

        <section className="current-reservation-section">
          <div className="section-title">
            <div>
              <h2>Reserva atual</h2>
              <p>Informações da sua reserva ativa.</p>
            </div>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : activeReservation ? (
            <article className="current-reservation-card">
              <div className="reservation-main-info">
                <div className="reservation-locker-box">
                  <span>ARMÁRIO</span>
                  <strong>{activeReservation.lockerNumber}</strong>
                  <small>{lockerSizeLabel(activeReservation.lockerSize)}</small>
                </div>

                <div className="reservation-details">
                  <div>
                    <span>Status</span>
                    <strong className="reservation-active-status">Ativa</strong>
                  </div>

                  <div>
                    <span>Data</span>
                    <strong>{formatDate(activeReservation.date)}</strong>
                  </div>

                  <div>
                    <span>Horário</span>
                    <strong>{formatTime(activeReservation.time)}</strong>
                  </div>
                </div>
              </div>

              <div className="reservation-card-footer">
                <p>Seu armário está reservado para o horário informado.</p>

                <button
                  type="button"
                  className="cancel-reservation-button"
                  onClick={() => openCancelModal(activeReservation)}
                >
                  Cancelar reserva
                </button>
              </div>
            </article>
          ) : (
            <div className="no-active-reservation">
              <div>
                <span>Nenhuma reserva ativa</span>
                <strong>Você ainda não possui uma reserva atual.</strong>
                <p>Acesse a página de armários para encontrar um disponível.</p>
              </div>
            </div>
          )}
        </section>

        <section className="reservation-history-section">
          <div className="section-title">
            <div>
              <h2>Reservas anteriores</h2>
              <p>Confira suas últimas utilizações.</p>
            </div>

            <span className="history-count">
              {historyReservations.length} registros
            </span>
          </div>

          <div className="reservation-table-wrapper">
            <table className="reservation-table">
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
                {historyReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>
                      <strong>#{reservation.lockerNumber}</strong>
                    </td>

                    <td>{lockerSizeLabel(reservation.lockerSize)}</td>
                    <td>{formatDate(reservation.date)}</td>
                    <td>{formatTime(reservation.time)}</td>

                    <td>
                      <span className={`reservation-status ${reservation.status}`}>
                        {reservationStatusLabel(reservation.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {cancelModalOpen && reservationToCancel && (
        <div className="cancel-overlay" onClick={closeCancelModal}>
          <div className="cancel-modal" onClick={(event) => event.stopPropagation()}>
            <div className="cancel-modal-header">
              <span className="cancel-label">CANCELAR RESERVA</span>
              <h2>Tem certeza?</h2>

              <p>
                A reserva do armário #{reservationToCancel.lockerNumber} será
                cancelada e o armário voltará a ficar disponível.
              </p>
            </div>

            <div className="cancel-reservation-preview">
              <div>
                <span>Armário</span>
                <strong>#{reservationToCancel.lockerNumber}</strong>
              </div>

              <div>
                <span>Data</span>
                <strong>{formatDate(reservationToCancel.date)}</strong>
              </div>

              <div>
                <span>Horário</span>
                <strong>{formatTime(reservationToCancel.time)}</strong>
              </div>
            </div>

            {cancelError && <p className="api-error">{cancelError}</p>}

            <div className="cancel-actions">
              <button
                type="button"
                className="keep-reservation-button"
                onClick={closeCancelModal}
                disabled={cancelling}
              >
                Manter reserva
              </button>

              <button
                type="button"
                className="confirm-cancel-button"
                onClick={confirmCancellation}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelando...' : 'Cancelar reserva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Reservations
