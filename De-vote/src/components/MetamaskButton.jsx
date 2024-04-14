import { useEffect, useState, useContext } from "react";
import configuration from "../contracts/MultiPostVoting.json"
import { Web3 } from "web3";
import creatElection from "../utils/CreateElection";
import addPostWithCandidates from "../utils/addPostWithCandidates";
import getVoteCounts from '../utils/getVoteCounts'
import { ContractContext } from '../context/electionContext'

function MetamaskButton() {
  const [contract, setContract] = useState(null);
  const { updateContract, updateAccount } = useContext(ContractContext);

  async function init(web3) {
    try {
      // console.log(Web3.givenProvider)
      // const web3 = new Web3(Web3.givenProvider);
      const networkID = await web3.eth.net.getId();
      console.log(networkID)
      const contractAddress = configuration.networks[networkID].address;
      console.log(contract)
      const contractABI = configuration.abi;

      const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
      updateContract(contractInstance);
      setContract(contractInstance);
      console.log("Contract initialized:", contractInstance);

      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    } catch (error) {
      console.error("Error initializing contract:", error);
    }
  }

  // useEffect(() => {
  //   init();
  //   return () => {
  //     // Cleanup event listener
  //     window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  //   };
  // }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      updateAccount(account);
      console.log("Account changed:", account);
    }
  }

  const onConnect = async () => {
    try {
      let provider = window.ethereum;
      if (typeof provider !== "undefined") {
        await provider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);

        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        updateAccount(account);
        console.log("Connected account:", account);
        alert("connected to metamask")
        init(web3)
        
      } else {
        console.log("Non-ethereum browser detected. Please install Metamask.");
      }
    } catch (error) {
      console.error("Error connecting to Metamask:", error);
    }
  };

  return (
    <div className="bg-blue-500 h-8 w-[180px] flex mt-6 rounded-lg text-white font-bold text-sm hover:bg-blue-700 cursor-pointer">
      <button onClick={onConnect} className="m-auto">
        Connect To Metamask
      </button>
    </div>
  );
}

export default MetamaskButton;