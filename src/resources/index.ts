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
