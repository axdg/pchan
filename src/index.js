/* eslint-disable no-constant-condition, no-await-in-loop, no-multi-assign */
module.exports = module.exports.default = function (capacity = 1) {
  /**
   * TODO: The value that is passed into the channel
   * as a capacity actually needs to be type checked,
   * it needs to be a positive integer (defaulting
   * to one).
   */

  const queue = []
  const puts = []
  const takes = []

  let closed = false

  const fn = function (value) {
    if (value !== undefined) {
      return new Promise((resolve, reject) => {
        if (closed === true) {
          return reject()
        }

        if (value === null) {
          closed = true
        }

        if (queue.length === capacity) {
          return puts.push(() => {
            queue.push(value)
            if (takes.length > 0) {
              takes.shift()()
            }

            return resolve()
          })
        }

        queue.push(value)
        if (takes.length > 0) {
          takes.shift()()
        }

        return resolve()
      })
    }

    return new Promise(resolve => {
      if (queue.length === 0) {
        if (closed) {
          return resolve(null)
        }

        return takes.push(() => {
          if (puts.length > 0) {
            puts.shift()()
          }

          return resolve(queue.shift())
        })
      }

      if (puts.length > 0) {
        puts.shift()()
      }

      return resolve(queue.shift())
    })
  }

  Object.defineProperty(fn, 'size', {get() {
    return queue.length
  }})

  Object.defineProperty(fn, 'open', {get() {
    return !closed
  }})

  fn.close = function () {
    return fn(null)
  }

  return fn
}

module.exports.range = function (c, fn) {}
module.exports.send = function (c, v) {}
module.exports.receive = function (c) {}
module.exports.close = function (c) {}
