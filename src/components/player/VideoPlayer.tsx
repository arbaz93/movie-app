import { useRef, useState } from 'react'

interface VideoPlayerProps {
  src: string
  poster?: string
  title: string
}

export const VideoPlayer = ({ src, poster, title }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) {
      return
    }
    if (video.paused) {
      await video.play()
      setIsPlaying(true)
      return
    }
    video.pause()
    setIsPlaying(false)
  }

  const onSeek = (value: number) => {
    const video = videoRef.current
    if (!video || Number.isNaN(video.duration)) {
      return
    }
    video.currentTime = (value / 100) * video.duration
    setProgress(value)
  }

  const onVolumeChange = (value: number) => {
    const video = videoRef.current
    if (!video) {
      return
    }
    video.volume = value
    setVolume(value)
  }

  const openFullscreen = async () => {
    const video = videoRef.current
    if (!video) {
      return
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    await video.requestFullscreen()
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="aspect-video w-full bg-black"
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={() => {
          const video = videoRef.current
          if (!video || Number.isNaN(video.duration)) {
            return
          }
          setProgress((video.currentTime / video.duration) * 100)
        }}
      >
        <track kind="captions" label={`${title} captions`} />
      </video>
      <div className="flex flex-wrap items-center gap-3 border-t border-slate-700 bg-slate-950/90 p-3">
        <button
          type="button"
          onClick={togglePlay}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          Seek
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(event) => onSeek(Number(event.target.value))}
            className="w-40 accent-red-500 md:w-64"
            aria-label="Seek through video"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          Volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            className="w-24 accent-red-500"
            aria-label="Control volume"
          />
        </label>
        <button
          type="button"
          onClick={openFullscreen}
          className="ml-auto rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-100 hover:border-slate-400"
          aria-label="Toggle fullscreen"
        >
          Fullscreen
        </button>
      </div>
    </div>
  )
}
