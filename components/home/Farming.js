import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Divider } from 'semantic-ui-react';
import Spinner from '../Spinner';
import ButtonAffiliates from '../button/ButtonAffiliates';
import Global from '../Constants';
import Transactions from '../../common/Transactions';
import MetaTx from '../../common/MetaTx';
import ContentFarming from '../content/ContentFarming';
import Whitelist from '../Whitelist';
import { useRouter } from 'next/router';
import ABI_DG_STAKING from '../../components/ABI/ABIDGStaking';
import ABI_BP from '../../components/ABI/ABIBalancerPoolToken';


const Farming = () => {
  const router = useRouter();
  // dispatch user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [DGstate, setDGState] = useState('token');
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState({});

  const [keeperContract, setKeeperContract] = useState({});
  const [pointerContract, setPointerContract] = useState({});
  const [stakingContract, setStakingContract] = useState({});
  const [BPTContract, setBPTContract] = useState({});

  const [stakingContractTwo, setStakingContractTwo] = useState({});
  const [BPTContractTwo, setBPTContractTwo] = useState({});

  const [instances, setInstances] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [web3, setWeb3] = useState({});
  // const [disabled, setDisabled] = useState(false);

  const whitelisted = Whitelist();

  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsLoading(false);
      const urlParam = window.location.href.split('?=')[1];
      if (urlParam === undefined) {
        router.push('?=token');
        setDGState('token');
      } else if (
        urlParam === 'mining' ||
        urlParam === 'liquidity' ||
        urlParam === 'governance' ||
        urlParam === 'admin'
      ) {
        router.push(`?=${urlParam}`);
        setDGState(urlParam);
      } else {
        router.push('?=token');
        setDGState('token');
      }
    }
  }, []);

  useEffect(() => {
    if (state.userStatus) {
      (async () => {
        const addresses = await Global.API_ADDRESSES;
        setAddresses(addresses);
      })();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.userStatus) {
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
        const stakingContractTwo = new web3.eth.Contract(
          ABI_DG_STAKING,
          addresses.DG_STAKING_CONTRACT_ADDRESS_2
        );
        setStakingContractTwo(stakingContractTwo);

        const BPTContractTwo = new web3.eth.Contract(
          ABI_BP,
          addresses.BP_TOKEN_ADDRESS_2
        );
        setBPTContractTwo(BPTContractTwo); 
   
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
        console.log('here here here...');

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
    console.log('Return reward period finish time');

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

        const arrayNew = state.DGBalances.slice();
        arrayNew[0] = 0;

        // update global state unclaimed DG balance to 0
        dispatch({
          type: 'dg_balances',
          data: arrayNew,
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
    const amountToString = amountAdjusted.toString();
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
    const amountToString = amountAdjusted.toString();
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
    const amountToString = amountAdjusted.toString();
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
    const amountToString = amountAdjusted.toString();
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

      console.log('getReward_2() transaction completed: ' + data.transactionHash);

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
            {DGstate === 'token' ? (
              <b className="account-hover active">TOKEN</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => {
                  setDGState('token');
                  router.push('?=token');
                }}
              >
                TOKEN
              </abbr>
            )}

            {DGstate === 'mining' ? (
              <b className="account-hover active">GAMEPLAY MINING</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => {
                  setDGState('mining');
                  router.push('?=mining');
                }}
              >
                GAMEPLAY MINING
              </abbr>
            )}

            {DGstate === 'liquidity' ? (
              <b className="account-hover active">LIQUIDITY FARMING</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => {
                  setDGState('liquidity');
                  router.push('?=liquidity');
                }}
              >
                LIQUIDITY FARMING
              </abbr>
            )}

            {DGstate === 'governance' ? (
              <b className="account-hover active">GOVERNANCE</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => {
                  setDGState('governance');
                  router.push('?=governance');
                }}
              >
                GOVERNANCE
              </abbr>
            )}

            {whitelisted ? (
              DGstate === 'admin' ? (
                <b className="account-hover active">ADMIN</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => {
                    setDGState('admin');
                    router.push('?=admin');
                  }}
                >
                  ADMIN
                </abbr>
              )
            ) : null}
          </p>

          <ButtonAffiliates />
        </span>

        <span className="dg-tabs-mobile">
          <p className="account-other-p">
            {DGstate === 'token' ? (
              <b className="account-hover active">TOKEN</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => {
                  setDGState('token');
                  router.push('?=token');
                }}
              >
                TOKEN
              </abbr>
            )}

            {DGstate === 'mining' ? (
              <b className="account-hover active">GAMEPLAY</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => {
                  setDGState('mining');
                  router.push('?=mining');
                }}
              >
                GAMEPLAY
              </abbr>
            )}

            {DGstate === 'liquidity' ? (
              <b className="account-hover active">LIQUIDITY</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => {
                  setDGState('liquidity');
                  router.push('?=liquidity');
                }}
              >
                LIQUIDITY
              </abbr>
            )}

            {DGstate === 'governance' ? (
              <b className="account-hover active">GOV</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => {
                  setDGState('governance');
                  router.push('?=governance');
                }}
              >
                GOV
              </abbr>
            )}
          </p>

          <ButtonAffiliates />
        </span>
      </div>
    );
  }

  return (
    <div className="main-container">
      {isLoading ? (
        <Spinner background={3} />
      ) : (
        <div className="page-container">
          <div className="account-other-inner-container ">
            {submenu()}

            <Divider
              className="tab-divider"
              style={{ marginTop: '18px', paddingBottom: '21px' }}
            />

            <ContentFarming
              content={DGstate}
              metaTransaction={metaTransaction}
              staking={staking}
              staking_2={staking_2}
              withdraw={withdraw}
              withdraw_2={withdraw_2}
              getReward={getReward}
              getReward_2={getReward_2}
              getPeriodFinish={getPeriodFinish}
              stakingContract={stakingContract}
              stakingContractTwo={stakingContractTwo}
              scrapeMyTokens={scrapeMyTokens}
              // disabled={disabled}
              instances={instances}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Farming;
