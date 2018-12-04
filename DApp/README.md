# Decentralized Star Notary Project

For this project, you will create DApp notary service leveraging the Ethereum platform. You write smart contract that offer securely prove the existence for any digital asset - in this case unique stars and their metadata!

### Project Goals

| Part   | Details |
|:------:|:--------|
| Part 1 | Write a smart contract with functions to support proof of existence (i.e. notarization) |
| Part 2 | Test smart contract code coverage |
| Part 3 | Deploy smart contract on a public test network (Rinkeby) |
| Part 4 | Modify client code to interact with a smart contract |

### Terminal Output

```
truffle deploy --network rinkeby
Using network 'rinkeby'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x15ee8f73f0f658a1b4a32997e0dbfb723d5335ece72153ee8f89c47037c257ac
  Migrations: 0x8d9c072974b3f91efb976d7345fce549ff41a59e
Saving successful migration to network...
  ... 0xd0dd20a73aa2de32f5b633dff71d7b00bd72ef127b95ce24798b39d5855dc5e4
Saving artifacts...
Running migration: 2_deploy_star_notary.js
  Deploying StarNotary...
  ... 0x267ec8423458b5ad33fc93e3826883ba4c294cf2821a99c8431542f82d96d694
  StarNotary: 0x5a124b96a19258037cfb860f01252804db987013
Saving successful migration to network...
  ... 0x0f3df66b6a5df8a2dda54dfe9a32581b29725a876e020961d89d377d47662195
Saving artifacts...
```

### Contract Address

Contract address can be found at `0x5a124b96a19258037cfb860f01252804db987013`.
Available to see [here](https://rinkeby.etherscan.io/address/0x5a124b96a19258037cfb860f01252804db987013) on rinkeby network.

### Contract Hash

Contract hash can be found at `0x267ec8423458b5ad33fc93e3826883ba4c294cf2821a99c8431542f82d96d694`.
Available to see [here](https://rinkeby.etherscan.io/tx/0x267ec8423458b5ad33fc93e3826883ba4c294cf2821a99c8431542f82d96d694) on rinkeby network.

### Transaction Hashes
- Transaction hash for creating star can be found at `0x6637bcf2df61f49cebb38aafa1c6d74e278defd345832799a31bc5802399c09a`. Available to see [here](https://rinkeby.etherscan.io/tx/0x6637bcf2df61f49cebb38aafa1c6d74e278defd345832799a31bc5802399c09a) on rinkeby network.
- Transaction hash for putting star for sale can be found at `0x7004125817cdb5ae5402468d8c7dbe046d54c611e5162e9070f45f328bfb6eba`. Available to see [here](https://rinkeby.etherscan.io/tx/0x7004125817cdb5ae5402468d8c7dbe046d54c611e5162e9070f45f328bfb6eba) on rinkeby network.

### Helpful Links
- [Cryptographic Hash Function](https://ethereum.stackexchange.com/questions/550/which-cryptographic-hash-function-does-ethereum-use)
- [Knowledge Question](https://knowledge.udacity.com/questions/17839)
- [Truffle with MetaMask](https://truffleframework.com/docs/truffle/getting-started/truffle-with-metamask)
- [Error](https://ethereum.stackexchange.com/questions/38539/error-encountered-bailing-network-state-unknown-review-successful-transaction)
- [Deployment with Truffle](https://medium.com/coinmonks/5-minute-guide-to-deploying-smart-contracts-with-truffle-and-ropsten-b3e30d5ee1e)
