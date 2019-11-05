const workerFarm = require("worker-farm");

const farmOptions = {
    workerOptions: {},
    maxCallsPerWorker: Infinity,
    maxConcurrentWorkers: require("os").cpus().length,
    maxConcurrentCallsPerWorker: 10,
    maxConcurrentCalls: Infinity,
    maxCallTime: Infinity,
    maxRetries: 0,
    autoStart: false,
    onChild: function() {}
};


class Worker {
    constructor(path) {
        this._worker = workerFarm(farmOptions, path);
    }

    /**
     * @param input
     * @returns {Promise}
     */
    async call(input) {
        return new Promise((resolve, reject) => {
            const callback = function(error, output) {
                if (error) {
                    reject(error);
                } else {
                    resolve(output);
                }
            }

            this._worker(input, callback);
        });
    }

    /**
     * @returns {Promise}
     */
    async stop() {
        return new Promise((resolve, reject) => {
            try {
                workerFarm.end(this._worker);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

}

module.exports = Worker;