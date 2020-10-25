import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import { Button, Divider, Input } from 'semantic-ui-react';
import Web3 from 'web3';
import Aux from '../_Aux';
import Images from '../../common/Images';
import ButtonReward from '../button/ButtonReward';
import Global from '../Constants';
import Transactions from '../../common/Transactions';

const ContentFarming = (props) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [stakingContract, setStakingContract] = useState({});
  const [poolSelect, setPoolSelect] = useState(1);
  const [currenReward, setCurrentReward] = useState(0);
  const [finishTime, setFinishTime] = useState(0);
  const [amountInput, setAmountInput] = useState(0);

  // const [stakedTotal, setStakedTotal] = useState({});

  const [percentagePool1, setPercentagePool1] = useState(0);
  const [instances, setInstances] = useState(false);

  const rewardAmount = '10000000000000000000'; // hard-coded reward amount

  useEffect(() => {
    if (state.userStatus) {
      // const userAddress = window.web3.currentProvider.selectedAddress.toUpperCase();
      // setUserAddress(userAddress);

      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        // const addresses = await Global.API_ADDRESSES;

        // const workerAddress = addresses.WORKER_ADDRESS.toUpperCase();
        // if (userAddress === workerAddress) setDisabled(false);

        const stakingContract = await Transactions.stakingContract(web3);
        setStakingContract(stakingContract);

        setInstances(true); // contract instantiation complete
      }
      fetchData();
    }
  }, [state.userStatus]);

  // get initial reward and timestamp values
  useEffect(() => {
    if (instances) {
      // (async () => {
      // const timestamp = await getPeriodFinish();

      const rewardAdjusted = rewardAmount / Global.CONSTANTS.FACTOR;
      rewardData(rewardAdjusted);
      // })();
    }
  }, [instances]);

  useEffect(() => {
    if (instances) {
      (async () => {
        const addresses = await Global.API_ADDRESSES;

        // const stakedTotal = stakingContract.balanceOf(
        //   addresses.DG_STAKING_ADDRESS
        // );
        const stakedTotal = await Transactions.balanceOfToken(
          stakingContract,
          addresses.DG_STAKING_ADDRESS,
          3
        );

        console.log('staked balance: ' + state.staking[1]);
        console.log('total staked: ' + stakedTotal);

        // parseFloat(stakedTotal)
        const stakedTotalNum = parseFloat(stakedTotal);

        if (state.staking[1] !== 0 && stakedTotalNum !== 0) {
          const percentagePool1 = state.staking[1] / stakedTotal;
          setPercentagePool1(percentagePool1);
        } else {
          setPercentagePool1(0);
        }

        console.log('pool 1 percentage: ' + percentagePool1);

        // setStakedTotal(stakedTotal);
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

  var onPool;
  if (poolSelect === 1) {
    onPool = () => setPoolSelect(2);
  } else {
    onPool = () => setPoolSelect(1);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentMining() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Gameplay Mining</h3>
              <p>
                You can mine $DG by playing games with $MANA or $DAI. Earn
                multipliers by playing with friends or wearing Decentral Games
                NFTs. Refer any friends and get an additional 20% of all $DG
                they mine. For more details, see our
                <a
                  href="https://decentral-games-1.gitbook.io/dg/allocation"
                  target="_blank"
                  style={{ color: '#2085f4' }}
                >
                  {' '}
                  docs
                </a>
                .
              </p>
            </span>
          </div>
        </div>

        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed">
            <span style={{ display: 'flex' }}>
              <img src={Images.DG_COIN_LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed</p>
                <p className="account-name">{state.DGBalances[0]}</p>
              </span>
            </span>

            <Divider />

            <span className="DG-button-span">
              {Number(state.DGBalances[0]) ? (
                <Button
                  className="DG-claim-button"
                  onClick={() => props.metaTransaction()}
                >
                  CLAIM $DG
                </Button>
              ) : (
                <Button disabled className="DG-claim-button">
                  CLAIM $DG
                </Button>
              )}
            </span>
          </div>

          <span className="DG-tablet-container">
            <div className="DG-column one">
              <span style={{ display: 'flex' }}>
                <img src={Images.MANA_CIRCLE} className="farming-logo" />
                <span className="farming-pool-span">
                  <p className="welcome-text"> Coin </p>
                  <p className="account-name">MANA</p>
                </span>
              </span>

              <Divider />

              <div style={{ display: 'flex' }}>
                <span className="gameplay-left-column">
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text"> Total Bet </p>
                    <p className="earned-amount"> ... </p>
                  </span>
                </span>

                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '50%',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text"> Mining Rate </p>
                    <p className="earned-amount"> ... </p>
                  </span>
                </span>
              </div>

              <Divider />

              <span className="DG-button-span">
                <Button
                  href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
                  className="DG-play-now-button"
                >
                  PLAY NOW
                </Button>
              </span>
            </div>

            <div className="DG-column two">
              <span style={{ display: 'flex' }}>
                <img src={Images.DAI_CIRCLE} className="farming-logo" />
                <span className="farming-pool-span">
                  <p className="welcome-text"> Coin </p>
                  <p className="account-name">DAI</p>
                </span>
              </span>

              <Divider />

              <div style={{ display: 'flex' }}>
                <span className="gameplay-left-column">
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text"> Total Bet </p>
                    <p className="earned-amount"> ... </p>
                  </span>
                </span>

                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '50%',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text"> Mining Rate </p>
                    <p className="earned-amount"> ... </p>
                  </span>
                </span>
              </div>

              <Divider />

              <span className="DG-button-span">
                <Button
                  href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
                  className="DG-play-now-button"
                >
                  PLAY NOW
                </Button>
              </span>
            </div>
          </span>
        </div>
      </Aux>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentLiquidity() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Liquidity Farming</h3>
              <p>
                You can farm $DG by providing liquidity in 98/2 MANA/DG and
                DAI/DG Balancer pools and staking the LP tokens on this
                dashboard. Read more about $DG liquidity farming rewards in our
                <a
                  href="https://decentral-games-1.gitbook.io/dg/governance-1"
                  style={{ color: '#2085f4' }}
                >
                  {' '}
                  docs
                </a>
                .
              </p>
            </span>
          </div>
        </div>

        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed">
            <span style={{ display: 'flex' }}>
              <img src={Images.DG_COIN_LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                {poolSelect === 1 ? (
                  <span style={{ display: 'flex' }}>
                    <p className="welcome-text"> Pool 1</p>
                    <span
                      onClick={onPool}
                      id="pool-select-icon"
                      className="material-icons"
                    >
                      unfold_more
                    </span>
                  </span>
                ) : (
                  <span style={{ display: 'flex' }}>
                    <p className="welcome-text"> Pool 2</p>
                    <span
                      onClick={onPool}
                      id="pool-select-icon"
                      className="material-icons"
                    >
                      unfold_more
                    </span>
                  </span>
                )}
                <p className="account-name">{state.DGBalances[1]}</p>
              </span>
            </span>

            <Divider />

            <span className="DG-button-span">
              {Number(state.DGBalances[1]) ? (
                <Button
                  className="DG-claim-button"
                  onClick={() => props.getReward()}
                >
                  CLAIM $DG
                </Button>
              ) : (
                <Button disabled className="DG-claim-button">
                  CLAIM $DG
                </Button>
              )}
            </span>
          </div>

          <span className="DG-tablet-container">
            <div
              className="DG-column one"
              style={{ position: 'relative', height: '100%' }}
            >
              <span style={{ display: 'flex' }}>
                <img src={Images.MANA_CIRCLE} className="farming-logo" />
                <img src={Images.DG_COIN_LOGO} className="farming-logo" />
                <span className="farming-pool-span">
                  <p className="welcome-text"> MANA-DG </p>
                  <p className="account-name">0</p>
                </span>
              </span>

              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  disabled
                  className="balancer-top-button"
                  target="_blank"
                  style={{ marginTop: '-75px' }}
                >
                  Pool 1 »
                </Button>
              </span>

              <Divider />

              <div style={{ display: 'flex' }}>
                <span className="gameplay-left-column">
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text">% of pool 1</p>
                    <p className="earned-amount">{percentagePool1}</p>
                  </span>
                </span>

                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '50%',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text">pool 1 rate</p>
                    <p className="earned-amount">{currenReward / 40}</p>
                  </span>
                </span>
              </div>

              <Divider />

              <Input
                className="liquidity-input"
                fluid
                placeholder={amountInput}
                onChange={handleChange}
              />

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <p
                  className="bpt-text"
                  onClick={() => setAmountInput(state.staking[2])}
                >
                  {state.staking[2]} BPT
                </p>
                <p
                  className="bpt-text"
                  onClick={() => setAmountInput(state.staking[1])}
                >
                  {state.staking[1]} BPT staked
                </p>
              </span>

              <span className="DG-button-span">
                <Button
                  className="DG-stake-button"
                  onClick={() => props.staking(amountInput)}
                >
                  STAKE LP
                </Button>
                <Button disabled className="DG-stake-button">
                  UNSTAKE LP
                </Button>
              </span>
            </div>

            <div
              className="DG-column two"
              style={{ position: 'relative', height: '100%' }}
            >
              <span style={{ display: 'flex' }}>
                <img src={Images.DAI_CIRCLE} className="farming-logo" />
                <img src={Images.DG_COIN_LOGO} className="farming-logo" />
                <span className="farming-pool-span">
                  <p className="welcome-text"> DAI-DG </p>
                  <p className="account-name">0</p>
                </span>
              </span>

              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  disabled
                  className="balancer-top-button"
                  target="_blank"
                  style={{ marginTop: '-75px' }}
                >
                  Pool 2 »
                </Button>
              </span>

              <Divider />

              <div style={{ display: 'flex' }}>
                <span className="gameplay-left-column">
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text"> % of pool 2</p>
                    <p className="earned-amount"> ... </p>
                  </span>
                </span>

                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '50%',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text"> pool 2 rate </p>
                    <p className="earned-amount"> ... </p>
                  </span>
                </span>
              </div>

              <Divider />

              <Input
                className="liquidity-input"
                fluid
                placeholder="Amount"
              />

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <p className="bpt-text"> 0 BPT </p>
                <p className="bpt-text"> 0 BPT staked</p>
              </span>

              <span className="DG-button-span">
                <Button disabled className="DG-stake-button">
                  STAKE LP
                </Button>
                <Button disabled className="DG-stake-button">
                  UNSTAKE LP
                </Button>
              </span>
            </div>
          </span>
        </div>
      </Aux>
    );
  }

  function handleChange(e) {
    console.log('New amount: ' + e.target.value);

    setAmountInput(e.target.value);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentGovernance() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">Decentral Games Governance</h3>
              <p>
                Staked $DG tokens are used to vote in decentral.games governance
                and to receive $DG governance rewards. Proposals can be
                submitted and voted on{' '}
                <a href="" style={{ color: '#2085f4' }}>
                  {' '}
                  here
                </a>
                . Read more about decentral.games governance in our{' '}
                <a
                  href="https://decentral-games-1.gitbook.io/dg/governance-1"
                  style={{ color: '#2085f4' }}
                >
                  docs
                </a>
                .
              </p>
            </span>
          </div>
        </div>

        <div className="DG-liquidity-container gov">
          <div
            className="DG-column unclaimed"
            style={{ position: 'relative', height: '100%' }}
          >
            <span style={{ display: 'flex' }}>
              <img src={Images.DG_COIN_LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed</p>
                <p className="account-name">{state.DGBalances[0]}</p>
              </span>
            </span>

            <Divider />

            <span className="DG-button-span">
              {Number(state.DGBalances[0]) ? (
                <Button
                  className="DG-claim-button"
                  onClick={() => props.metaTransaction()}
                >
                  CLAIM $DG
                </Button>
              ) : (
                <Button disabled className="DG-claim-button">
                  CLAIM $DG
                </Button>
              )}
            </span>
          </div>

          <span className="DG-tablet-container">
            <div className="DG-column one">
              <span style={{ display: 'flex' }}>
                <img src={Images.DG_COIN_LOGO} className="farming-logo" />
                <span className="farming-pool-span">
                  <p className="welcome-text"> Staked DG</p>
                  <p className="account-name">0</p>
                </span>
              </span>

              <Divider />

              <div style={{ display: 'flex' }}>
                <span className="gameplay-left-column">
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text"> % of gov pool </p>
                    <p className="earned-amount"> ... </p>
                  </span>
                </span>

                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '50%',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <p className="earned-text"> Treasury </p>
                    <p className="earned-amount"> ... </p>
                  </span>
                </span>
              </div>

              <Divider />

              <Input
                className="liquidity-input"
                fluid
                placeholder="Amount"
              />

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <p className="bpt-text"> 0 DG </p>
                <p className="bpt-text"> 0 DG staked</p>
              </span>

              <span className="DG-button-span">
                <Button disabled className="DG-stake-button">
                  STAKE $DG
                </Button>
                <Button disabled className="DG-stake-button">
                  UNSTAKE $DG
                </Button>
              </span>
            </div>

            <div
              className="DG-column two"
              style={{
                position: 'relative',
                height: '100%',
                maxHeight: '183px',
              }}
            >
              <span style={{ display: 'flex' }}>
                <img src={Images.SNAPSHOT_ICON} className="farming-logo" />
                <span className="farming-pool-span">
                  <p className="welcome-text"> Proposals</p>
                  <p className="account-name">0</p>
                </span>
              </span>

              <Divider />

              <span className="DG-button-span">
                <Button disabled className="DG-stake-button">
                  DISCUSSION
                </Button>
                <Button disabled className="DG-stake-button">
                  VOTING
                </Button>
              </span>
            </div>
          </span>
        </div>
      </Aux>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentAdmin() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">Liquidity Farming Administration</h3>
              <p>DG Balance (contract): {state.staking[0]}</p>
              <p>BPT Balance (contract): {state.staking[1]}</p>
              <p>BPT Balance (wallet): {state.staking[2]}</p>
              <p>Current reward amount: {currenReward}</p>
              <p>Reward period finish time: {finishTime}</p>
              <p>
                <ButtonReward
                  stakingContract={stakingContract}
                  rewardAmount={rewardAmount}
                  rewardData={(amount) => rewardData(amount)}
                />
              </p>
            </span>
          </div>
        </div>
      </Aux>
    );
  }

  async function rewardData(amountReward) {
    console.log('current reward: ' + amountReward);

    const timestamp = await getPeriodFinish();
    console.log('current timestamp: ' + timestamp);

    const date = new Date(timestamp * 1000);
    const hours = date.getHours(); // hours part from the timestamp
    const minutes = '0' + date.getMinutes(); // minutes part from the timestamp
    const seconds = '0' + date.getSeconds(); // seconds part from the timestamp
    const formattedTime =
      hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    setCurrentReward(amountReward);
    setFinishTime(formattedTime);

    // dispatch timestamp to the Context API store
    dispatch({
      type: 'stake_time',
      data: timestamp,
    });
  }

  if (props.content === 'mining') {
    return contentMining();
  } else if (props.content === 'liquidity') {
    return contentLiquidity();
  } else if (props.content === 'governance') {
    return contentGovernance();
  } else if (props.content === 'admin') {
    return contentAdmin();
  }
};

export default ContentFarming;
