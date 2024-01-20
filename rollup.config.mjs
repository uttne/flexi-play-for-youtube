import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import scss from "rollup-plugin-scss";

export default {
    input: {
        index: "src/index.ts",
        "resources/index": "src/resources/index.ts",
    },
    output: {
        dir: "dist",
        format: "es",
    },
    plugins: [
        typescript(),
        del({ targets: "dist/*" }),
        scss({
            fileName: "resources/bundle.css",
        }),
    ],
};
