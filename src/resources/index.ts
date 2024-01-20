import { writeLog } from "./module.js";
import { YouTubePlayer } from "./player.js";
writeLog("insert script");

let _playerCache: YouTubePlayer | null = null;
function getPlayer(): YouTubePlayer {
    if (_playerCache) {
        return _playerCache;
    }
    return (_playerCache = new YouTubePlayer());
}

function getInterval(): number {
    return 0.5;
}

function keydown(e: KeyboardEvent) {
    switch (e.code) {
        case "KeyU": {
            console.log("down U");
            const player = getPlayer();
            const interval = getInterval();
            const max = player.getDuration();

            const newTime = player.getCurrentTime() - interval;
            player.seekTo(Math.min(newTime, max));

            break;
        }
        case "KeyO": {
            console.log("down O");
            const player = getPlayer();
            const interval = getInterval();

            const newTime = player.getCurrentTime() + interval;
            player.seekTo(Math.max(newTime, 0));
            break;
        }
    }
}

function main() {
    document.removeEventListener("keydown", keydown);
    document.addEventListener("keydown", keydown);
}

main();
