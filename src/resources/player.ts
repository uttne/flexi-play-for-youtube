export interface VideoData {
    allowLiveDvr: boolean;
    author: string;
    backgroundable: boolean;
    cpn: string;
    errorCode: string | null;
    eventId: string | undefined;
    hasProgressBarBoundaries: boolean;
    isListed: boolean;
    isLive: boolean;
    isManifestless: boolean;
    isMultiChannelAudio: boolean;
    isPlayable: boolean;
    isPremiere: boolean;
    isWindowedLive: boolean;
    itct?: string;
    paidContentOverlayDurationMs: number | 0;
    paidContentOverlayText?: undefined;
    progressBarEndPositionUtcTimeMillis: null;
    progressBarStartPositionUtcTimeMillis: null;
    title: string;
    transitionEndpointAtEndOfStream?: any;
    video_id?: string;
    video_quality?: string | "medium";
    ypcOriginalItct?: any;
    ypcPreview?: any;
}

export class YouTubePlayer {
    readonly _player: HTMLElement & any;
    constructor() {
        const player = document.getElementById("movie_player");
        if (!player) {
            throw new Error("not found player");
        }
        this._player = player;
    }

    getCurrentTime(): number {
        return this._player.getCurrentTime();
    }

    playVideo(): void {
        this._player.playVideo();
    }

    pauseVideo(): void {
        this._player.pauseVideo();
    }

    seekTo(time: number): void {
        this._player.seekTo(time);
    }

    getDuration(): number {
        return this._player.getDuration();
    }

    //** プレイヤーの状態を取得
    // * 1: 再生中
    // * 2: 停止中
    // * 5: 非表示
    // */
    getPlayerState(): number {
        return this._player.getPlayerState();
    }

    getVideoData(): VideoData {
        return this._player.getVideoData();
    }
}
