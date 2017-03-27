# pchan

> JS channels implementation... for async fun.

## About

This is mt first attempt at pure JS implementation of [golang](https://golang.org/) style [channels](https://tour.golang.org/concurrency/2). The premise of channels for JS is that (in concert with [ES2017 async / await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and [promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) they can be used to write heavily asyncronous and parallel**-ish** in a very readable and pleasant way. Specially, they allow for functions resembling threads (or [goroutines](https://tour.golang.org/concurrency/1)) to be chained and syncronised with minimal effort.

pchan is feature complete and pretty performant, it allows for channel creation, buffering and closing, channel sends / recieves and ranging over open channels. The API is not particularly javascripty (as much a is practical, it resembles the golang API). The next attempt will just be an effort to make a channels look like more idiomatic JS.

## Usage

Coming Soon / WIP.

## API

### make([*capacity*])

 - **capacity** (`number`) - the size of the channels buffer.

### channel([*value*])

 - **value** (`mixed`) - the value to send into the channel.

### channel.close()

A convinience function used to close the channel, equivalent to `channel(null)`.

### range(*channel*, *fn*)

 - **channel** (`function`) - the channel to range over.
 - **fn** (`function`) - the callback function (called for each received value).

## License

&bull; **MIT** &copy; axdg ([axdg@dfant.asia](mailto:axdg@dfant.asia)), 2107 &bull;

lang
