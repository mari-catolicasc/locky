import { api } from './api'
import type {
  CreateReservationPayload,
  Reservation,
  ReservationHistoryFilters,
  ReservationStatus,
} from '../types/reservation'

type ReservationApiResponse = {
  id: number
  locker_id: number
  locker_number: string
  locker_size: Reservation['lockerSize']
  date: string
  time: string
  status: ReservationStatus
}

type ReservationHistoryResponse = {
  items: ReservationApiResponse[]
  total: number
  limit: number
  offset: number
}

function mapReservation(data: ReservationApiResponse): Reservation {
  return {
    id: data.id,
    lockerId: data.locker_id,
    lockerNumber: data.locker_number,
    lockerSize: data.locker_size,
    date: data.date,
    time: data.time,
    status: data.status,
  }
}

export async function getMyReservations(status?: ReservationStatus): Promise<Reservation[]> {
  const { data } = await api.get<ReservationApiResponse[]>('/reservations/me', {
    params: status ? { status } : undefined,
  })
  return data.map(mapReservation)
}

export async function getReservationHistory(
  filters: ReservationHistoryFilters = {},
): Promise<{ items: Reservation[]; total: number }> {
  const { data } = await api.get<ReservationHistoryResponse>('/reservations/me/history', {
    params: filters,
  })
  return { items: data.items.map(mapReservation), total: data.total }
}

export async function createReservation(
  payload: CreateReservationPayload,
): Promise<Reservation> {
  const { data } = await api.post<ReservationApiResponse>('/reservations', payload)
  return mapReservation(data)
}

export async function cancelReservation(id: number): Promise<Reservation> {
  const { data } = await api.patch<ReservationApiResponse>(`/reservations/${id}/cancel`)
  return mapReservation(data)
}
