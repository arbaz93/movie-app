export type MovieCategory = 'trending' | 'popular' | 'topRated'
// export type Torrent = {
//   url:string,
//   hash:string,
//   peers:number,
//   seeds: number,
//   quality:string,
//   size:string,
//   size_bytes:number,
//   audio_channel:string,
//   bit_depth:string,
//   date_uploaded:string,
//   date_uploaded_unix:number,
//   is_repack:string,
//   type:string,
//   video_codex:string
// }
export interface Movie {
  id: number
  title: string
  description: string
  posterUrl: string
  backdropUrl: string
  rating: number
  releaseDate: string
  durationMinutes: number
  categories: MovieCategory[]
  videoUrl: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  totalPages: number
  totalResults: number
}
