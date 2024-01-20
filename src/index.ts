import "./index.scss";

const EXTENTION_ID = chrome.runtime.id;

function insertScript(path: string) {
    const id = EXTENTION_ID + "-" + path.replace("/", "_").replace(".", "_");

    if (document.getElementById(id)) return;

    const script = document.createElement("script");
    const srcUrl = chrome.runtime.getURL(path);
    script.id = id;
    script.src = srcUrl;
    script.type = "module";
    document.head.append(script);
    console.log(`inserted : '${path}'`);
}

function insertStyle(path: string) {
    const id = EXTENTION_ID + "-" + path.replace("/", "_").replace(".", "_");

    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    const srcUrl = chrome.runtime.getURL(path);
    link.id = id;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = srcUrl;
    document.head.append(link);
    console.log(`inserted : '${path}'`);
}

function main() {
    console.log("flexi-play-for-for-youtube : ver 0.1.0");
    insertStyle("dist/resources/bundle.css");
    insertScript("dist/resources/index.js");
}

main();
