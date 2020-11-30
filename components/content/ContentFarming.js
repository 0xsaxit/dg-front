import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import { Button, Divider, Input, Icon } from 'semantic-ui-react';
import Aux from '../_Aux';
import Images from '../../common/Images';
import ButtonReward from '../button/ButtonReward';
import Global from '../Constants';
import Transactions from '../../common/Transactions';
import Fetch from '../../common/Fetch';


const ContentFarming = (props) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const dataPlay = state.transactions[1];
  const [poolSelect, setPoolSelect] = useState(1);
  const [currenReward, setCurrentReward] = useState(0);
  const [finishTime, setFinishTime] = useState(0);
  const [amountInput, setAmountInput] = useState('');
  const [percentagePool1, setPercentagePool1] = useState(0);

  const [DGPrice, setDGPrice] = useState(0);

  const [totalDAI, setTotalDAI] = useState(0);
  const [totalMANA, setTotalMANA] = useState(0);
  const [manaPrice, setManaPrice] = useState(0);

  const rewardAmount = '10000000000000000000'; // hard-coded reward amount


  // fetch total bet from API
  useEffect(() => {
    (async function () {
      let response = await Fetch.PLAYER_DATA(state.userInfo[1]);
      let json = await response.json();
      let temp = json.MANA.bet_player / Global.CONSTANTS.FACTOR;
      let MANA_adjusted = temp.toLocaleString();

      let temp_2 = json.DAI.bet_player / Global.CONSTANTS.FACTOR;
      let DAI_adjusted = temp_2.toLocaleString();

      // calculate price of mana locked
      let response_2 = await Fetch.MANA_PRICE();
      let json_2 = await response_2.json();
      
      setManaPrice(json_2.market_data.current_price.usd);
      setTotalMANA(MANA_adjusted);
      setTotalDAI(DAI_adjusted);
    })();
  }, [totalMANA, totalDAI, manaPrice]);


  // usd value calculations
  const temp = (state.DGBalances[5] / (49 * state.DGBalances[4]));
  const price = temp.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const temp_2 = price * state.DGBalances[0];
  const USDGameplay = temp_2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const temp_3 = price * state.DGBalances[3];
  const USDToken = temp_3.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const temp_4 = price * state.DGBalances[1];
  const PoolOneUSD = temp_4.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const temp_5 = price * state.DGBalances[2];
  const PoolTwoUSD = temp_5.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');


  // APY value calculations for pool 1
  const numerator = (51 * 2400 * price * state.DGBalances[10]);
  const total_locked = ((state.DGBalances[4] * price) + state.DGBalances[8]);
  const denominator = (total_locked * state.stakingBalances[0]);
  const APY_temp = (numerator / denominator) * 100;
  const APY = APY_temp.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');


  // player edge calculations
  const DAI_edge_temp = ((price / 1000) * 100) - 0.5;
  const DAI_edge = (DAI_edge_temp).toFixed(2);
  const MANA_edge_temp = ((price / (16000 * manaPrice)) * 100) - 0.5;
  const MANA_edge = (MANA_edge_temp).toFixed(2);


  // get initial reward and timestamp values
  useEffect(() => {
    if (props.instances) {
      const rewardAdjusted = rewardAmount / Global.CONSTANTS.FACTOR;
      rewardData(rewardAdjusted);
    }
  }, [props.instances]);


  useEffect(() => {
    if (props.instances) {
      (async () => {
        const stakedTotal = await props.stakingContract.methods
          .totalSupply()
          .call();
        const stakedTotalAdjusted = stakedTotal / Global.CONSTANTS.FACTOR;

        if (stakedTotal) {
          const percentagePool1 =
            state.stakingBalances[2] / stakedTotalAdjusted;
          const percentageFixed = (percentagePool1 * 100).toFixed(3);

          setPercentagePool1(percentageFixed);
        } else {
          setPercentagePool1(0);
        }
      })();
    }
  }, [props.instances, state.stakingBalances]);


  var onPool;
  if (poolSelect === 1) {
    onPool = () => setPoolSelect(2);
  } else {
    onPool = () => setPoolSelect(1);
  }


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentToken() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG | Decentral Games Governance Token</h3>
              <p>
                {' '}
                $DG is rewarded to players, liquidity providers, and governors of the decentral.games ecosystem.
                $DG is not an investment. Learn more by
                reading our
                <a href="" target="_blank" style={{ color: '#2085f4' }}>
                  {' '}
                  announcement{' '}
                </a>
                or by visiting our
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
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text">Unclaimed $DG</p>
                <p className="account-name">{state.DGBalances[3]}</p>
              </span>
            </span>

            <Divider />

            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '11px',
                paddingBottom: '11px',
              }}
            >
              <p className="earned-text">Value USD</p>
              <p className="earned-amount">${USDToken}</p>
            </span>

            <Divider />

            {Number(state.DGBalances[3]) ? (
              <span className="DG-button-span">
                <Button
                  className="DG-claim-button"
                  id="balances-padding-correct"
                  onClick={() => props.scrapeMyTokens()}
                >
                  CLAIM $DG
                </Button>
              </span>
            ) : (
              <span className="DG-button-span">
                <Button disabled className="DG-claim-button">
                  CLAIM $DG
                </Button>
              </span>
            )}
          </div>

          <span className="DG-tablet-container">
            <div className="DG-column" style={{ width: '100%' }}>
              <span style={{ display: 'flex' }}>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 className="DG-h3">Existing NFT Holders</h3>
                  <p
                    className="welcome-text"
                    style={{ marginTop: '-12px', paddingLeft: '0px' }}
                  >
                    {' '}
                    december 1, 2020{' '}
                  </p>
                  <p style={{ paddingTop: '15px' }}>
                    {' '}
                    Each Tominoya and Flamingos
                    NFT Holder gets 120 DG with 20 week linear vesting.{' '}
                  </p>
                </span>
              </span>

              <span style={{ display: 'flex', paddingTop: '30px' }}>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 className="DG-h3">All Community Players</h3>
                  <p
                    className="welcome-text"
                    style={{ marginTop: '-12px', paddingLeft: '0px' }}
                  >
                    {' '}
                    december 1, 2020{' '}
                  </p>
                  <p style={{ paddingTop: '15px' }}>
                    {' '}
                    Each Ethereum address that has
                    played our free play games within the last 4 months gets 10 DG (Cutoff:
                    Nov 1, 2020).{' '}
                  </p>
                </span>
              </span>
            </div>
          </span>
        </div>
      </Aux>
    );
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
                Mine $DG by playing games with MANA or DAI. Earn
                bonuses by playing with friends, wearing DG
                wearable NFTs, and referring friends. Read more about $DG gameplay mining in our{' '}
                <a
                  href="https://decentral-games-1.gitbook.io/dg/allocation"
                  target="_blank"
                  style={{ color: '#2085f4' }}
                >
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
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text">Unclaimed $DG</p>
                <p className="account-name">{state.DGBalances[0]}</p>
              </span>
            </span>

            <Divider />

            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '11px',
                paddingBottom: '11px',
              }}
            >
              <p className="earned-text">Value USD</p>
              <p className="earned-amount">${USDGameplay}</p>
            </span>

            <Divider />

            <span className="DG-button-span">
              {Number(state.DGBalances[0]) ? (
                <Button
                  className="DG-claim-button"
                  id="balances-padding-correct"
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
                <img
                  src={Images.MANA_CIRCLE}
                  className="farming-logo"
                  alt="Decentraland Logo"
                />
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
                    <p className="earned-text"> player edge </p>
                    <p className="earned-amount"> {MANA_edge}% </p>
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
                    <p className="earned-amount"> 16K MANA : 1 DG </p>
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
                <img
                  src={Images.DAI_CIRCLE}
                  className="farming-logo"
                  alt="Dai Logo"
                />
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
                    <p className="earned-text"> player edge </p>
                    <p className="earned-amount"> {DAI_edge}% </p>
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
                    <p className="earned-amount"> 1K DAI : 1 DG </p>
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
                Farm $DG by providing liquidity in 98/2 MANA-DG and DAI-DG
                Balancer pools and staking the LP tokens on this dashboard. Read
                more about $DG liquidity farming in our
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
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                {poolSelect === 1 ? (
                  <span>
                    <span style={{ display: 'flex' }}>
                      <p className="welcome-text"> unclaimed 1</p>
                      <Icon name="sort" id="pool-select-icon" onClick={onPool} />
                    </span>
                    <p className="account-name">{state.DGBalances[1]}</p>
                  </span>
                ) : (
                  <span>
                    <span style={{ display: 'flex' }}>
                      <p className="welcome-text"> unclaimed 2</p>
                      <Icon name="sort" id="pool-select-icon" onClick={onPool} />
                    </span>
                    <p className="account-name">{state.DGBalances[2]}</p>
                  </span>
                )}
              </span>
            </span>

            <Divider />

            {poolSelect === 1 ? (
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: '11px',
                  paddingBottom: '11px',
                }}
              >
                <p className="earned-text"> Value USD </p>
                <p className="earned-amount"> ${PoolOneUSD} </p>
              </span>
            ) : ( 
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: '11px',
                  paddingBottom: '11px',
                }}
              >
                <p className="earned-text"> Value USD </p>
                <p className="earned-amount"> ${PoolTwoUSD} </p>
              </span>
            )}

            <Divider />

            {poolSelect === 1 ? (
              <span className="DG-button-span">
                {Number(state.DGBalances[1]) ? (
                  <Button
                    className="DG-claim-button"
                    id="balances-padding-correct"
                    onClick={() => props.getReward()}
                  >
                    CLAIM POOL 1 $DG
                  </Button>
                ) : (
                  <Button disabled className="DG-claim-button">
                    CLAIM POOL 1 $DG
                  </Button>
                )}
              </span>
            ) : (
              <span className="DG-button-span">
                {Number(state.DGBalances[2]) ? (
                  <Button
                    className="DG-claim-button"
                    id="balances-padding-correct"
                    onClick={() => props.getReward_2()}
                  >
                    CLAIM POOL 2 $DG
                  </Button>
                ) : (
                  <Button disabled className="DG-claim-button">
                    CLAIM POOL 2 $DG
                  </Button>
                )}
              </span>
            )}
          </div>

          <span className="DG-tablet-container">
            <div
              className="DG-column one"
              id="DG-column-hover"
              style={{ position: 'relative', height: '100%' }}
            >
              <span style={{ display: 'flex' }}>
                <img
                  src={Images.MANA_CIRCLE}
                  className="farming-logo"
                  alt="Decentraland Logo"
                />
                <img
                  src={Images.DG_COIN_LOGO}
                  className="farming-logo"
                  alt="Decentral Games Coin Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text"> pool 1 </p>
                  <p className="account-name"> MANA-DG </p>
                </span>
              </span>

              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a 
                  href="https://pools.balancer.exchange/#/pool/0xca54c398195fce98856888b0fd97a9470a140f71/"
                  target="_blank"                     
                  style={{ marginTop: '-75px', marginRight: '0px' }}
                >
                  <Icon className="more-text" name="external square alternate" />
                </a>
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
                    <p className="earned-text">APY</p>
                    <p className="earned-amount"> {APY}% </p>
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
                    <p className="earned-text">% of pool 1</p>
                    <p className="earned-amount"> {((state.stakingBalances[2] / state.stakingBalances[0]) * 100).toFixed(2)}% </p>
                  </span>
                </span>
              </div>

              <Divider />

              <Input
                className="liquidity-input"
                fluid
                placeholder="Amount"
                value={amountInput}
                onChange={handleChange}
              />

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <p
                  className="bpt-text"
                  onClick={() => setAmountInput(state.stakingBalances[3])}
                >
                  {state.stakingBalances[3]} BPT
                </p>
                <p
                  className="bpt-text"
                  onClick={() => setAmountInput(state.stakingBalances[2])}
                >
                  {state.stakingBalances[2]} BPT staked
                </p>
              </span>

              <span className="DG-button-span">
                {amountInput ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      stake('stake', amountInput)
                      setAmountInput('')
                    }}
                  >
                    STAKE BPT
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    STAKE BPT
                  </Button>
                )}

                {percentagePool1 && amountInput ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      stake('withdraw', amountInput)
                      setAmountInput('')
                    }}
                  >
                    UNSTAKE BPT
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    UNSTAKE BPT
                  </Button>
                )}
              </span>
            </div>

            <div
              className="DG-column two"
              style={{ position: 'relative', height: '100%' }}
            >
              <span style={{ display: 'flex' }}>
                <img
                  src={Images.DAI_CIRCLE}
                  className="farming-logo"
                  alt="Dai Logo"
                />
                <img
                  src={Images.DG_COIN_LOGO}
                  className="farming-logo"
                  alt="Decentral Games Coin Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text"> pool 2 </p>
                  <p className="account-name"> DAI-DG </p>
                </span>
              </span>

              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a 
                  href="https://pools.balancer.exchange/#/pool/0x3cf393b95a4fbf9b2bdfc2011fd6675cf51d3e5d/"
                  target="_blank"                     
                  style={{ marginTop: '-75px', marginRight: '0px' }}
                >
                  <Icon className="more-text" name="external square alternate" />
                </a>
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
                    <p className="earned-text">APY</p>
                    <p className="earned-amount">0.00%</p>
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
                    <p className="earned-text">% of pool 2</p>
                    <p className="earned-amount">0.00%</p>
                  </span>
                </span>
              </div>

              <Divider />

              <Input className="liquidity-input" fluid placeholder="Amount" />

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <p className="bpt-text"> 0 BPT </p>
                <p className="bpt-text"> 0 BPT staked</p>
              </span>

              <span className="DG-button-span">
                <Button disabled className="DG-stake-button">
                  STAKE BPT
                </Button>
                <Button disabled className="DG-stake-button">
                  UNSTAKE BPT
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

  function stake(type, amount) {
    if (type === 'stake') {
      props.staking(amount);
    } else if (type === 'withdraw') {
      props.withdraw(amount);
    }

    setAmountInput('0');
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
                Staked $DG tokens are used to vote to allocate house profits and
                receive $DG governance rewards. $DG Governance will go live in Q2 2021. Read more about
                $DG governance in our{' '}
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
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed</p>
                <p className="account-name">{state.DGBalances[2]}</p>
              </span>
            </span>

            <Divider />

            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '11px',
                paddingBottom: '11px',
              }}
            >
              <p className="earned-text"> Value USD </p>
              <p className="earned-amount"> ... </p>
            </span>

            <Divider />

            <span className="DG-button-span">
              {Number(state.DGBalances[2]) ? (
                <Button
                  className="DG-claim-button"
                  id="balances-padding-correct"
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
                <img
                  src={Images.DG_COIN_LOGO}
                  className="farming-logo"
                  alt="Decentral Games Coin Logo"
                />
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

              <Input className="liquidity-input" fluid placeholder="Amount" />

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
                <img
                  src={Images.SNAPSHOT_ICON}
                  className="farming-logo"
                  alt="Snapshot Governance Logo"
                />
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
              <p>BPT Balance in contract: {state.stakingBalances[0]}</p>
              <p>DG Balance in contract: {state.stakingBalances[1]}</p>
              <p>Current reward amount: {currenReward}</p>
              <p>Reward period finish time: {finishTime}</p>
              <p>
                <ButtonReward
                  stakingContract={props.stakingContract}
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

    const timestamp = await props.getPeriodFinish();
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

  if (props.content === 'token') {
    return contentToken();
  } else if (props.content === 'mining') {
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
