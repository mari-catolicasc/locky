import { useState } from 'react'
import { getReservations } from '../services/reservationService.ts'
import type {
  Reservation,
  ReservationStatus,
} from '../types/reservation'
import './Reservations.css'

function Reservations() {
  const [reservations, setReservations] = useState(getReservations())
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [reservationToCancel, setReservationToCancel] =
    useState<Reservation | null>(null)
  const [loading, setLoading] = useState(false)

  const activeReservation = reservations.find(
    (reservation) => reservation.status === 'active',
  )

  const historyReservations = reservations.filter(
    (reservation) => reservation.status !== 'active',
  )

  function openCancelModal(reservation: Reservation) {
    setReservationToCancel(reservation)
    setCancelModalOpen(true)
  }

  function closeCancelModal() {
    if (loading) return

    setCancelModalOpen(false)
    setReservationToCancel(null)
  }

  function confirmCancellation() {
    if (!reservationToCancel) return

    setLoading(true)

    setTimeout(() => {
      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === reservationToCancel.id
            ? {
                ...reservation,
                status: 'cancelled',
              }
            : reservation,
        ),
      )

      setLoading(false)
      setCancelModalOpen(false)
      setReservationToCancel(null)
    }, 900)
  }

  function getStatusLabel(status: ReservationStatus) {
    if (status === 'active') return 'Ativa'
    if (status === 'completed') return 'Concluída'
    return 'Cancelada'
  }

  return (
    <>
      <section className="reservations-page">
        <header className="reservations-header">
          <div>
            <span className="page-label">GERENCIAMENTO</span>
            <h1>Reservas</h1>
            <p>
              Acompanhe sua reserva atual e consulte seu histórico de utilização.
            </p>
          </div>
        </header>

        <section className="current-reservation-section">
          <div className="section-title">
            <div>
              <h2>Reserva atual</h2>
              <p>Informações da sua reserva ativa.</p>
            </div>
          </div>

          {activeReservation ? (
            <article className="current-reservation-card">
              <div className="reservation-main-info">
                <div className="reservation-locker-box">
                  <span>ARMÁRIO</span>
                  <strong>{activeReservation.lockerNumber}</strong>
                  <small>{activeReservation.lockerSize}</small>
                </div>

                <div className="reservation-details">
                  <div>
                    <span>Status</span>
                    <strong className="reservation-active-status">
                      Ativa
                    </strong>
                  </div>

                  <div>
                    <span>Data</span>
                    <strong>{activeReservation.date}</strong>
                  </div>

                  <div>
                    <span>Horário</span>
                    <strong>{activeReservation.time}</strong>
                  </div>
                </div>
              </div>

              <div className="reservation-card-footer">
                <p>
                  Seu armário está reservado para o horário informado.
                </p>

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
                <p>
                  Acesse a página de armários para encontrar um disponível.
                </p>
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

                    <td>{reservation.lockerSize}</td>
                    <td>{reservation.date}</td>
                    <td>{reservation.time}</td>

                    <td>
                      <span
                        className={`reservation-status ${reservation.status}`}
                      >
                        {getStatusLabel(reservation.status)}
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
          <div
            className="cancel-modal"
            onClick={(event) => event.stopPropagation()}
          >
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
                <strong>{reservationToCancel.date}</strong>
              </div>

              <div>
                <span>Horário</span>
                <strong>{reservationToCancel.time}</strong>
              </div>
            </div>

            <div className="cancel-actions">
              <button
                type="button"
                className="keep-reservation-button"
                onClick={closeCancelModal}
                disabled={loading}
              >
                Manter reserva
              </button>

              <button
                type="button"
                className="confirm-cancel-button"
                onClick={confirmCancellation}
                disabled={loading}
              >
                {loading ? 'Cancelando...' : 'Cancelar reserva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Reservations