import { getLockers } from '../services/lockerService.ts'
import './Dashboard.css'

function Dashboard() {
  const lockers = getLockers().slice(0, 8)

  function getSizeLabel(size: string) {
    if (size === 'small') return 'Pequeno'
    if (size === 'medium') return 'Médio'
    return 'Grande'
  }

  function getStatusLabel(status: string) {
    if (status === 'available') return 'Disponível'
    if (status === 'reserved') return 'Reservado'
    return 'Ocupado'
  }

  return (
    <section className="dashboard-content">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-label">VISÃO GERAL</span>
          <h1>Dashboard</h1>
          <p>Acompanhe a situação dos armários em tempo real.</p>
        </div>

        <div className="dashboard-user">
          <div className="user-avatar">GB</div>

          <div>
            <strong>Guilherme</strong>
            <span>Usuário</span>
          </div>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total de armários</span>
          <strong>24</strong>
          <small>Todos os armários</small>
        </article>

        <article className="stat-card stat-highlight">
          <span>Disponíveis</span>
          <strong>15</strong>
          <small>Prontos para reserva</small>
        </article>

        <article className="stat-card">
          <span>Reservados</span>
          <strong>5</strong>
          <small>Aguardando utilização</small>
        </article>

        <article className="stat-card">
          <span>Ocupados</span>
          <strong>4</strong>
          <small>Em utilização agora</small>
        </article>
      </section>

      <section className="lockers-section">
        <div className="section-header">
          <div>
            <h2>Armários</h2>
            <p>Visualize rapidamente a disponibilidade.</p>
          </div>

          <button className="view-all-button">Ver todos</button>
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

        <div className="lockers-grid">
          {lockers.map((locker) => (
            <button
              key={locker.id}
              className={`locker-card ${locker.status}`}
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
      </section>
    </section>
  )
}

export default Dashboard