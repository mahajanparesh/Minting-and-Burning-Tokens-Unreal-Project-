import { useEffect, useState } from 'react';
import Web3 from 'web3';

const ethers = require("ethers")
function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [nUSDBalance, setnUSDBalance] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [redeemAmount, setredeemAmount] = useState('');

  useEffect(() => {
    checkMetaMaskConnection();
  }, []);
  const contractAddress = '0x9E051C979C1FAC6baD02b5cC855ad985805226B7';
  const contractABI =
    [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_priceFeedAddress",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "depositor",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "ethAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "nusdAmount",
            "type": "uint256"
          }
        ],
        "name": "Deposit",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "redeemer",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "nusdAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "ethAmount",
            "type": "uint256"
          }
        ],
        "name": "Redeem",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getEthToUsd",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "nusdAmount",
            "type": "uint256"
          }
        ],
        "name": "redeem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
  async function checkMetaMaskConnection() {
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);

      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      console.error('MetaMask is not installed.');
    }
  }

  async function fetchBalance() {
    if (!isConnected) return;

    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      setAccount(address);

      const balance = await web3.eth.getBalance(address);
      const formattedBalance = web3.utils.fromWei(balance, 'ether');
      setBalance(formattedBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }

  async function fetchnUSDBalance(){
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = signer.getAddress();
      const contract = new ethers.Contract(contractAddress,  contractABI, signer);
      const nUsd = await contract.balanceOf(signerAddress);
      const nUsdString = nUsd.toString();
      setnUSDBalance(nUsdString);
    } catch (error) {
      console.error('Error fetching nUSDBalance:', error);
    }
  }
  async function handleDeposit() {
    if (!isConnected || !depositAmount) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("provider",provider);
      const signer = provider.getSigner();
      console.log("signer",signer);
      const contract = new ethers.Contract(contractAddress,  contractABI, signer);
      console.log("contract",contract);
      await contract.deposit({ value: ethers.utils.parseEther(depositAmount) });
      setDepositAmount('');
    } catch (error) {
      console.error('Error depositing:', error);
    }
  }

  async function handleRedeem() {
    if (!isConnected) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress,  contractABI, signer);
      console.log("contract",contract);
      await contract.redeem(redeemAmount);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="App">
      <h1>MetaMask App</h1>
      {isConnected ? (
        <>
          <p>Connected with MetaMask!</p>
          <p>Account: {account}</p>
          <p>Balance: {balance} ETH</p>
          <button onClick={fetchBalance}>Refresh Balance</button>

          <div>
          <p>
            nUSD Balance: {nUSDBalance}
          </p>
          <button onClick={fetchnUSDBalance}>Fetch nUSDBalance</button>
          </div>
          <div style={{marginTop: `20px`}}>
            <input
              type="text"
              placeholder="Enter deposit amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button onClick={handleDeposit}>Deposit</button>
          </div>

          <div style={{marginTop: `20px`}}>
          <input
              type="text"
              placeholder="Enter Redeem amount"
              value={redeemAmount}
              onChange={(e) => setredeemAmount(e.target.value)}
            />
            <button onClick={handleRedeem}>Redeem</button>
          </div>
        </>
      ) : (
        <>
          <p>Connect with MetaMask to see your account balance</p>
          <button onClick={checkMetaMaskConnection}>Connect to MetaMask</button>
        </>
      )}
    </div>
  );
}

export default App;
