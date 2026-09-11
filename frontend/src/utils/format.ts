export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export function formatTime(time: string): string {
  return time.slice(0, 5)
}
