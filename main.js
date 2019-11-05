//TODO:
//Storage: (Redis based)
//Queue: (Redis based)
//Graph processing

const debug = require("debug")("appBus:main");
const awaiterDebug = require("debug")("appBus:main:awaiter");
const Worker = require("./worker.js");

const worker = new Worker(require.resolve("./child"));

const run = async () => {
    const promises = [];
    for (let i = 0; i < 50; i++) {
        const input = `#${i} FOO`;

        debug(`Called: ${input}`);

        const callPromise = worker.call(input);
        callPromise.then(result => debug("%O", result));
        callPromise.catch(error => console.error(error));

        promises.push(callPromise);
    }

    awaiterDebug("Waiting for completion");
    await Promise.all(promises);
    awaiterDebug("Done");
};

const quit = async ( ) => {
    try {
        await worker.stop();
    } catch (err) {
        console.error(err);
    }

    setTimeout(() => process.exit(0), 0);
};

// handle main process SIGINT (default signal in Unix when "ctrl+c" terminal interruption happened)
process.on("SIGINT", quit);
run().catch(console.error);