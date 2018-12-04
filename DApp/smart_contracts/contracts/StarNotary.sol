pragma solidity ^0.4.23;

// CRITERION: Smart contract contains required functions
// OpenZeppelin implements all requested methods

import '../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

    // CRITERION: Add metadata to the star token
    struct Coordinates {
        string ra;
        string dec;
        string mag;
    }

    struct Star { 
        string name;
        string story;
        Coordinates coordinates;
    }

    uint256 public tokenCount;

    mapping(uint256 => Star) public tokenIdToStarInfo; 
    mapping(uint256 => uint256) public starsForSale;
    mapping(bytes32 => bool) public starHash;

    // Create Star
    function createStar(string _ra, string _dec, string _mag, string _name, string _story) public {
        // Validate All Inputs
        require(keccak256(abi.encodePacked(_ra)) != keccak256(''));
        require(keccak256(abi.encodePacked(_dec)) != keccak256(''));
        require(keccak256(abi.encodePacked(_mag)) != keccak256(''));

        // CRITERION: Configure uniqueness with the stars
        // Smart contract prevents stars with the same coordinates from being added
        require(!checkIfStarExist(_ra, _dec, _mag));

        tokenCount++;
        uint256 tokenId = tokenCount;
        // Validate tokenId > 0
        require(tokenId != 0);
        // Verify tokenId does not exist
        require(keccak256(abi.encodePacked(tokenIdToStarInfo[tokenId].coordinates.dec)) == keccak256(''));

        Coordinates memory coordinates = Coordinates(_ra, _dec, _mag);
        Star memory newStar = Star(_name, _story, coordinates);

        tokenIdToStarInfo[tokenId] = newStar;
        starHash[keccak256(abi.encodePacked(_ra, _dec, _mag))] = true;

        _mint(msg.sender, tokenId);
    }

    // Put Star Up for Sale
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    // Buy Star
    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    // Check if Star Already Exists
    function checkIfStarExist(string _ra, string _dec, string _mag) public view returns(bool) {
        return starHash[keccak256(abi.encodePacked(_ra, _dec, _mag))];
    }

    // Star Information from Token Id
    function tokenIdToStarInfo(uint256 _tokenId) public view returns(string, string, string, string, string) {
        return (tokenIdToStarInfo[_tokenId].name,
                tokenIdToStarInfo[_tokenId].story,
                tokenIdToStarInfo[_tokenId].coordinates.ra,
                tokenIdToStarInfo[_tokenId].coordinates.dec,
                tokenIdToStarInfo[_tokenId].coordinates.mag);
    }

    // Override mint Method
    function mint(uint256 tokenId) public {
        super._mint(msg.sender, tokenId);
    }
}
