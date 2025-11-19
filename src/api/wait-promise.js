function noop() {}
/**
 * @param {number} interval - Timer interval
 * @param {number} beforeTime - Time to wait before starting polling
 * @param {number} afterTime
 * @param {number} limit - Polling limit, exceeding this treats polling as failed
 */
function Wait(interval, beforeTime, afterTime = 0, limit) {
    this.every(interval, limit);
    this.before(beforeTime);
    this.after(afterTime);
}

Wait.prototype = {
    /**
     * Set expiration time
     * @param {number} time
     */
    before(time) {
        this.startTime = Date.now();
        this.expires = this.startTime + time;
        return this;
    },
    and(func) {
        this.routine = func;
        return this;
    },
    /**
     * Set afterTime
     * @param {number} time
     */
    after(time) {
        this.afterTime = time;
        return this;
    },
    /**
     * Set timer interval
     * @param {number} interval - Timer interval
     * @param {number} limit
     */
    every(interval, limit) {
        this.interval = interval;
        if (limit !== null) {
            this.limit(limit);
        }
        return this;
    },
    /**
     * Set limit
     * @param {number} limit
     */
    limit(limit) {
        const nextLimit = limit > 0 ? limit : Infinity;
        this.limit = nextLimit;
        return this;
    },
    check(cond = noop) {
        return this.before(0).until(cond);
    },
    forward() {
        return this.until(() => false);
    },
    till(cond) {
        const self = this;
        return this.until(() => {
            let res;
            try {
                res = cond();
                return res === true;
            } catch (ex) {
                // force error
                self.limit = 0;
                throw ex;
            }
        });
    },
    /**
     * Code to evaluate, the polling part, returns a promise
     * @param {function} cond
     */
    until(cond) {
        const { routine } = this;
        const self = this;
        let called = 0;

        return new Promise(((resolve, reject) => {
            function f() {
                if (routine) {
                    routine(called);
                }
                called += 1;

                cond()
                    .then((...args) => {
                        /* eslint-disable prefer-spread */
                        resolve.apply(null, args);
                    })
                    .catch(() => f())
                    .finally(() => {
                        if (Date.now() >= self.expires || called >= self.limit) {
                            reject(new Error('Exceeded count or time limit'));
                        }
                    });
            }
            f();

            // setTimeout(() => {
            //     // Call f at regular intervals
            //     timer = setInterval(f, interval);
            // }, afterTime);
        }));
    },
};

module.exports = {
    every(interval, limit) {
        return new Wait(interval, Infinity, 0, limit);
    },
    and(func) {
        return new Wait(100, Infinity, 0).and(func);
    },
    limit(limit) {
        return new Wait(100, Infinity, 0, limit);
    },
    before(time, limit) {
        return new Wait(100, time, 0, limit);
    },
    after(time) {
        return new Wait(100, Infinity, time);
    },
    sleep(time) {
        return new Wait(100, Infinity, time).check();
    },
    until(cond) {
        return (new Wait(100, Infinity)).until(cond);
    },
    forward() {
        return (new Wait(100, Infinity)).forward();
    },
    till(cond) {
        return (new Wait(100, Infinity)).till(cond);
    },
    check(cond) {
        return (new Wait(100, 0)).until(cond);
    },
};
