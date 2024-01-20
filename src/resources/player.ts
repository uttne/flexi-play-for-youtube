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

export class SeekView {
    readonly _view: HTMLDivElement;
    readonly _p: HTMLParagraphElement;
    constructor(player: HTMLDivElement) {
        const classNames = ["flexi-play-for-youtube", "seek-view"];

        const currentView: HTMLDivElement | null = player.querySelector(
            classNames.map((c) => "." + c).join("")
        );
        if (currentView) {
            this._view = currentView;
            this._p = currentView.querySelector("p") as HTMLParagraphElement;
            return;
        }
        const view = document.createElement("div");
        classNames.forEach((c) => view.classList.add(c));
        view.style.display = "none";

        const p = document.createElement("p");

        view.appendChild(p);

        player.appendChild(view);

        this._view = view;
        this._p = p;
    }

    get isVisible(): boolean {
        return this._view.style.display === "none";
    }
    set isVisible(value: boolean) {
        this._view.style.display = value ? "flex" : "none";
    }
    get text(): string {
        return this._p.innerText;
    }
    set text(value: string) {
        this._p.innerText = value;
    }
}

export class YouTubePlayer {
    readonly _player: HTMLDivElement & any;
    readonly _seekView: SeekView;
    constructor() {
        const player = document.getElementById(
            "movie_player"
        ) as HTMLDivElement | null;
        if (!player) {
            throw new Error("not found player");
        }
        this._player = player;
        this._seekView = new SeekView(player);
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

    get seekView(): SeekView {
        return this._seekView;
    }

    private _popupSeekViewTimerId: NodeJS.Timeout | undefined = undefined;
    private _updateSeekTimeTimerId: NodeJS.Timeout | undefined = undefined;

    private _getSeekTime(): string {
        const currentTime = this._seekTimerId
            ? this._seekTime
            : this.getCurrentTime();

        const hour = Math.floor(currentTime / 3600);
        const minute = Math.floor((currentTime - hour * 3600) / 60);
        const second = Math.floor(currentTime - hour * 3600 - minute * 60);
        if (hour === 0)
            return (
                minute.toString() + ":" + ("0" + second.toString()).slice(-2)
            );
        return (
            hour.toString() +
            ":" +
            ("0" + minute.toString()).slice(-2) +
            ":" +
            ("0" + second.toString()).slice(-2)
        );
    }
    private _popupSeekView() {
        if (this._popupSeekViewTimerId) {
            clearTimeout(this._popupSeekViewTimerId);
            this._popupSeekViewTimerId = undefined;
        }
        this._popupSeekViewTimerId = setTimeout(() => {
            this._seekView.isVisible = false;
            this._popupSeekViewTimerId = undefined;

            if (this._updateSeekTimeTimerId) {
                clearInterval(this._updateSeekTimeTimerId);
                this._updateSeekTimeTimerId = undefined;
            }
        }, 1000);

        if (!this._updateSeekTimeTimerId) {
            this._updateSeekTimeTimerId = setInterval(() => {
                this._seekView.text = this._getSeekTime();
            }, 300);

            this._seekView.text = this._getSeekTime();
            this._seekView.isVisible = true;
        }
    }

    private _getInterval() {
        return 0.5;
    }
    _seekTime: number = 0;
    _seekTimerId: NodeJS.Timeout | undefined = undefined;
    _seekStartState: number = 0;
    startSeek(reverse: boolean = false) {
        if (this._seekTimerId) return;
        console.log("start seek");

        this._seekTime = this.getCurrentTime();
        this._seekStartState = this.getPlayerState();

        const updateInterval = () => {
            const seekTime =
                this._seekTime + this._getInterval() * (reverse ? -1 : 1);
            this._seekTime = Math.max(
                0,
                Math.min(this.getDuration(), seekTime)
            );
            this._popupSeekView();
        };
        this._seekTimerId = setInterval(updateInterval, 100);
        updateInterval();

        if (this._seekStartState === 1) {
            this.pauseVideo();
        }
    }

    endSeek() {
        if (!this._seekTimerId) return;
        console.log("end seek");

        clearInterval(this._seekTimerId);

        this.seekTo(this._seekTime);

        if (this._seekStartState === 1) {
            this.playVideo();
        }

        this._seekTimerId = undefined;
        this._seekTime = 0;
        this._seekStartState = 0;
    }
}
