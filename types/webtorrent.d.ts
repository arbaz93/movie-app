declare module 'webtorrent' {
    export interface TorrentFile {
        name: string;
        length: number;
        renderTo: (
            element: HTMLVideoElement | HTMLElement,
            cb?: () => void
        ) => void;
    }

    export interface Torrent {
        files: TorrentFile[];
        name: string;
        progress: number;
        downloadSpeed: number;
        numPeers: number;
    }

    export interface AddOptions {
        announce?: string[];
    }

    export type AddCallback = (torrent: Torrent) => void;

    export default class WebTorrent {
        constructor();

        add(
            torrentId: string,
            opts: AddOptions | AddCallback,
            cb?: AddCallback
        ): void;

        remove(torrent: Torrent): void;

        destroy(): void;
    }
}