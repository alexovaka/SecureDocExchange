// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureDocumentExchange {
    struct Document {
        address owner;
        string hash;
        string ipfsCID;
        uint256 timestamp;
        address[] authorizedUsers;
    }

    mapping(string => Document) private documents;
    mapping(string => mapping(address => bool)) private accessRights;
    mapping(string => address[]) private accessHistory;

    event DocumentUploaded(address indexed owner, string hash, string ipfsCID, uint256 timestamp);
    event AccessGranted(string hash, address indexed user);
    event AccessRevoked(string hash, address indexed user);
    event DocumentAccessed(string hash, address indexed user);

    modifier onlyOwner(string memory _hash) {
        require(documents[_hash].owner == msg.sender, "Not the document owner");
        _;
    }

    function uploadDocument(string memory _hash, string memory _ipfsCID) public {
        require(bytes(documents[_hash].hash).length == 0, "Document already exists");
        
        documents[_hash] = Document({
            owner: msg.sender,
            hash: _hash,
            ipfsCID: _ipfsCID,
            timestamp: block.timestamp,
            authorizedUsers: new address[](0)
        });
        
        emit DocumentUploaded(msg.sender, _hash, _ipfsCID, block.timestamp);
    }

    function grantAccess(string memory _hash, address _user) public onlyOwner(_hash) {
        require(!accessRights[_hash][_user], "User already has access");
        
        documents[_hash].authorizedUsers.push(_user);
        accessRights[_hash][_user] = true;
        
        emit AccessGranted(_hash, _user);
    }

    function revokeAccess(string memory _hash, address _user) public onlyOwner(_hash) {
        require(accessRights[_hash][_user], "User does not have access");
        
        accessRights[_hash][_user] = false;
        
        emit AccessRevoked(_hash, _user);
    }

    function accessDocument(string memory _hash) public {
        require(accessRights[_hash][msg.sender] || documents[_hash].owner == msg.sender, "Access denied");
        
        accessHistory[_hash].push(msg.sender);
        
        emit DocumentAccessed(_hash, msg.sender);
    }

    function getDocumentInfo(string memory _hash) public view returns (address, uint256, string memory, address[] memory) {
        require(accessRights[_hash][msg.sender] || documents[_hash].owner == msg.sender, "Access denied");
        
        Document storage doc = documents[_hash];
        return (doc.owner, doc.timestamp, doc.ipfsCID, doc.authorizedUsers);
    }
}
