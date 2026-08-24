import type { Reservation } from '../types/reservation'

const reservations: Reservation[] = [
  {
    id: 1,
    lockerNumber: '04',
    lockerSize: 'Médio',
    date: '24/08/2026',
    time: '18:30',
    status: 'active',
  },
  {
    id: 2,
    lockerNumber: '09',
    lockerSize: 'Grande',
    date: '18/08/2026',
    time: '19:00',
    status: 'completed',
  },
  {
    id: 3,
    lockerNumber: '02',
    lockerSize: 'Médio',
    date: '12/08/2026',
    time: '17:30',
    status: 'cancelled',
  },
  {
    id: 4,
    lockerNumber: '06',
    lockerSize: 'Grande',
    date: '09/08/2026',
    time: '18:15',
    status: 'completed',
  },
  {
    id: 5,
    lockerNumber: '01',
    lockerSize: 'Pequeno',
    date: '05/08/2026',
    time: '20:00',
    status: 'completed',
  },
]

export function getReservations() {
  return reservations
}