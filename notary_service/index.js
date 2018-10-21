'use strict';

/* ======= Web and services application framework =======
|  Learn more: hapijs - https://github.com/hapijs/hapi  |
====================================================== */

const hapi = require('hapi');

/* ======= HTTP-friendly error objects with boom ======
|  Learn more: boom - https://github.com/hapijs/boom  |
==================================================== */

const boom = require('boom');

// Util class
const util = require('./util.js');

// Blockchain class
const blockchain = require('./blockchain.js');

// Star validation class
const starValidation = require('./starValidation.js')

// Block class
var Block = require('./block.js');

// Server config
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8000;

// Create a server with a host and port
const server = hapi.server({
    host: DEFAULT_HOST,
    port: DEFAULT_PORT
});

var handlers = {
    postRequestValidation: async function (request, reply) {
        console.log('POST request validation: ' + JSON.stringify(request.payload));
        if (!request.payload.hasOwnProperty('address')) {
            // Bad Request
            return boom.badRequest('Please Pass address In The Payload');
        }
        
        // Get address
        const address = request.payload.address;
        try {
            // Get star registry data
            const data = await starValidation.getStarRegistryData(address);
            // Return validation response
            return reply.response(data).code(201);
        } catch (err) {
            console.log(err);
            if (boom.isBoom(err)) {
                // Create star registry data
                const data = await starValidation.createStarRegistryData(address);
                // Return validation response
                return reply.response(data).code(201);
            }
            // Some error
            return boom.badImplementation('Error Occurred');
        }
    },

    validateMessageSignature: async function (request, reply) {
        console.log('POST validate message signature: ' + JSON.stringify(request.payload));
        // Bad Requests
        if (!request.payload.hasOwnProperty('address')) {
            return boom.badRequest('Please Pass address In The Payload');
        }
        if (!request.payload.hasOwnProperty('signature')) {
            return boom.badRequest('Please Pass signature In The Payload');
        }

        try {
            // Get address
            const address = request.payload.address;
            // Get signature
            const signature = request.payload.signature;
            // Validate message signature
            const data = await starValidation.validateMessageSignature(address, signature);
            // Return validation response
            return data;//reply.response(data).code(200);
        } catch (err) {
            console.log(err);
            // Error
            return boom.badImplementation('Error Occurred');
        }
    },

    postBlock: async function (request, reply) {
        console.log('POST block: ' + JSON.stringify(request.payload));
        // Bad Requests
        if (!request.payload.hasOwnProperty('address')) {
            return boom.badRequest('Please Pass address In The Payload');
        }
        if (!request.payload.hasOwnProperty('star')) {
            return boom.badRequest('Please Pass star In The Payload');
        }

        try {
            // Get address
            const address = request.payload.address;
            // Check if the address has validate message signature
            const validatedSignature = await starValidation.isValidMessageSignature(address);
            if (!validatedSignature) {
                return boom.unauthorized('Address has no valid signature');
            }

            // Get star
            let star = request.payload.star;
            // Validate star
            if (!star.hasOwnProperty('ra')) {
                return boom.badRequest('Ra is required in Star');
            }
            if (!star.hasOwnProperty('dec')) {
                return boom.badRequest('Dec is required in Star');
            }
            if (!star.hasOwnProperty('story')) {
                return boom.badRequest('Story is required in Star');
            }
            if (!util.isASCII(star.story)) {
                return boom.badRequest('Story contains non-ASCII characters');
            }
            if (star.story.length > 500) {
                return boom.badRequest('Story can have maximum size of 500 bytes');
            }

            // Encode story for the star
            star.story = Buffer.from(star.story).toString('hex');
            // Create block
            const body = {
                address: address,
                star: star
            };
            // Add block to the chain
            const block = await blockchain.addBlock(new Block(body));
            // Return block
            return reply.response(block).code(201);
        } catch (err) {
            console.log(err);
            if (boom.isBoom(err)) {
                return boom.badRequest(err);
            }
            // Error
            return boom.badImplementation('Error Occurred');
        }
    },

    getBlock: async function (request, reply) {
        console.log('GET block with BLOCK_HEIGHT: ' + request.params.BLOCK_HEIGHT);
        // Validate if BLOCK_HEIGHT is a number
        if (isNaN(request.params.BLOCK_HEIGHT)) {
            // Bad Request
            return boom.badRequest('Please Pass A Valid Block Height');
        }

        try {
            // Get block and return it
            return await blockchain.getBlock(request.params.BLOCK_HEIGHT);
        } catch(err) {
            console.log(err);
            if (boom.isBoom(err)) {
                // Not Found
                return err;
            } else {
                // Error
                return boom.badImplementation('Error Occurred');
            }
        }
    },

    getBlockByHash: async function (request, reply) {
        console.log('GET block with BLOCK_HASH: ' + request.params.BLOCK_HASH);
        // Validate if BLOCK_HASH is not empty
        if (util.equals(request.params.BLOCK_HASH, '')) {
            // Bad Request
            return boom.badRequest('Please Pass A Valid Block Hash');
        }

        try {
            // Get block and return it
            return await blockchain.getBlockByHash(request.params.BLOCK_HASH);
        } catch(err) {
            console.log(err);
            // Error
            return boom.badImplementation('Error Occurred');
        }
    },

    getBlockByAddress: async function (request, reply) {
        console.log('GET block with BLOCK_ADDRESS: ' + request.params.BLOCK_ADDRESS);
        // Validate if BLOCK_HASH is not empty
        if (util.equals(request.params.BLOCK_ADDRESS, '')) {
            // Bad Request
            return boom.badRequest('Please Pass A Valid Block Address');
        }

        try {
            // Get block and return it
            return await blockchain.getBlockByAddress(request.params.BLOCK_ADDRESS);
        } catch(err) {
            console.log(err);
            // Error
            return boom.badImplementation('Error Occurred');
        }
    }
}

server.route([
    // POST Request Validation
    { path: '/requestValidation',             method: 'POST', handler: handlers.postRequestValidation },

    // POST Message Signature Validation
    { path: '/message-signature/validate',    method: 'POST', handler: handlers.validateMessageSignature },

    // POST Block with Star Object
    { path: '/block',                         method: 'POST', handler: handlers.postBlock },

    // GET Block at a Height
    { path: '/block/{BLOCK_HEIGHT}',          method: 'GET',  handler: handlers.getBlock },

    // GET Block using Hash
    { path: '/block/hash:{BLOCK_HASH}',       method: 'GET',  handler: handlers.getBlockByHash },

    // GET Block using Address
    { path: '/block/address:{BLOCK_ADDRESS}', method: 'GET',  handler: handlers.getBlockByAddress }
]);

const start = async () => {
    try {
        await server.start();
        console.log('Server running at: ' + server.info.uri);
    } catch(err) {
        console.log('Error while starting server: ', err);
    }
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

// Start the server
start();
