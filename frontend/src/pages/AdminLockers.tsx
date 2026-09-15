import { useState } from 'react'
import type { FormEvent } from 'react'
import { getLockers } from '../services/lockerService'
import type {
  Locker,
  LockerSize,
  LockerStatus,
} from '../types/locker'
import './AdminLockers.css'

function AdminLockers() {
  const [lockers, setLockers] = useState<Locker[]>(getLockers())
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [number, setNumber] = useState('')
  const [size, setSize] = useState<LockerSize>('small')
  const [status, setStatus] = useState<LockerStatus>('available')

  function getSizeLabel(size: LockerSize) {
    if (size === 'small') return 'Pequeno'
    if (size === 'medium') return 'Médio'
    return 'Grande'
  }

  function getStatusLabel(status: LockerStatus) {
    if (status === 'available') return 'Disponível'
    if (status === 'reserved') return 'Reservado'
    if (status === 'occupied') return 'Ocupado'
    return 'Manutenção'
  }

  function openCreateModal() {
    setSelectedLocker(null)
    setIsCreating(true)
    setNumber('')
    setSize('small')
    setStatus('available')
    setModalOpen(true)
  }

  function openEditModal(locker: Locker) {
    setSelectedLocker(locker)
    setIsCreating(false)
    setNumber(locker.number)
    setSize(locker.size)
    setStatus(locker.status)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSelectedLocker(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!number.trim()) return

    if (isCreating) {
      const newLocker: Locker = {
        id: Date.now(),
        number,
        size,
        status,
      }

      setLockers((current) => [...current, newLocker])
    } else if (selectedLocker) {
      setLockers((current) =>
        current.map((locker) =>
          locker.id === selectedLocker.id
            ? {
                ...locker,
                number,
                size,
                status,
              }
            : locker,
        ),
      )
    }

    closeModal()
  }

  function toggleMaintenance(locker: Locker) {
    setLockers((current) =>
      current.map((item) =>
        item.id === locker.id
          ? {
              ...item,
              status:
                item.status === 'maintenance'
                  ? 'available'
                  : 'maintenance',
            }
          : item,
      ),
    )
  }

  function deleteLocker(locker: Locker) {
    const confirmed = window.confirm(
      `Deseja excluir o armário #${locker.number}?`,
    )

    if (!confirmed) return

    setLockers((current) =>
      current.filter((item) => item.id !== locker.id),
    )
  }

  return (
    <>
      <section className="admin-lockers-page">
        <header className="admin-lockers-header">
          <div>
            <span className="page-label">ADMINISTRAÇÃO</span>
            <h1>Gerenciar armários</h1>
            <p>
              Cadastre, edite e controle a disponibilidade dos armários.
            </p>
          </div>

          <button
            type="button"
            className="new-locker-button"
            onClick={openCreateModal}
          >
            + Novo armário
          </button>
        </header>

        <section className="admin-summary-grid">
          <article>
            <span>Total</span>
            <strong>{lockers.length}</strong>
          </article>

          <article>
            <span>Disponíveis</span>
            <strong>
              {
                lockers.filter(
                  (locker) => locker.status === 'available',
                ).length
              }
            </strong>
          </article>

          <article>
            <span>Reservados</span>
            <strong>
              {
                lockers.filter(
                  (locker) => locker.status === 'reserved',
                ).length
              }
            </strong>
          </article>

          <article>
            <span>Manutenção</span>
            <strong>
              {
                lockers.filter(
                  (locker) => locker.status === 'maintenance',
                ).length
              }
            </strong>
          </article>
        </section>

        <section className="admin-lockers-section">
          <div className="admin-section-header">
            <div>
              <h2>Todos os armários</h2>
              <p>Gerencie os armários cadastrados no sistema.</p>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-lockers-table">
              <thead>
                <tr>
                  <th>Armário</th>
                  <th>Tamanho</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {lockers.map((locker) => (
                  <tr key={locker.id}>
                    <td>
                      <strong>#{locker.number}</strong>
                    </td>

                    <td>{getSizeLabel(locker.size)}</td>

                    <td>
                      <span
                        className={`admin-status ${locker.status}`}
                      >
                        {getStatusLabel(locker.status)}
                      </span>
                    </td>

                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-edit-button"
                          onClick={() => openEditModal(locker)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className={
                            locker.status === 'maintenance'
                              ? 'admin-maintenance-button active'
                              : 'admin-maintenance-button'
                          }
                          onClick={() => toggleMaintenance(locker)}
                        >
                          {locker.status === 'maintenance'
                            ? 'Retirar manutenção'
                            : 'Manutenção'}
                        </button>

                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() => deleteLocker(locker)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div
            className="admin-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <span className="page-label">
                  {isCreating ? 'NOVO ARMÁRIO' : 'EDITAR ARMÁRIO'}
                </span>

                <h2>
                  {isCreating
                    ? 'Cadastrar armário'
                    : `Armário #${selectedLocker?.number}`}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form
              className="admin-locker-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-form-group">
                <label htmlFor="locker-number">
                  Número
                </label>

                <input
                  id="locker-number"
                  type="text"
                  placeholder="Ex: 15"
                  value={number}
                  onChange={(event) =>
                    setNumber(event.target.value)
                  }
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="locker-size">
                  Tamanho
                </label>

                <select
                  id="locker-size"
                  value={size}
                  onChange={(event) =>
                    setSize(event.target.value as LockerSize)
                  }
                >
                  <option value="small">Pequeno</option>
                  <option value="medium">Médio</option>
                  <option value="large">Grande</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="locker-status">
                  Status
                </label>

                <select
                  id="locker-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as LockerStatus,
                    )
                  }
                >
                  <option value="available">
                    Disponível
                  </option>

                  <option value="reserved">
                    Reservado
                  </option>

                  <option value="occupied">
                    Ocupado
                  </option>

                  <option value="maintenance">
                    Manutenção
                  </option>
                </select>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={closeModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="admin-save-button"
                >
                  {isCreating
                    ? 'Cadastrar armário'
                    : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminLockers