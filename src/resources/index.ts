import { writeLog } from "./module.js";
import { YouTubePlayer } from "./player.js";
writeLog("inserted script");

let _playerCache: YouTubePlayer | null = null;
function getPlayer(): YouTubePlayer {
    if (_playerCache) {
        return _playerCache;
    }
    return (_playerCache = new YouTubePlayer());
}

let downKey: string | undefined = undefined;
function keydown(e: KeyboardEvent) {
    const target: any = e.target;
    const tagName: string = target.tagName;
    const isContentEditable: boolean = target.isContentEditable;

    if (tagName === "INPUT" || tagName === "TEXTAREA" || isContentEditable) {
        // 検索ボックスやコメントで文字を入力する際のキーイベントは無視する
        return;
    }

    if (downKey) return;
    downKey = e.code;
    switch (e.code) {
        case "KeyA": {
            getPlayer().startSeek(true);
            break;
        }
        case "KeyD": {
            getPlayer().startSeek(false);
            break;
        }
    }
}
function keyup(e: KeyboardEvent) {
    const target: any = e.target;
    const tagName: string = target.tagName;
    const isContentEditable: boolean = target.isContentEditable;

    if (tagName === "INPUT" || tagName === "TEXTAREA" || isContentEditable) {
        // 検索ボックスやコメントで文字を入力する際のキーイベントは無視する
        return;
    }
    switch (e.code) {
        case "KeyA":
        case "KeyD": {
            getPlayer().endSeek();
            break;
        }
    }

    downKey = undefined;
}

function main() {
    document.removeEventListener("keydown", keydown);
    document.addEventListener("keydown", keydown);

    document.removeEventListener("keyup", keyup);
    document.addEventListener("keyup", keyup);

    // init
    getPlayer();
}

main();
