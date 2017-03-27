const test = require('ava')

const channel = require('../src/index')

test('instantiation and promise return', function (t) {
  const chan = channel(1)

  const put = chan('x')

  t.true(put instanceof Promise)

  const take = chan();

  t.true(take instanceof Promise)
});

test('channel size', async function (t) {
  const chan = channel(2)

  t.true(chan.size === 0)

  t.true(await chan('x') === undefined)
  t.true(await chan('x') === undefined)

  t.true(chan.size === 2)

  const values = []

  values.push(await chan())
  values.push(await chan())

  t.true(JSON.stringify(values) === JSON.stringify(['x', 'x']))

  t.true(chan.size === 0)

  t.true(chan.closed === false)

  await chan.close()

  t.true(chan.closed === true)
})

const sleep = function (ms) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(), ms)
  })
}

const thread = function (output) {
  return async function (input) {
    while (true) {
      const value = await input()
      if (value === null) {
        await output(null)
        break
      }

      await output(value + 1)
    }

    return Promise.resolve()
  };
}

const processed = async function (output) {
  const values = []

  while (true) {
    const value = await output ()
    if (value === null) return Promise.resolve(values)
    values.push(value)
  }

  return Promise.resolve(values)
};

test('send and recieve queueing', async function (t) {
  const input = channel(1);
  const output = channel(1);

  thread(output)(input)

  const through = [0, 1, 2, 3, 4, null]
  through.forEach(i => input(i))

  const values = await processed(output)
  t.true(JSON.stringify(values) === JSON.stringify([1, 2, 3, 4, 5]))
})
