function Channel(capacity) {
  const queue = [];
  const puts = [];
  const takes = [];

  let closed = false;

  Object.defineProperty(this, 'length', { get: function () {
    return queue.length;
  }});

  this.put = function (value) {
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
  };

  this.take = function () {
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
  };

  return this;
};
