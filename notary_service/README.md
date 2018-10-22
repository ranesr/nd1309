# Private Blockchain Notary Service

### Project Goals

- Users will be able to notarize star ownership using their blockchain identity.
- The application will provide a message to the user allowing them to verify their wallet address with a message
signature.
- Once a user verifies their wallet address, they have the right to register the star.
- Once registered, each star has the ability to share a story.
- Users will be able to look up their star by hash, block height, or wallet address.

### Project Functionality

- Persist star registry data using LevelDB (level library)
- Verify the message signature using bitcoinjs-message library
- Persist blockchain data using LevelDB (level library)
- Add new blocks to the blockchain
- Get blocks from the blockchain by hash, block height, or wallet address.
- Build a RESTful web API using a Node.js framework that will interface with a private blockchain notary service.

### Pre-requisites

Installing Node and NPM is pretty straightforward using the installer package available from the [Node.js® web site](https://nodejs.org/en/).

This private blockchain notary service project depends on `level`, `crypto-js`, `bitcoinjs-message`, `hapi`, and `boom`.


### Installation

```
npm install
```

Run from the command prompt or shell terminal to start the server: `npm start` or `node index.js`

### Details

This RESTful web API provides six endpoints for interfacing with the simple private blockchain.
The API is configured to run on localhost with port 8000.



**POST Request Validation**
------
* **URL:** `/requestValidation`
* **Method:** `POST`
* **Request Body:**

```
{
"address": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP"
}
```

* **Success Response:**
* **Code:** 201
* **Content:**

```
{
"address": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP",
"message": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP:1540149503436:starRegistry",
"requestTimestamp": 1540149503437,
"validationWindow": 300
}
```

* **Error Responses:**

| Code   | Content                                                                                      |
|:------:|:---------------------------------------------------------------------------------------------|
| 400    | {"statusCode": 400, "error": "Bad Request", "message": "Please Pass address In The Payload"} |
| 500    | {"statusCode": 500, "error": "Internal Server Error", "message": "Error Occurred"}           |


**POST Validate Message Signature**
------
* **URL:** `/message-signature/validate`
* **Method:** `POST`
* **Request Body:**

```
{
"address": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP",
signature": "IBjCxKFjpgsrG79sRRLnKLBqcH6RE4/EWkdgF3wS2n3uP17Ty4AhstbyyaUXuUBFi9KrW/a+dZEG5AbuMlcdxpc="
}
```

* **Success Response:**
* **Code:** 200
* **Content:** One of the following three responses

```
{
"registerStar": true,
"status": {
"address": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP",
"message": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP:1540148592852:starRegistry",
"requestTimestamp": 1540148592852,
"validationWindow": 278,
"messageSignature": "valid"
}
}
```

```
{
"registerStar": false,
"status": {
"address": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP",
"message": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP:1540148592852:starRegistry",
"requestTimestamp": 1540148592852,
"validationWindow": 248,
"messageSignature": "invalid"
}
}
```

```
{
"registerStar": false,
"status": {
"address": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP",
"message": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP:1540149503436:starRegistry",
"requestTimestamp": 1540149503437,
"validationWindow": 0,
"messageSignature": "Expired validation window!"
}
}
```

* **Error Responses:**

| Code   | Content                                                                                        |
|:------:|:-----------------------------------------------------------------------------------------------|
| 400    | {"statusCode": 400, "error": "Bad Request", "message": "Please Pass address In The Payload"}   |
| 400    | {"statusCode": 400, "error": "Bad Request", "message": "Please Pass signature In The Payload"} |
| 500    | {"statusCode": 500, "error": "Internal Server Error", "message": "Error Occurred"}             |


**POST Block**
------
* **URL:** `/block`
* **Method:** `POST`
* **Request Body:**

```
{
"address": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP",
"star": {
"ra": "16h 29m 1.0s",
"dec": "-26° 29' 24.9",
"story": "My first star"
}
}
```

* **Success Response:**
* **Code:** 201
* **Content:**

```
{
"hash": "06fb707b729d30c1cdf7d3cac22006be062fee9a74576ce526da5f347764c5b6",
"height": 1,
"body": {
"address": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP",
"star": {
"ra": "16h 29m 1.0s",
"dec": "-26° 29' 24.9",
"story": "4d792066697273742073746172"
}
},
"time": "1540150307",
"previousBlockHash": "2034d87417d6da3412081bd05c5f4b5c855c45ea2cbd616ee89b2a23e5b4fc3e"
}
```

* **Error Responses:**

| Code | Content                                                                                            |
|:----:|:---------------------------------------------------------------------------------------------------|
| 400  | {"statusCode": 400, "error": "Bad Request", "message": "Please Pass address In The Payload"}       |
| 400  | {"statusCode": 400, "error": "Bad Request", "message": "Please Pass star In The Payload"}          |
| 400  | {"statusCode": 400, "error": "Bad Request", "message": "Star Registry Data Not Found! Please Post Validation!"} |
| 401  | {"statusCode": 401, "error": "Unauthorized", "message": "Address has no valid signature"}          |
| 400  | {"statusCode": 400, "error": "Bad Request", "message": "Ra is required in Star"}                   |
| 400  | {"statusCode": 400, "error": "Bad Request", "message": "Dec is required in Star"}                  |
| 400  | {"statusCode": 400, "error": "Bad Request", "message": "Story is required in Star"}                |
| 400  | {"statusCode": 400, "error": "Bad Request", "message": "Story contains non-ASCII characters"}      |
| 400  | {"statusCode": 400, "error": "Bad Request", "message": "Story can have maximum size of 500 bytes"} |
| 500  | {"statusCode": 500, "error": "Internal Server Error", "message": "Error Occurred"}                 |


**GET Block By Height**
------
* **URL:** `/block/{BLOCK_HEIGHT}`
* **Method:** `GET`
* **URL Path Params:** `BLOCK_HEIGHT` (Height of the block to be retrieved)

* **Success Response:**
* **Code:** 200
* **Content:**

```
{
"hash": "eb62fd2d0a5ce809d7689f6f500c91dc6584b89e2d37c2d907e3366f3cd91a94",
"height": 1,
"body": {
"address": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP",
"star": {
"ra": "16h 29m 1.0s",
"dec": "-26° 29' 24.9",
"story": "4d792066697273742073746172",
"storyDecoded": "My first star"
}
},
"time": "1540148618",
"previousBlockHash": "bd2fe75d3e8a0ebd61d8edc4455397901b917b427865c4ce535eb4e13fac87da"
}
```

* **Error Responses:**

| Code   | Content                                                                                    |
|:------:|:-------------------------------------------------------------------------------------------|
| 400    | {"statusCode": 400, "error": "Bad Request", "message": "Please Pass A Valid Block Height"} |
| 404    | {"statusCode": 404, "error": "Not Found", "message": "Block Not Found!"}                   |
| 500    | {"statusCode": 500, "error": "Internal Server Error", "message": "Error Occurred"}         |


**GET Star By Hash**
------
* **URL:** `/stars/hash:{HASH}`
* **Method:** `GET`
* **URL Path Params:** `HASH` (Hash of the block to be retrieved)

* **Success Response:**
* **Code:** 200
* **Content:**

```
{
"hash": "eb62fd2d0a5ce809d7689f6f500c91dc6584b89e2d37c2d907e3366f3cd91a94",
"height": 1,
"body": {
"address": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP",
"star": {
"ra": "16h 29m 1.0s",
"dec": "-26° 29' 24.9",
"story": "4d792066697273742073746172",
"storyDecoded": "My first star"
}
},
"time": "1540148618",
"previousBlockHash": "bd2fe75d3e8a0ebd61d8edc4455397901b917b427865c4ce535eb4e13fac87da"
}
```

* **Error Responses:**

| Code   | Content                                                                                    |
|:------:|:-------------------------------------------------------------------------------------------|
| 400    | {"statusCode": 400, "error": "Bad Request", "message": "Please Pass A Valid Block Hash"}   |
| 500    | {"statusCode": 500, "error": "Internal Server Error", "message": "Error Occurred"}         |


**GET Stars By Address**
------
* **URL:** `/stars/hash:{ADDRESS}`
* **Method:** `GET`
* **URL Path Params:** `ADDRESS` (Address from the data of the block to be retrieved)

* **Success Response:**
* **Code:** 200
* **Content:**

```
[
{
"hash": "eb62fd2d0a5ce809d7689f6f500c91dc6584b89e2d37c2d907e3366f3cd91a94",
"height": 1,
"body": {
"address": "1A5JvTrZZCesCcjH5NMRQaWvDtMXxJ3qfP",
"star": {
"ra": "16h 29m 1.0s",
"dec": "-26° 29' 24.9",
"story": "4d792066697273742073746172",
"storyDecoded": "My first star"
}
},
"time": "1540148618",
"previousBlockHash": "bd2fe75d3e8a0ebd61d8edc4455397901b917b427865c4ce535eb4e13fac87da"
}
]
```

* **Error Responses:**

| Code   | Content                                                                                     |
|:------:|:--------------------------------------------------------------------------------------------|
| 400    | {"statusCode": 400, "error": "Bad Request", "message": "Please Pass A Valid Block Address"} |
| 500    | {"statusCode": 500, "error": "Internal Server Error", "message": "Error Occurred"}          |
