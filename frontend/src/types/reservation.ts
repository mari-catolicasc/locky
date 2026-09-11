import type { LockerSize } from './locker'

export type ReservationStatus = 'active' | 'completed' | 'cancelled'

export type Reservation = {
  id: number
  lockerId: number
  lockerNumber: string
  lockerSize: LockerSize
  date: string
  time: string
  status: ReservationStatus
}

export type CreateReservationPayload = {
  locker_id: number
  date: string
  time: string
}

export type ReservationHistoryFilters = {
  search?: string
  status?: ReservationStatus
  start_date?: string
  end_date?: string
  limit?: number
  offset?: number
}
