export type ReservationStatus = 'active' | 'completed' | 'cancelled'

export type Reservation = {
  id: number
  lockerNumber: string
  lockerSize: string
  date: string
  time: string
  status: ReservationStatus
}