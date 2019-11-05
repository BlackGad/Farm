const debug = require("debug")(`appBus1:worker:${process.pid}`);

function main(input, callback) {
    debug("%o", input);

    try {
        const result =
        {
            PID: process.pid,
            Input: input
        };

        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

module.exports = main;