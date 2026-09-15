export type LockerStatus =
  | 'available'
  | 'reserved'
  | 'occupied'
  | 'maintenance'

export type LockerSize = 'small' | 'medium' | 'large'

export type Locker = {
  id: number
  number: string
  status: LockerStatus
  size: LockerSize
}