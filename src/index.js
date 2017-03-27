const make = module.exports = function (capacity = 1) {
  /**
   * TODO: The value that is passed into the channel
   * as a capacity actually needs to be type checked,
   * it needs to be a positive integer (defaulting
   * to one).
   */

  const queue = []
  const puts = []
  const takes = []

  let closed = false;

  const fn = function (value) {
    if (value !== undefined) {
      return new Promise(function (resolve, reject) {
        if (closed === true) return reject()
        if (value === null) closed = true
        if (queue.length === capacity) {
          return puts.push(function () {
            queue.push(value);
            if (takes.length) takes.shift()()
            return resolve()
          })
        }

        queue.push(value)
        if (takes.length) takes.shift()()
        return resolve()
      });
    }

    return new Promise(function (resolve) {
      if (!queue.length) {
        if (closed) return resolve(null)
        return takes.push(function () {
          if (puts.length) puts.shift()()
          return resolve(queue.shift())
        })
      }

      if (puts.length) puts.shift()()
      return resolve(queue.shift())
    })
  }

    Object.defineProperty(fn, 'size', { get: function () {
      return queue.length
    }});

    Object.defineProperty(fn, 'closed', { get: function () {
      return closed
    }});

    fn.close = function () { return fn(null) }

    return fn;
};

module.exports.range = function () {}
module.exports.send = function () {}
module.exports.receive = function () {}
module.exports.close = function () {}


