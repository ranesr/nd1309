/* ============= Persist data with LevelDB =============
|  Learn more: level - https://github.com/Level/level  |
===================================================== */

const level = require('level');

/* ======= HTTP-friendly error objects with boom ======
|  Learn more: boom - https://github.com/hapijs/boom  |
==================================================== */

const boom = require('boom');

// Registry data DB location
const starRegistryDB = './starRegistryData';

// Level db object
const db = level(starRegistryDB);

// Add star registry data to levelDB with key/value pair
async function addStarRegistryData(key, value){
    return new Promise(function(resolve, reject) {
        db.put(key, value, function(err) {
            if (err) {
                console.log('Address # ' + key + ' Submission failed', err);
                reject(err);
            } else {
                resolve('Added Address # ' + key + ', value: ' + value);
            }
        });
    });
}

// Get star registry data from levelDB with key
async function getStarRegistryData(key) {
    return new Promise(function(resolve, reject) {
        db.get(key, function(err, value) {
            if (err) {
                console.log('Not found!', err);
                reject(boom.notFound('Star Registry Data Not Found! Please Post Validation!'));
            } else if (value == undefined) {
                console.log('Undefined');
                reject(boom.badRequest('Star Registry Data Undefined'));
            } else {
                console.log(value);
                resolve(value);
            }
        });
    });
}

// Delete star registry data from levelDB using key
async function deleteStarRegistryData(key) {
    return new Promise(function(resolve, reject) {
        try {
            db.del(key);
            resolve('Success');
        } catch (err) {
            console.log('Error: ' + err);
            reject(err);
        }
    });
}

module.exports.addStarRegistryData = addStarRegistryData;
module.exports.getStarRegistryData = getStarRegistryData;
module.exports.deleteStarRegistryData = deleteStarRegistryData;
