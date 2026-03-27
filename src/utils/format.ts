export const formatRating = (rating: number) => rating.toFixed(1)

export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(isoDate))

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}
