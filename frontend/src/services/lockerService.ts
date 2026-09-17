import { api } from './api'
import type { Locker, LockerFilters, LockerStats } from '../types/locker'

type LockerListResponse = {
  items: Locker[]
  total: number
  limit: number
  offset: number
}

export async function getLockers(filters: LockerFilters = {}): Promise<LockerListResponse> {
  const { data } = await api.get<LockerListResponse>('/lockers', { params: filters })
  return data
}

export async function getLockerStats(): Promise<LockerStats> {
  const { data } = await api.get<LockerStats>('/lockers/stats')
  return data
}
