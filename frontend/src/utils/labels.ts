import type { LockerSize, LockerStatus } from '../types/locker'
import type { ReservationStatus } from '../types/reservation'

export function lockerSizeLabel(size: LockerSize): string {
  if (size === 'small') return 'Pequeno'
  if (size === 'medium') return 'Médio'
  return 'Grande'
}

export function lockerStatusLabel(status: LockerStatus): string {
  if (status === 'available') return 'Disponível'
  if (status === 'reserved') return 'Reservado'
  if (status === 'occupied') return 'Ocupado'
  return 'Em manutenção'
}

export function reservationStatusLabel(status: ReservationStatus): string {
  if (status === 'active') return 'Ativa'
  if (status === 'completed') return 'Concluída'
  return 'Cancelada'
}
