'use client'

import { useEffect, useRef, useState } from 'react'
import WebTorrent from 'webtorrent/dist/webtorrent.min.js'

export default function SimpleTorrentPlayer() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const clientRef = useRef<any>(null)

    const [magnet, setMagnet] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        clientRef.current = new WebTorrent()

        return () => {
            clientRef.current?.destroy()
        }
    }, [])

    const startStreaming = () => {
        if (!magnet) return

        const client = clientRef.current
        const video = videoRef.current

        if (!client || !video) return

        setLoading(true)
        setError(null)

        // ✅ Add WebRTC trackers (important for browser)
        const trackers = [
            'wss://tracker.openwebtorrent.com',
            'wss://tracker.webtorrent.dev',
            'wss://tracker.btorrent.xyz',
            'udp://glotorrents.pw:6969/announce',
            'udp://tracker.opentrackr.org:1337/announce',
            'udp://torrent.gresille.org:80/announce',
            'udp://tracker.openbittorrent.com:80',
            'udp://tracker.coppersurfer.tk:6969',
            'udp://tracker.leechers-paradise.org:6969',
            'udp://p4p.arenabg.ch:1337',
            'udp://tracker.internetwarriors.net:1337'
        ]

        const fullMagnet =
            magnet + trackers.map(t => `&tr=${encodeURIComponent(t)}`).join('')

        const torrent = client.add(fullMagnet)

        torrent.on('ready', () => {
            const file = torrent.files.find((f: any) =>
                f.name.endsWith('.mp4') || f.name.endsWith('.webm')
            )

            if (!file) {
                setError('No playable video (.mp4/.webm)')
                setLoading(false)
                return
            }

            file.renderTo(video, (err: any) => {
                if (err) {
                    console.error(err)
                    setError('Playback error')
                    setLoading(false)
                    return
                }

                setLoading(false)
            })
        })

        torrent.on('error', (err: any) => {
            console.error(err)
            setError('Torrent failed')
            setLoading(false)
        })
        torrent.on('wire', () => {
            console.log('Peer connected')
        })

        torrent.on('noPeers', () => {
            console.log('No peers found')
        })
    }

    return (
        <div className="p-4 space-y-4">
            <input
                type="text"
                placeholder="Paste magnet URI..."
                value={magnet}
                onChange={(e) => setMagnet(e.target.value)}
                className="w-full p-2 border rounded text-black"
            />

            <button
                onClick={startStreaming}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Play
            </button>

            {loading && <p>Buffering...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <video
                ref={videoRef}
                controls
                className="w-full bg-black mt-4"
            />
        </div>
    )
}