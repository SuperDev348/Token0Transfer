require('dotenv').config() ;
const Web3 = require("web3");
const web3 = new Web3(process.env.NETWORK_URL);

const contractAddress = process.env.CONTRACT_ADDRESS;
const accountAddress = process.env.ACCOUNT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const contractABI = require("./abi.json"); // ABI of the contract
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

const froms = ["0x945eb86fb5bea0c46b96bbdf333743a03273fcc9"]
const tokens = ["0xb809b9B2dc5e93CB863176Ea2D565425B03c0540"]  // GRT Goerli
const tos = ["0xcc55ab3a7ccdddb21c7df625b5c4a6580daca12b"]

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