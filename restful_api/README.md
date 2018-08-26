# Simple Blockchain - RESTful API

### Project Goals

- Persist blockchain data using LevelDB (level library)
- Add new blocks to the blockchain
- Get blocks from the blockchain
- Build a RESTful web API using a Node.js framework that will interface with a simple private blockchain.

### Pre-requisites

Installing Node and NPM is pretty straightforward using the installer package available from the [Node.js® web site](https://nodejs.org/en/).

This simple blockchain project depends on `level`, `crypto-js`, `hapi`, and `boom`.


### Installation

```
npm install
```

Run from the command prompt or shell terminal to start the server: `npm start` or `node index.js`

### Details

This RESTful web API provides two endpoints for interfacing with the simple private blockchain.
The API is configured to run on localhost with port 8000.


**GET Block**
------
* **URL:** `/block/{BLOCK_HEIGHT}`
* **Method:** `GET`
* **URL Path Params:** `BLOCK_HEIGHT` (Height of the block to be retrieved)

* **Success Response:**
    * **Code:** 200
    * **Content:**

```
{
    "hash": "a05f2e23dca35ffb8982c209b244cac59098b3dd16722118294d7f8a88ae71f4",
    "height": 3,
    "body": "Block 3",
    "time": "1535319732",
    "previousBlockHash": "274aa77e4380ea73ee18c955248a6af9057b5c8dbd5da6368f371ef179e29ca5"
}
```

* **Error Responses:**

| Code   | Content                                                                                    |
|:------:|:-------------------------------------------------------------------------------------------|
| 400    | {"statusCode": 400, "error": "Bad Request", "message": "Please Pass A Valid Block Height"} |
| 404    | {"statusCode": 404, "error": "Not Found", "message": "Block Not Found!"}                   |
| 500    | {"statusCode": 500, "error": "Internal Server Error", "message": "Error Occurred"}         |


**POST Block**
------
* **URL:** `/block`
* **Method:** `POST`
* **Request Body:** `{"body": "Block Body"}`

* **Success Response:**
    * **Code:** 201
    * **Content:**

```
{
    "hash": "9a01fad6d2dd32dce3122e4b8c718ea7fda9cbe3f48e050ed76964714b76805e",
    "height": 4,
    "body": "Block Body",
    "time": "1535323062",
    "previousBlockHash": "a05f2e23dca35ffb8982c209b244cac59098b3dd16722118294d7f8a88ae71f4"
}
```

* **Error Responses:**

| Code   | Content                                                                                   |
|:------:|:------------------------------------------------------------------------------------------|
| 400    | {"statusCode": 400, "error": "Bad Request", "message": "Please Pass body In The Payload"} |
| 500    | {"statusCode": 500, "error": "Internal Server Error", "message": "Error Occurred"}        |
