const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";  
const contractABI = [  
    [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "hash",
                    "type": "string"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "AccessGranted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "hash",
                    "type": "string"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "AccessRevoked",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "hash",
                    "type": "string"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "DocumentAccessed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "hash",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "ipfsCID",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "DocumentUploaded",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_hash",
                    "type": "string"
                }
            ],
            "name": "accessDocument",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_hash",
                    "type": "string"
                }
            ],
            "name": "getDocumentInfo",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_hash",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "grantAccess",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_hash",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "revokeAccess",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_hash",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_ipfsCID",
                    "type": "string"
                }
            ],
            "name": "uploadDocument",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
];

let web3;
let contract;
let userAccount;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        userAccount = accounts[0];
        document.getElementById("walletAddress").innerText = `Připojeno: ${userAccount}`;
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Metamask není nainstalovaný!");
    }
}

async function uploadDocument() {
    const docHash = document.getElementById("docHash").value;
    const ipfsCID = document.getElementById("ipfsCID").value;

    if (!docHash || !ipfsCID) {
        alert("Vyplň hash a IPFS CID!");
        return;
    }

    await contract.methods.uploadDocument(docHash, ipfsCID).send({ from: userAccount });
    alert("Dokument nahrán!");
}

async function grantAccess() {
    const docHash = document.getElementById("accessDocHash").value;
    const userAddress = document.getElementById("userAddress").value;

    await contract.methods.grantAccess(docHash, userAddress).send({ from: userAccount });
    alert("Přístup udělen!");
}

async function revokeAccess() {
    const docHash = document.getElementById("accessDocHash").value;
    const userAddress = document.getElementById("userAddress").value;

    await contract.methods.revokeAccess(docHash, userAddress).send({ from: userAccount });
    alert("Přístup odebrán!");
}

async function getDocumentInfo() {
    const docHash = document.getElementById("infoDocHash").value;
    
    const result = await contract.methods.getDocumentInfo(docHash).call({ from: userAccount });
    document.getElementById("docInfo").innerText = `Vlastník: ${result[0]}, Čas: ${result[1]}, IPFS CID: ${result[2]}, Oprávnění: ${result[3].join(", ")}`;
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("uploadDoc").addEventListener("click", uploadDocument);
document.getElementById("grantAccess").addEventListener("click", grantAccess);
document.getElementById("revokeAccess").addEventListener("click", revokeAccess);
document.getElementById("getDocInfo").addEventListener("click", getDocumentInfo);
