import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import Link from 'next/link';
import { Menu, Divider } from 'semantic-ui-react';
import ButtonAffiliates from '../button/ButtonAffiliates';
import Global from '../Constants';
import Transactions from '../../common/Transactions';
import MetaTx from '../../common/MetaTx';
import ContentFarming from '../content/ContentFarming';

const Farming = (props) => {
  // dispatch user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [DGState, setDGState] = useState(props.DGState);
  // const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState({});

  const [keeperContract, setKeeperContract] = useState({});
  const [pointerContract, setPointerContract] = useState({});
  const [stakingContract, setStakingContract] = useState({});
  const [BPTContract, setBPTContract] = useState({});

  const [stakingContractTwo, setStakingContractTwo] = useState({});
  const [BPTContractTwo, setBPTContractTwo] = useState({});

  const [stakingContractGov, setStakingContractGov] = useState({});
  const [DGContract, setDGContract] = useState({});

  const [instances, setInstances] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [web3, setWeb3] = useState({});

  useEffect(() => {
    if (state.userStatus >= 4) {
      (async () => {
        const addresses = await Global.ADDRESSES;
        setAddresses(addresses);
      })();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.userStatus >= 4) {
      const userAddress = window.web3.currentProvider.selectedAddress;
      setUserAddress(userAddress);

      // initialize Web3 providers and create contract instances
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      async function fetchData() {
        // mining contract
        const pointerContract = await Transactions.pointerContract(getWeb3);
        setPointerContract(pointerContract);

        // POOL 1
        const stakingContract = await Transactions.stakingContract(web3);
        setStakingContract(stakingContract);

        const BPTContract = await Transactions.BPTContract(web3);
        setBPTContract(BPTContract);

        // POOL 2
        const stakingContractTwo = await Transactions.stakingContractTwo(web3);
        setStakingContractTwo(stakingContractTwo);

        const BPTContractTwo = await Transactions.BPTContractTwo(web3);
        setBPTContractTwo(BPTContractTwo);

        // GOV
        const stakingContractGov = await Transactions.stakingContractGov(web3);
        setStakingContractGov(stakingContractGov);

        const DGContract = await Transactions.tokenContract(web3);
        setDGContract(DGContract);

        // vesting contract for airdrops ect
        const keeperContract = await Transactions.keeperContract(web3);
        setKeeperContract(keeperContract);

        setInstances(true); // contract instantiation complete
      }
      fetchData();

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Active Status');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  // get timestamp on page load
  useEffect(() => {
    if (instances) {
      (async () => {
        // console.log('here here here...');

        const timestamp = await getPeriodFinish();

        // dispatch timestamp to the Context API store
        dispatch({
          type: 'stake_time',
          data: timestamp,
        });
      })();
    }
  }, [instances]);

  async function getPeriodFinish() {
    // console.log('Return reward period finish time');

    try {
      const timestamp = await stakingContract.methods.periodFinish().call();

      return timestamp;
    } catch (error) {
      console.log('Return reward period time error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // Biconomy API meta-transaction. Dispatch DG tokens to player
  async function metaTransaction() {
    try {
      console.log('Dispatching DG tokens to address: ' + userAddress);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = pointerContract.methods.getMyTokens().encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        2,
        functionSignature,
        pointerContract,
        userAddress,
        web3
      );

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        // const arrayNew = state.DGBalances.slice();
        // arrayNew[0] = 0;

        // // update global state unclaimed DG balance to 0
        // dispatch({
        //   type: 'dg_balances',
        //   data: arrayNew,
        // });

        // update global state BPT balances
        const refresh = !state.refreshBalances;

        dispatch({
          type: 'refresh_balances',
          data: refresh,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // stake, withdraw, get reward from pool 1
  async function staking(amount) {
    const amountAdjusted = amount * Global.CONSTANTS.FACTOR;
    const amountToString = web3.utils.toWei(amount);
    console.log('Staking amount input: ' + amountToString);

    try {
      console.log(
        'Get amount user has authorized our staking contract to spend'
      );

      const amountAllowance = await BPTContract.methods
        .allowance(userAddress, addresses.DG_STAKING_CONTRACT_ADDRESS)
        .call();

      console.log('Authorized amount: ' + amountAllowance);

      if (Number(amountAllowance) < amountAdjusted) {
        console.log("Approve staking contract to spend user's tokens");

        const data = await BPTContract.methods
          .approve(
            addresses.DG_STAKING_CONTRACT_ADDRESS,
            Global.CONSTANTS.MAX_AMOUNT
          )
          .send({ from: userAddress });

        console.log('approve() transaction confirmed: ' + data.transactionHash);
      }

      console.log('Call stake() function on smart contract');

      const data = await stakingContract.methods
        .stake(amountToString)
        .send({ from: userAddress });

      console.log('stake() transaction completed: ' + data.transactionHash);

      // update global state BPT balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Staking transactions error: ' + error);
    }
  }

  async function withdraw(amount) {
    console.log('Call withdraw() function to unstake BP tokens');

    const amountAdjusted = amount * Global.CONSTANTS.FACTOR;
    const amountToString = web3.utils.toWei(amount);
    console.log('Withdraw amount input: ' + amountToString);

    try {
      const data = await stakingContract.methods
        .withdraw(amountToString)
        .send({ from: userAddress });

      console.log('withdraw() transaction completed: ' + data.transactionHash);

      // update global state BPT balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Unstake BP tokens error: ' + error);
    }
  }

  async function getReward() {
    console.log('Call getReward() function to claim DG tokens');

    try {
      const data = await stakingContract.methods
        .getReward()
        .send({ from: userAddress });

      console.log('getReward() transaction completed: ' + data.transactionHash);

      // update global state unclaimed DG balance
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('getReward() transaction error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // stake, withdraw, get reward from pool 2
  async function staking_2(amount) {
    const amountAdjusted = amount * Global.CONSTANTS.FACTOR;
    const amountToString = web3.utils.toWei(amount);
    console.log('Staking amount input: ' + amountToString);

    try {
      console.log(
        'Get amount user has authorized our staking contract to spend'
      );

      const amountAllowance = await BPTContractTwo.methods
        .allowance(userAddress, addresses.DG_STAKING_CONTRACT_ADDRESS_2)
        .call();

      console.log('Authorized amount: ' + amountAllowance);

      if (Number(amountAllowance) < amountAdjusted) {
        console.log("Approve staking contract to spend user's tokens");

        const data = await BPTContractTwo.methods
          .approve(
            addresses.DG_STAKING_CONTRACT_ADDRESS_2,
            Global.CONSTANTS.MAX_AMOUNT
          )
          .send({ from: userAddress });

        console.log('approve() transaction confirmed: ' + data.transactionHash);
      }

      console.log('Call stake() function on smart contract');

      const data = await stakingContractTwo.methods
        .stake(amountToString)
        .send({ from: userAddress });

      console.log('stake() transaction completed: ' + data.transactionHash);

      // update global state BPT balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Staking transactions error: ' + error);
    }
  }

  async function withdraw_2(amount) {
    console.log('Call withdraw() function to unstake BP tokens');

    const amountAdjusted = amount * Global.CONSTANTS.FACTOR;
    const amountToString = web3.utils.toWei(amount);
    console.log('Withdraw amount input: ' + amountToString);

    try {
      const data = await stakingContractTwo.methods
        .withdraw(amountToString)
        .send({ from: userAddress });

      console.log('withdraw() transaction completed: ' + data.transactionHash);

      // update global state BPT balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Unstake BP tokens error: ' + error);
    }
  }

  async function getReward_2() {
    console.log('Call getReward_2() function to claim DG tokens');

    try {
      const data = await stakingContractTwo.methods
        .getReward()
        .send({ from: userAddress });

      console.log(
        'getReward_2() transaction completed: ' + data.transactionHash
      );

      // update global state unclaimed DG balance
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('getReward_2() transaction error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // stake, withdraw, get reward from pool 2
  async function staking_gov(amount) {
    const amountAdjusted = amount * Global.CONSTANTS.FACTOR;
    const amountToString = web3.utils.toWei(amount);
    console.log('Gov staking amount input: ' + amountToString);

    try {
      console.log(
        'Get amount user has authorized our gov staking contract to spend'
      );

      const amountAllowance = await DGContract.methods
        .allowance(userAddress, addresses.DG_STAKING_GOVERNANCE)
        .call();

      console.log('Authorized amount: ' + amountAllowance);

      if (Number(amountAllowance) < amountAdjusted) {
        console.log("Approve goov staking contract to spend user's tokens");

        const data = await DGContract.methods
          .approve(addresses.DG_STAKING_GOVERNANCE, Global.CONSTANTS.MAX_AMOUNT)
          .send({ from: userAddress });

        console.log('approve() transaction confirmed: ' + data.transactionHash);
      }

      console.log('Call stake() function on smart contract');

      const data = await stakingContractGov.methods
        .stake(amountToString)
        .send({ from: userAddress });

      console.log('stake() transaction completed: ' + data.transactionHash);

      // update global state BPT balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Staking transactions error: ' + error);
    }
  }

  async function withdraw_gov(amount) {
    console.log('Call withdraw() function to unstake BP tokens');

    const amountAdjusted = amount * Global.CONSTANTS.FACTOR;
    const amountToString = web3.utils.toWei(amount);
    console.log('Withdraw amount input: ' + amountToString);

    try {
      const data = await stakingContractGov.methods
        .withdraw(amountToString)
        .send({ from: userAddress });

      console.log('withdraw() transaction completed: ' + data.transactionHash);

      // update global state BPT balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Unstake BP tokens error: ' + error);
    }
  }

  async function getReward_gov() {
    console.log('Call getReward_gov() function to claim DG tokens');

    try {
      const data = await stakingContractGov.methods
        .getReward()
        .send({ from: userAddress });

      console.log(
        'getReward_gov() transaction completed: ' + data.transactionHash
      );

      // update global state unclaimed DG balance
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('getReward_gov() transaction error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // claim DG tokens from keeper contract
  async function scrapeMyTokens() {
    console.log('Call scrapeMyTokens() function to claim DG tokens');
    // setDisabled(true);

    try {
      const data = await keeperContract.methods
        .scrapeMyTokens()
        .send({ from: userAddress });

      // setDisabled(false);

      console.log(
        'scrapeMyTokens() transaction completed: ' + data.transactionHash
      );

      // update global state unclaimed DG balance
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      // setDisabled(false);

      console.log('scrapeMyTokens() transaction error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function submenu() {
    return (
      <div className="account-other-tabs">
        <span className="dg-tabs-desktop">
          <p className="account-other-p">
            {DGState === 'governance' ? (
              <b className="account-hover active">GOVERNANCE</b>
            ) : (
              <Link href="/dg">
                <Menu.Item className="account-hover">GOVERNANCE</Menu.Item>
              </Link>
            )}

            {DGState === 'mining' ? (
              <b className="account-hover active">GAMEPLAY MINING</b>
            ) : (
              <Link href="/dg/mining">
                <Menu.Item className="account-hover">GAMEPLAY MINING</Menu.Item>
              </Link>
            )}

            {DGState === 'liquidity' ? (
              <b className="account-hover active">LIQUIDITY FARMING</b>
            ) : (
              <Link href="/dg/liquidity">
                <Menu.Item className="account-hover">
                  LIQUIDITY FARMING
                </Menu.Item>
              </Link>
            )}

            {DGState === 'token' ? (
              <b className="account-hover active">AIRDROP</b>
            ) : (
              <Link href="/dg/airdrop">
                <Menu.Item className="account-hover">AIRDROP</Menu.Item>
              </Link>
            )}

            {state.whitelisted ? (
              DGState === 'admin' ? (
                <b className="account-hover active">ADMIN</b>
              ) : (
                <Link href="/dg/admin">
                  <Menu.Item className="account-hover">ADMIN</Menu.Item>
                </Link>
              )
            ) : null}
          </p>

          <ButtonAffiliates />
        </span>

        <span className="dg-tabs-mobile">
          <p className="account-other-p">
            {DGState === 'governance' ? (
              <b className="account-hover active">GOV</b>
            ) : (
              <Link href="/dg/">
                <Menu.Item className="account-hover">GOV</Menu.Item>
              </Link>
            )}

            {DGState === 'mining' ? (
              <b className="account-hover active">GAMEPLAY</b>
            ) : (
              <Link href="/dg/mining">
                <Menu.Item className="account-hover">GAMEPLAY</Menu.Item>
              </Link>
            )}

            {DGState === 'liquidity' ? (
              <b className="account-hover active">LIQUIDITY</b>
            ) : (
              <Link href="/dg/liquidity">
                <Menu.Item className="account-hover">LIQUIDITY</Menu.Item>
              </Link>
            )}

            {DGState === 'token' ? (
              <b className="account-hover active">AIRDROP</b>
            ) : (
              <Link href="/dg/airdrop">
                <Menu.Item className="account-hover">AIRDROP</Menu.Item>
              </Link>
            )}
          </p>

          <ButtonAffiliates />
        </span>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="page-container">
        <div className="account-other-inner-container ">
          {submenu()}

          <Divider
            className="tab-divider"
            style={{ marginTop: '18px', paddingBottom: '21px' }}
          />

          <ContentFarming
            content={DGState}
            metaTransaction={metaTransaction}
            staking={staking}
            staking_2={staking_2}
            staking_gov={staking_gov}
            withdraw={withdraw}
            withdraw_2={withdraw_2}
            withdraw_gov={withdraw_gov}
            getReward={getReward}
            getReward_2={getReward_2}
            getReward_gov={getReward_gov}
            getPeriodFinish={getPeriodFinish}
            stakingContract={stakingContract}
            stakingContractTwo={stakingContractTwo}
            stakingContractGov={stakingContractGov}
            scrapeMyTokens={scrapeMyTokens}
            instances={instances}
          />
        </div>
      </div>
    </div>
  );
};

export default Farming;
