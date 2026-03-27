'use client'

import { useRef, useState, useEffect } from 'react'
import WebTorrent from 'webtorrent/dist/webtorrent.min.js'
import { getTorrentMagnet } from '@/utils/torrentFunctions'
import { type Torrent } from '@/types/movie'

interface TorrentPlayerProps {
    torrents: Torrent[] | null
    poster?: string
    title: string
}

let client: WebTorrent.Instance | null = null

export const TorrentPlayer = ({ torrents, poster, title }: TorrentPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const torrentRef = useRef<any>(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // ✅ FIX: generate magnet safely
    const src = getTorrentMagnet(torrents)

    useEffect(() => {
        if (!src || typeof window === 'undefined') return

        if (!client) {
            client = new WebTorrent()
        }

        const video = videoRef.current
        if (!video) return

        setLoading(true)
        setError(null)

        let torrent = client.get(src)

        const handleTorrent = (torrent: any) => {
            if (!torrent) return

            // ✅ WAIT until metadata is ready
            if (!torrent.files || torrent.files.length === 0) {
                torrent.once('ready', () => handleTorrent(torrent))
                return
            }

            setupTorrent(torrent)
        }

        if (torrent) {
            console.log('Using existing torrent')
            handleTorrent(torrent)
        } else {
            const trackers = [
                'wss://tracker.openwebtorrent.com',
                'wss://tracker.webtorrent.dev',
                'wss://tracker.btorrent.xyz'
            ]

            const magnetWithTrackers =
                src + trackers.map(t => `&tr=${encodeURIComponent(t)}`).join('')

            torrent = client.add(magnetWithTrackers)
            torrentRef.current = torrent

            torrent.on('ready', () => handleTorrent(torrent))

            torrent.on('error', (err: any) => {
                console.error(err)
                setError('Failed to load torrent')
                setLoading(false)
            })
        }

        function setupTorrent(torrent: any) {
            if (!torrent.files) {
                setError('Torrent metadata not available')
                setLoading(false)
                return
            }

            const file = torrent.files.find((file: any) =>
                file.name.endsWith('.mp4') ||
                file.name.endsWith('.webm') ||
                file.name.endsWith('.mkv') // optional
            )

            if (!file) {
                setError('No playable video found')
                setLoading(false)
                return
            }

            file.renderTo(video, (err: any) => {
                if (err) {
                    console.error(err)
                    setError('Error rendering video')
                    setLoading(false)
                    return
                }

                setLoading(false)
            })
        }

        return () => {
            if (torrentRef.current && client) {
                try {
                    client.remove(torrentRef.current)
                } catch (e) {
                    console.warn('Cleanup error:', e)
                }
            }
        }
    }, [src])

    const togglePlay = async () => {
        const video = videoRef.current
        if (!video) return

        if (video.paused) {
            await video.play()
        } else {
            video.pause()
        }
    }

    const onSeek = (value: number) => {
        const video = videoRef.current
        if (!video || Number.isNaN(video.duration)) return

        video.currentTime = (value / 100) * video.duration
        setProgress(value)
    }

    const onVolumeChange = (value: number) => {
        const video = videoRef.current
        if (!video) return

        video.volume = value
        setVolume(value)
    }

    const openFullscreen = async () => {
        const video = videoRef.current
        if (!video) return

        if (document.fullscreenElement) {
            await document.exitFullscreen()
        } else {
            await video.requestFullscreen()
        }
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-black">
            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
                        Buffering...
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90 text-red-500 text-center p-4">
                        {error}
                    </div>
                )}

                <video
                    ref={videoRef}
                    poster={poster}
                    className="aspect-video w-full bg-black"
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    onTimeUpdate={() => {
                        const video = videoRef.current
                        if (!video || Number.isNaN(video.duration)) return
                        setProgress((video.currentTime / video.duration) * 100)
                    }}
                    controls={false}
                />
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-slate-700 bg-slate-950/90 p-3">
                <button onClick={togglePlay} className="bg-red-600 px-3 py-2 text-white">
                    {isPlaying ? 'Pause' : 'Play'}
                </button>

                <input
                    type="range"
                    min={0}
                    max={100}
                    value={progress}
                    onChange={(e) => onSeek(Number(e.target.value))}
                />

                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                />

                <button onClick={openFullscreen} className="ml-auto text-white">
                    Fullscreen
                </button>
            </div>
        </div>
    )
}