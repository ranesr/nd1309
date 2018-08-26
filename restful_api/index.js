'use strict';

const hapi = require('hapi');
const boom = require('boom');
const blockchain = require('./blockchain.js');
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
    // curl http://localhost:8000/block -X POST -H 'Content-Type: application/json' -d '{"body":"Block Body Contents"}'
    post: async function (request, reply) {
        console.log('POST a block with request: ' + JSON.stringify(request.payload));
        if (!request.payload.hasOwnProperty('body')) {
            // Bad Request
            return boom.badRequest('Please Pass body In The Payload');
        }
        
        try {
            // Get body
            const body = request.payload.body;
            // Add block
            let block = await blockchain.addBlock(new Block(body));
            // Return block
            return reply.response(block).code(201);
        } catch (err) {
            console.log(err);
            // Error
            return boom.badImplementation('Error Occurred');
        }
    },

    // curl http://localhost:8000/block/1
    getOne: async function (request, reply) {
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
            if (isBoom(err)) {
                // Not Found
                return err;
            } else {
                // Error
                return boom.badImplementation('Error Occurred');
            }
        }
    }
}

server.route([
    // POST block endpoint
    { path: '/block',                method: 'POST', handler: handlers.post    },

    // GET block endpoint
    { path: '/block/{BLOCK_HEIGHT}', method: 'GET',  handler: handlers.getOne  }
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
