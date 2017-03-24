function pchan(capacity) {
  const queue = [];
  const puts = [];
  const takes = [];

  let closed = false;

  const fn = function (value) {
    if (value) {
      return new Promise(function (resolve, reject) {
        if (closed === true) {
          reject();
          return;
        };

        if (value === null) closed = true;

        if (queue.length === capacity) {
          puts.push(function () {
            resolve(queue.push(value));
            if (takes.length) takes.shift()();
          });

          return;
        }

        resolve(queue.push(value));
        if (takes.length) takes.shift()();
      });
    }

    return new Promise(function (resolve) {
      if (!queue.length) {
        if (closed) {
          resolve(null);
          return;
        }

        takes.push(function () {
          resolve(queue.shift());
          if (puts.length) puts.shift()();
        });

        return;
      }

      resolve(queue.unshift());
      if (puts.length) puts.shift()();

      return;
    });
  }

  Object.defineProperty(fn, 'size', { get: function () {
    return queue.length;
  }});

  Object.defineProperty(fn, 'closed', { get: function () {
    return closed;
  }});

  fn.close = function () { return fn(null); };

  return fn;
};

module.exports = pchan;


