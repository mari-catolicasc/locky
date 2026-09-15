export type LockerStatus = 'available' | 'reserved' | 'occupied' | 'maintenance'

export type LockerSize = 'small' | 'medium' | 'large'

export type Locker = {
  id: number
  number: string
  status: LockerStatus
  size: LockerSize
}

export type LockerStats = {
  total: number
  available: number
  reserved: number
  occupied: number
}

export type LockerFilters = {
  status?: LockerStatus
  size?: LockerSize
  limit?: number
  offset?: number
}
