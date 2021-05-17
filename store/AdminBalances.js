import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_CHILD_TOKEN_MANA from '../components/ABI/ABIChildTokenMANA';
import ABI_CHILD_TOKEN_DAI from '../components/ABI/ABIChildTokenDAI';
import ABI_CHILD_TOKEN_USDT from '../components/ABI/ABIChildTokenUSDT';
import ABI_CHILD_TOKEN_ATRI from '../components/ABI/ABIChildTokenATRI';
import ABI_CHILD_TOKEN_WETH from '../components/ABI/ABIChildTokenWETH';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';

function AdminBalances() {
  // dispatch worker ETH and treasury balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [maticWeb3, setMaticWeb3] = useState({});
  const [parentContract, setParentContract] = useState({});
  const [tokenContractMANA, setTokenContractMANA] = useState({});
  const [tokenContractDAI, setTokenContractDAI] = useState({});
  const [tokenContractUSDT, setTokenContractUSDT] = useState({});
  const [tokenContractATRI, setTokenContractATRI] = useState({});
  const [tokenContractWETH, setTokenContractWETH] = useState({});
  const [instances, setInstances] = useState(false);

  // let web3;
  // let maticWeb3 = {};
  let balanceTokens = [];
  let arrayAmounts = state.adminBalances;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  // useEffect(() => {
  //   if (state.userStatus === 28) {
  //     maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor
  //   }
  // }, [state.userStatus]);

  useEffect(() => {
    if (state.userStatus === 28) {
      // web3 = new Web3(state.walletProvider); // pass MetaMask provider to Web3 constructor

      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor
      setMaticWeb3(maticWeb3);

      async function fetchData() {
        // maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

        const parentContract = await Transactions.treasuryContract(maticWeb3);
        setParentContract(parentContract);

        const tokenContractMANA = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_MANA,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA
        );
        setTokenContractMANA(tokenContractMANA);

        const tokenContractDAI = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_DAI,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI
        );
        setTokenContractDAI(tokenContractDAI);

        const tokenContractUSDT = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_USDT,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT
        );
        setTokenContractUSDT(tokenContractUSDT);

        const tokenContractATRI = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_ATRI,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ATRI
        );
        setTokenContractATRI(tokenContractATRI);

        const tokenContractWETH = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_WETH,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH
        );
        setTokenContractWETH(tokenContractWETH);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (instances) {
      // web3 = new Web3(state.walletProvider); // pass provider to Web3 constructor
      // maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        const balanceETH = await getEthBalance();
        balanceTokens = await getTokenBalances();

        // update global state ETH balance and treasury token balances
        dispatch({
          type: 'eth_balance',
          data: balanceETH,
        });

        dispatch({
          type: 'admin_balances',
          data: balanceTokens,
        });

        // if deposit or withdrawal start pinging the token contract for changed balances
        // if (state.tokenPings === 2) dataInterval();
      }

      fetchData();
    }
  }, [instances, state.tokenPings]);

  // function dataInterval() {
  //   async function fetchData() {
  //     const response = await getTokenBalances();

  //     // as soon as the balance updates on Matic display confirmation & stop pings
  //     if (
  //       response[0][1] !== balanceTokens[0][1] ||
  //       response[1][1] !== balanceTokens[1][1]
  //     ) {
  //       if (
  //         response[0][1] > balanceTokens[0][1] ||
  //         response[1][1] > balanceTokens[1][1]
  //       ) {
  //         console.log('Matic balances have updated: deposit');

  //         dispatch({
  //           type: 'token_pings',
  //           data: 3,
  //         });

  //         clearInterval(interval);
  //       } else if (
  //         response[0][1] < balanceTokens[0][1] ||
  //         response[1][1] < balanceTokens[1][1]
  //       ) {
  //         console.log('Matic balances have updated: withdrawal');

  //         dispatch({
  //           type: 'token_pings',
  //           data: 4,
  //         });

  //         clearInterval(interval);
  //       }
  //     }
  //   }

  //   // call token contract every 3 seconds to get new balances
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get total funds and individual game amounts

  // get Worker address ETH balance on Matic Network
  async function getEthBalance() {
    // console.log('Worker address ETH balance on Matic Network');
    // web3 = new Web3(state.walletProvider); // pass provider to Web3 constructor

    try {
      const amount = await maticWeb3.eth.getBalance(
        Global.ADDRESSES.WORKER_WALLET_ADDRESS
      );

      // const amountEth = web3.fromWei(amount, 'ether') + ' ETH';
      const amountEth = amount / Global.CONSTANTS.FACTOR;
      const amountNumber = parseFloat(amountEth).toFixed(4);

      return amountNumber;
    } catch (error) {
      console.log('Get ETH balance error', error);
    }
  }

  async function getTokenBalances() {
    try {
      // get Worker address ETH balance on Matic Network
      // const amount = await maticWeb3.eth.getBalance(
      //   Global.ADDRESSES.WORKER_WALLET_ADDRESS
      // );
      // const amountEth = web3.utils.fromWei(amount, 'ether') + ' ETH';
      // const amountNumber = parseFloat(amountEth).toFixed(4);

      // get treasury balances from token contracts
      arrayAmounts.treasury = await getTokensTreasury();

      // get game balances by calling checkGameTokens() on smart contract
      const gameTypes = [1, 8, 7]; // slots, roulette, blackjack

      await gameTypes.forEach(async (gameType, i) => {
        const amount1 = await getTokensGame(gameType, 0);
        const amount2 = await getTokensGame(gameType, 1);
        const amount3 = await getTokensGame(gameType, 2);
        const amount4 = await getTokensGame(gameType, 3);
        const amount5 = await getTokensGame(gameType, 4);

        arrayAmounts[Object.keys(state.adminBalances)[i + 1]] = [
          amount1,
          amount2,
          amount3,
          amount4,
          amount5,
          0,
        ];
      });

      return arrayAmounts;
    } catch (error) {
      console.log('Get admin balances error: ' + error);
    }
  }

  async function getTokensTreasury() {
    const amountTreasuryMANA = await Transactions.balanceOfToken(
      tokenContractMANA,
      Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS,
      3
    );

    const amountTreasuryDAI = await Transactions.balanceOfToken(
      tokenContractDAI,
      Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS,
      3
    );

    const amountTreasuryUSDT = await Transactions.balanceOfToken(
      tokenContractUSDT,
      Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS,
      3
    );

    const amountTreasuryATRI = await Transactions.balanceOfToken(
      tokenContractATRI,
      Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS,
      3
    );

    const amountTreasuryWETH = await Transactions.balanceOfToken(
      tokenContractWETH,
      Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS,
      3
    );

    return (arrayAmounts.treasury = [
      amountTreasuryMANA,
      amountTreasuryDAI,
      amountTreasuryUSDT,
      amountTreasuryATRI,
      amountTreasuryWETH,
    ]);
  }

  async function getTokensGame(gameIndex, tokenIndex) {
    // const parentContract = await Transactions.treasuryContract(maticWeb3);

    try {
      const amount = await parentContract.methods
        .checkGameTokens(gameIndex, tokenIndex)
        .call();

      const amountAdjusted = (amount / Global.CONSTANTS.FACTOR)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      return amountAdjusted;
    } catch (error) {
      console.log('Get tokens per game failed', error);
    }
  }

  return null;
}

export default AdminBalances;
