# Simple Blockchain

### Project Goals

- Persist blockchain data using LevelDB (level library)
- Add new blocks to the blockchain
- Get blocks from the blockchain
- Get block height from the blockchain
- Validate a single block
- Validate the blockchain (multiple blocks)


### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the [Node.js® web site](https://nodejs.org/en/).

This simple blockchain project depends on `level`, and `crypto-js`.


### Installation

```
npm install
```


### Testing
(Testing code is already included in `simpleChain.js` towards the end)

To test code:
1: Open a command prompt or shell terminal after install node.js.

2: Remove the `chaindata` folder if it is already present

3: Run `node simpleChain.js` or `npm test`
