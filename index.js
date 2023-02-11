require('dotenv').config() ;
const Web3 = require("web3");
const web3 = new Web3(process.env.NETWORK_URL);

const contractAddress = process.env.CONTRACT_ADDRESS;
const accountAddress = process.env.ACCOUNT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const contractABI = require("./abi.json"); // ABI of the contract
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

const froms = ["0x945eb86fb5bea0c46b96bbdf333743a03273fcc9",
"0x44c4f092c43654fb9979f8b13ec7605381aa679a",
"0x4bd04eea6328341422aaf23442dadbd97a8172c3",
"0xa7451041fb54aa4cdba51d4d39dfe3cf700fa010",
"0xca45c7914a9c1d7456fe3f7b0db1dbb3d6ebb94e",
"0x99e20865f312f647e86123dbe6790dac653e8603",
"0x2e659d495eb6567c00eda426065c88972daa6714",
"0x2170bf1361ade4a0753d45d085e8f2f7ac91bbe7",
"0xc838bd94088121e9526e282fa76d815cc23c7081",
"0xc101fee41dcc8762a5f14799ebea8f50a78a8cbc"]
const tokens = ["0xb809b9B2dc5e93CB863176Ea2D565425B03c0540",// BUSD Goerli
"0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557", // USDC Goerli
"0xb809b9B2dc5e93CB863176Ea2D565425B03c0540", // BUSD Goerli
"0x0Bb7509324cE409F7bbC4b701f932eAca9736AB7", // WETH Goerli
"0x73967c6a0904aA032C103b4104747E88c566B1A2", // DAI Goerli
"0x55084587299029426cD347Cfdc39E2ac38ac90f8", // GRT Goerli
"0xb809b9B2dc5e93CB863176Ea2D565425B03c0540", // BUSD Goerli
"0x0Bb7509324cE409F7bbC4b701f932eAca9736AB7", // WETH Goerli
"0x73967c6a0904aA032C103b4104747E88c566B1A2", // DAI Goerli
"0x55084587299029426cD347Cfdc39E2ac38ac90f8"]  // GRT Goerli
const tos = ["0xcc55ab3a7ccdddb21c7df625b5c4a6580daca12b",
"0xf85b48c19241e41457d455e3a840b4fc9eb525aa",
"0x50dbca3124231ededdd7b2bf984398ea51653999",
"0x14430bc7cd834975071da6f7aba3ad243529576d",
"0xead12e6e09ae28f75d65b7aa3e9abfe6b9073d08",
"0x2187cdda2bcc252942e94e542fd07cb5286c9590",
"0xc596df184c673f8a0e9bb7a304baf16aa70ad90b",
"0x30cecd7e357cd7ad6ebc37c4d4d2eb1720e41b14",
"0x9a75846b131091058a0e23a2e853ea0abdcc7b73",
"0x95291420c99c96bf4d07dbd89ac1d695070694f0"]

async function transferMethod() {
  // Create a contract instance from the ABI and contract address
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  const gasEstimate = await contractInstance.methods.transfer(froms, tokens, tos).estimateGas({from: accountAddress});
  console.log("Gas estimate: ", gasEstimate);
  // Create a new transaction object to call the payable method
  const tx = {
    from: accountAddress,
    to: contractAddress,
    value: web3.utils.toWei("0", "ether"), // 1 ETH
    gas: gasEstimate,
    data: contract.methods.transfer(froms, tokens, tos).encodeABI()
  };

  // Sign the transaction object with the private key
  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

  // Send the signed transaction to the network
  const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return result;
  
}

transferMethod()
.then(function(result) {
  console.log("Transaction result: ", result);
})
.catch(function(error) {
  console.log(error)
});