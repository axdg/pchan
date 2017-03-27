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

const thread = function (output) {
  return async function (input) {
    while (true) {
      const value = await input()
      console.log(value);
      if (value === null) {
        output(null)
        return Promise.resolve()
      }

      await output(value + 1)
    }

    return Promise.resolve()
  };
}

const processed = async function (output) {
  const values = []

  while (true) {
    const value = await output()
    if (value === null) break
    values.push(value)
  }

  return Promise.resolve(values)
};

test('send and recieve queueing', async function (t) {
  const input = channel(1);
  const output = channel(1);

  thread(output)(input)

  input(0)
  input(1)
  input(2)
  input(null)

  const values = await processed(output)
  console.log(values)
})
