export const getTorrentMagnet = (hash: string, name?: string) => {
    const trackers = [
        // WebRTC (REQUIRED for browser)
        'wss://tracker.openwebtorrent.com',
        'wss://tracker.btorrent.xyz',
        'wss://tracker.fastcast.nz',

        // UDP (extra fallback, harmless if ignored)
        'udp://glotorrents.pw:6969/announce',
        'udp://tracker.opentrackr.org:1337/announce',
        'udp://torrent.gresille.org:80/announce',
        'udp://tracker.openbittorrent.com:80',
        'udp://tracker.coppersurfer.tk:6969',
        'udp://tracker.leechers-paradise.org:6969',
        'udp://p4p.arenabg.ch:1337',
        'udp://tracker.internetwarriors.net:1337'
    ]

    const trackerParams = trackers
        .map(t => `&tr=${encodeURIComponent(t)}`)
        .join('')

    const dn = name ? `&dn=${encodeURIComponent(name)}` : ''

    return `magnet:?xt=urn:btih:${hash}${dn}${trackerParams}`
}


type Torrent = {
    hash: string
    quality: string
    seeds: number
    peers: number
    size_bytes: number
}

export const getBestTorrent = (torrents: Torrent[]) => {
    if (!torrents?.length) return null

    // Priority strategy:
    // 1. Prefer 720p (fast start)
    // 2. Then highest seeds
    // 3. Then smallest size

    const sorted = torrents.sort((a, b) => {
        const score = (t: Torrent) => {
            let s = 0

            if (t.quality === '720p') s += 50
            if (t.quality === '1080p') s += 30
            if (t.quality === '2160p') s += 10

            s += t.seeds * 2
            s += t.peers

            // smaller = faster start
            s -= t.size_bytes / (1024 * 1024 * 100)

            return s
        }

        return score(b) - score(a)
    })

    return sorted[0]
}


