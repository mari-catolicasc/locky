import type { Locker } from '../types/locker'

const lockers: Locker[] = [
  { id: 1, number: '01', status: 'available', size: 'small' },
  { id: 2, number: '02', status: 'occupied', size: 'medium' },
  { id: 3, number: '03', status: 'reserved', size: 'large' },
  { id: 4, number: '04', status: 'available', size: 'medium' },
  { id: 5, number: '05', status: 'available', size: 'small' },
  { id: 6, number: '06', status: 'occupied', size: 'large' },
  { id: 7, number: '07', status: 'available', size: 'medium' },
  { id: 8, number: '08', status: 'reserved', size: 'small' },
  { id: 9, number: '09', status: 'available', size: 'large' },
  { id: 10, number: '10', status: 'occupied', size: 'small' },
  { id: 11, number: '11', status: 'available', size: 'medium' },
  { id: 12, number: '12', status: 'reserved', size: 'large' },
]

export function getLockers() {
  return lockers
}