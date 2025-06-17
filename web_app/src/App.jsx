import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import LendingProtocolABI from './LendingProtocolABI.json';
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('isomorphic-webcrypto')
}
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

function App() {
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [data, setData] = useState({ collateral: 0, debt: 0, interest: 0 });

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setAccount(await signer.getAddress());

    const c = new ethers.Contract(contractAddress, LendingProtocolABI, signer);
    setContract(c);
  };

  const loadUserData = async () => {
    const [col, debt, intt] = await contract.getUserData(account);
    setData({
      collateral: ethers.utils.formatUnits(col, 18),
      debt: ethers.utils.formatUnits(debt, 18),
      interest: ethers.utils.formatUnits(intt, 18)
    });
  };

  const deposit = async () => {
    const amount = ethers.utils.parseUnits("100", 18);
    await contract.depositCollateral(amount);
    loadUserData();
  };

  const borrow = async () => {
    const amount = ethers.utils.parseUnits("66", 18);
    await contract.borrow(amount);
    loadUserData();
  };

  const repay = async () => {
    await contract.repay();
    loadUserData();
  };

  const withdraw = async () => {
    await contract.withdrawCollateral();
    loadUserData();
  };
const approveCollateral = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const tokenAbi = [
    "function approve(address spender, uint256 amount) public returns (bool)"
  ];

  const token = new ethers.Contract("0x9Aacc8E04fDc95fACf1A66c6dBFAc79db244465F", tokenAbi, signer);

  const amount = ethers.utils.parseUnits("100", 18);
  try {
    await token.approve("0xAA0D30cd42BA39e2F7E6666A126e583bAd36582E", amount);
    alert("Aprobación completada");
  } catch (error) {
    console.error("Error al aprobar colateral:", error);
  }
};
const checkBalance = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const user = await signer.getAddress();

  const tokenAbi = ["function balanceOf(address) view returns (uint256)"];
  const token = new ethers.Contract("0x9Aacc8E04fDc95fACf1A66c6dBFAc79db244465F", tokenAbi, signer);

  const balance = await token.balanceOf(user);
  console.log("Balance cUSD:", ethers.utils.formatUnits(balance, 18));
};
const checkAllowance = async () => {
  const tokenAbi = ["function allowance(address owner, address spender) view returns (uint256)"];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const user = await signer.getAddress();

  const token = new ethers.Contract("0x9Aacc8E04fDc95fACf1A66c6dBFAc79db244465F", tokenAbi, signer);

  const allowance = await token.allowance(user, "0xAA0D30cd42BA39e2F7E6666A126e583bAd36582E");
  console.log("Allowance cUSD:", ethers.utils.formatUnits(allowance, 18));
};

  useEffect(() => {
    if (contract) loadUserData();
  }, [contract]);

  return (
    <div>
      <h1>DApp de Préstamos</h1>
      <button onClick={connectWallet}>Conectar Wallet</button>
      <p>Cuenta: {account}</p>
      <p>Colateral: {data.collateral}</p>
      <p>Deuda: {data.debt}</p>
      <p>Interés: {data.interest}</p>
      <button onClick={deposit}>Depositar</button>
      <button onClick={borrow}>Pedir Préstamo</button>
      <button onClick={repay}>Pagar</button>
      <button onClick={withdraw}>Retirar Colateral</button>
      <button onClick={approveCollateral}>Aprobar Colateral</button>
      <button onClick={checkBalance}>Ver Balance</button>
      <button onClick={checkAllowance}>Ver Allowance</button>
    </div>
  );
}

export default App;
