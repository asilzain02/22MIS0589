import { Log } from "./logger.js";

async function run() {

    await Log(
        "backend",
        "info",
        "middleware",
        "logger initialized"
    );

}

run();