/*-----------------
| Star Notary Test|
-----------------*/

const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 

    const name = 'Star power 103!'
    const story = 'I love my wonderful star'
    const ra = 'ra_031.135'
    const dec = 'dec_221.382'
    const mag = 'mag_146.376'
    const tokenId = 1

    let defaultAccount = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let randomMaliciousUser = accounts[3]
    let starPrice = web3.toWei(.01, "ether")

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: defaultAccount})
    })

    // Create Star Test
    describe('Create Star Test', () => { 
        // Can Create A Star Test
        it('Can Create A Star Test', async function () {
            await this.contract.createStar(ra, dec, mag, name, story, {from: user1})

            // Get Star Data Test
            it('Get Star Data Test', async function () {
                assert.deepEqual(await this.contract.tokenIdToStarInfo(tokenId), [name, story, ra, dec, mag])
            })
        })
    })

    // Buying and Selling Stars Test
    // putStarUpForSale, starsForSale, buyStar, ownerOf Tests
    describe('Selling and Buying Stars Test', () => {

        it('User2 is the owner of the Star after They buy it', async function () {
            await this.contract.createStar(name, story, ra, dec, mag, {from: user1})
            await this.contract.putStarUpForSale(tokenId, starPrice, {from: user1})

            assert.equal(await this.contract.starsForSale(tokenId), starPrice)

            await this.contract.buyStar(tokenId, {from: user2, value: starPrice, gasPrice: 0})
            assert.equal(await this.contract.ownerOf(tokenId), user2)
        })
    })

    // Check if Star Exists Test
    describe('Check if Star Exists Test', () => {
        it('Star Already Exists Test', async function () {
            await this.contract.createStar(ra, dec, mag, name, story, {from: defaultAccount})
            // Star Already Exists Test
            assert.equal(await this.contract.checkIfStarExist(ra, dec, mag), true);
        })
    })

    // Mint Test
    describe('Mint Test', () => {
        it('Basic Mint Test', async function () {
            let tx = await this.contract.mint(tokenId, {from: defaultAccount})
            var owner = await this.contract.ownerOf(tokenId, {from: defaultAccount})
            assert.equal(owner, defaultAccount)
        })
    })

    // Approved & GetApproved Test
    describe('Approved and GetApproved Test', () => {
        it('GetApproved Test', async function () {
            await this.contract.createStar(ra, dec, mag, name, story, {from: defaultAccount})
            tx = await this.contract.approve(user1, tokenId, {from: defaultAccount})

            // GetApproved Test
            assert.equal(await this.contract.getApproved(tokenId, {from: defaultAccount}), user1)
        })
    })

    // SetApprovalForAll & IsApprovedForAll Test
    describe('SetApprovalForAll & IsApprovedForAll Test', () => {
        it('IsApprovedForAll Test', async function () {
            await this.contract.createStar(ra, dec, mag, name, story, {from: defaultAccount})
            await this.contract.setApprovalForAll(user1, tokenId)

            // IsApprovedForAll Test
            assert.equal(await this.contract.isApprovedForAll(defaultAccount, user1, {from: defaultAccount}), true)
        })
    })

    // SafeTransferFrom Test
    describe('SafeTransferFrom Test', () => {
        beforeEach(async function() {
            await this.contract.createStar(ra, dec, mag, name, story, {from: defaultAccount})
            await this.contract.safeTransferFrom(defaultAccount, user2, tokenId)
        })
        it('Owner of The Token Test', async function () {
            // Owner of The Token Test
            assert.equal(await this.contract.ownerOf(tokenId, {from: defaultAccount}), user2)
        })
        it('Not Owner of The Token Test', async function () {
            // Not Owner of The Token Test
            assert.notEqual(await this.contract.ownerOf(tokenId, {from: defaultAccount}), defaultAccount)
        })
    })

})
