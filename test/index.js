const test = require('ava')

const channel = require('../src/index')

test('instantiation and promise return', function (t) {
  const chan = channel(1);

  const put = chan('x');
  const take = chan();

  t.true(put instanceof Promise);
  t.true(take instanceof Promise);
});

test('ability to queue async operations', async function (t) {
  const input = channel(1);
  const output = channel(1);

  async function worker(input, output) {
    let done = false
    while (!done) {
      console.log('running at this point');
      const value = await input()
      if (value === null) done = true;
      output(value)
    }
  }

  async function pusher(output) {
    let done = false
    const accumulated = []

    while (!done) {
      const value = await output()
      if (value === null) done = true;
      accumulated.push(value)
    }

    return Promise.resolve(accumulated);
  }

  input(1)
  input(2)

  worker(input, output)

  const accumulated = await pusher(output)

  t.true(typeof accumulated === 'object')
  t.true(Array.isArray(accumulated))
})


