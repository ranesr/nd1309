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

module.exports.addLevelDBData = addLevelDBData;
module.exports.getLevelDBData = getLevelDBData;
module.exports.addDataToLevelDB = addDataToLevelDB;
module.exports.getHeight = getHeight;
