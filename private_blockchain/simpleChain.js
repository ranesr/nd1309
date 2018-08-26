/* ============= Persist data with LevelDB =============
|  Learn more: level - https://github.com/Level/level  |
===================================================== */

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
async function addLevelDBData(key, value){
    return new Promise(function(resolve, reject) {
        db.put(key, value, function(err) {
            if (err) {
                console.log('Block # ' + key + ' Submission failed', err);
                reject(err);
            } else {
                resolve('Added Block # ' + key + ', value: ' + value);
            }
        });
    });
}

// Get data from levelDB with key
async function getLevelDBData(key) {
    return new Promise(function(resolve, reject) {
        db.get(key, function(err, value) {
            if (err) {
                console.log('Not found!', err);
                reject(err);
            } else {
                console.log(value);
                resolve(value);
            }
        });
    });
}

// Add data to levelDB with value
async function addDataToLevelDB(value) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
        i++;
    }).on('error', function(err) {
        return console.log('Unable to read data stream!', err)
    }).on('close', function() {
        addLevelDBData(i, value);
    });
}

// Get the height of blockchain
async function getHeight() {
    let i = -1;
    return new Promise(function(resolve, reject) {
        db.createReadStream().on('data', function(data) {
            i++;
        }).on('error', function(err) {
            console.log('Error: ' + err);
            reject(err);
        }).on('close', function() {
            resolve(i);
        });
    });
}


/* ================= SHA256 with Crypto-js ===================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
=========================================================== */

const SHA256 = require('crypto-js/sha256');

/* ============ Block Class ============
|  Class with a constructor for block  |
======================================*/

class Block {
    constructor(data) {
        this.hash = '',
        this.height = 0,
        this.body = data,
        this.time = 0,
        this.previousBlockHash = ''
    }
}

/* ============== Blockchain Class ==============
|  Class with a constructor for new blockchain 	|
===============================================*/

class Blockchain {
    constructor() {
        this.addGenesisBlockIfNotPresent();
    }

    // Init
    async addGenesisBlockIfNotPresent() {
        try {
            // // Get block height
            let height = await this.getBlockHeight();
            if (height < 0) {
                this.addBlock(new Block('First block in the chain - Genesis block'));
                console.log('Genesis Block Added.');
            }
        } catch (err) {
            console.log('Error while adding Genesis Block: ' + err);
        }
    }

    // Add new block
    async addBlock(newBlock) {
        try {
            // Block height
            let height = await this.getBlockHeight();
            newBlock.height = height + 1;
            // UTC timestamp
            newBlock.time = new Date().getTime().toString().slice(0, -3);
            if(newBlock.height > 0) {
                // Get previous block
                let previousBlock = await this.getBlock(newBlock.height - 1);
                // Previous block hash
                newBlock.previousBlockHash = previousBlock.hash;
                // Block hash with SHA256 using newBlock and converting to a string
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                // Adding block object to chain
                let response = await addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
                console.log(response);
            } else {
                // Block hash with SHA256 using newBlock and converting to a string
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                // Adding block object to chain
                let response = await addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
                console.log(response);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Get block height
    async getBlockHeight() {
        try {
            // Get height
            return await getHeight();
        } catch (err) {
            console.log(err);
        }
    }

    // Get block
    async getBlock(blockHeight) {
        try {
            // Get block from Level db
            let block = await getLevelDBData(blockHeight);
            // Return object as a single string
            return JSON.parse(block);
        } catch (err) {
            console.log(err);
        }
    }

    // Validate block
    async validateBlock(blockHeight) {
        try {
            // Get block
            let block = await this.getBlock(blockHeight);
            // Get block hash
            let blockHash = block.hash;
            // Remove block hash to test block integrity
            block.hash = '';
            // Generate block hash
            let validBlockHash = SHA256(JSON.stringify(block)).toString();
            // Compare
            if (blockHash === validBlockHash) {
                console.log('Block # ' + blockHeight + ' is valid.');
                return true;
            } else {
                console.log('Block # ' + blockHeight + ' is invalid.');
                console.log('Actual Hash: ' + blockHash + ' <> ' + validBlockHash);
                console.log('Calculated Hash: ' + validBlockHash);
                return false;
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Validate blockchain
    async validateChain() {
        var errorLog = [];
        try {
            // Get block height
            let height = await this.getBlockHeight();
            for (var i = 0; i <= height; i++) {
                // Validate block
                let validateBlock = await this.validateBlock(i);
                if (!validateBlock) {
                    console.log('Block # ' + i + ' Validation Failed');
                    errorLog.push(i);
                }
                // Compare blocks hash link
                if (i > 0) {
                    // Get current and previous block
                    let [previousBlock, block] = await Promise.all([this.getBlock(i - 1), this.getBlock(i)]);
                    if (previousBlock.hash != block.previousBlockHash) {
                        console.log('Block # ' + i + ' previousBlockHash: ' + block.previousBlockHash + 
                            ' does not match with Block # ' + (i - 1) + ' hash: ' + previousBlock.hash);
                        errorLog.push(i);
                    }
                }
            }
            if (errorLog.length > 0) {
                console.log('Block errors = ' + errorLog.length);
                console.log('Blocks: ' + errorLog);
                return false;
            } else {
                console.log('No errors detected');
                return true;
            }
        } catch (err) {
            console.log(err);
        }
    }
}

/* ============ Tests ============
|  Test code for simpleChain.js  |
================================*/

let blockchain = new Blockchain();

// Method for adding blocks to test
async function createBlocks() {
    let height = await blockchain.getBlockHeight();
    if (height <= 10) {
        for (var i = 0; i < 10; i++) {
            await blockchain.addBlock(new Block('Test block ' + i));
        }
    }
}

// Method for validating chain
async function testValidateChain() {
    return blockchain.validateChain();
}

// Method for adding induced errors
async function addInducedErrorBlocks() {
    let inducedErrorBlocks = [2,4,7];
    for (var i = 0; i < inducedErrorBlocks.length; i++) {
        let block = await blockchain.getBlock(inducedErrorBlocks[i]);
        block.body = 'Induced Chain Error';
        await addLevelDBData(inducedErrorBlocks[i], JSON.stringify(block));
    }
}

// Run full tests
// 1. Creating blocks
// 2. Validate the chain (Passes)
// 3. Adding induced error blocks
// 4. Validate the chain (Fails)
createBlocks().then(testValidateChain).then(addInducedErrorBlocks).then(testValidateChain);
