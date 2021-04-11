import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import { Button, Divider, Loader, Icon, Input, Modal } from 'semantic-ui-react';
import Aux from '../_Aux';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';
import Transactions from '../../common/Transactions';
import Global from '../Constants';


const ContentUniswap = (props) => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [amountInputMANA, setAmountInputMANA] = useState('');
  const [amountInputDAI, setAmountInputDAI] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [percentageUniswap, setPercentageUniswap] = useState(0);
  const [percentagePool, setPercentagePool] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [APYUniswap, setAPYUniswap] = useState(0);
  const [stakingContractUniswap, setStakingContractUniswap] = useState({});
  const [uniswapContract, setUniswapContract] = useState({});
  const [instances, setInstances] = useState(false);

  // balancer local variables
  const [percentagePool1, setPercentagePool1] = useState(0);
  const [percentagePool2, setPercentagePool2] = useState(0);
  const [pool1, setPool1] = useState(true);
  const [pool1USD, setPool1USD] = useState(0);
  const [pool2USD, setPool2USD] = useState(0);
  const [BPTContract1, setBPTContract1] = useState({});
  const [BPTContract2, setBPTContract2] = useState({});
  const [open, setOpen] = useState(false);


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const stakingContractUniswap = await Transactions.stakingContractUniswap(
          web3
        );
        setStakingContractUniswap(stakingContractUniswap);

        const uniswapContract = await Transactions.uniswapContract(web3);
        setUniswapContract(uniswapContract);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (props.price && state.DGBalances.BALANCE_STAKING_UNISWAP) {
      const priceUSD = Number(
        props.price * state.DGBalances.BALANCE_STAKING_UNISWAP
      );
      const priceUSDFormatted = props.formatPrice(priceUSD, 2);

      setPriceUSD(priceUSDFormatted);
    }
  }, [props.price, state.DGBalances.BALANCE_STAKING_UNISWAP]);

  useEffect(() => {
    if (
      props.price &&
      state.DGBalances.BALANCE_UNISWAP_ETH &&
      state.DGBalances.BALANCE_UNISWAP_DG
    ) {
      (async () => {
        let response = await Fetch.ETH_PRICE();
        let json = await response.json();

        const priceETH = json.market_data.current_price.usd;
        const locked_ETH = state.DGBalances.BALANCE_UNISWAP_ETH * priceETH;
        const locked_DG = state.DGBalances.BALANCE_UNISWAP_DG * props.price;
        const uni_denom = locked_DG + locked_ETH;
        const uni_num = 51 * 500 * props.price;
        const uni_APY_temp = (uni_num / uni_denom) * 100;
        const APYUniswap = Number(uni_APY_temp).toFixed(2);

        setAPYUniswap(APYUniswap);
      })();
    }
  }, [
    props.price,
    state.DGBalances.BALANCE_UNISWAP_ETH,
    state.DGBalances.BALANCE_UNISWAP_DG,
  ]);

  useEffect(() => {
    if (
      state.stakingBalances.BALANCE_STAKED_UNISWAP &&
      state.stakingBalances.BALANCE_CONTRACT_UNISWAP
    ) {
      const percentageUniswap = Number(
        (state.stakingBalances.BALANCE_STAKED_UNISWAP /
          state.stakingBalances.BALANCE_CONTRACT_UNISWAP) *
          100
      ).toFixed(2);

      setPercentageUniswap(percentageUniswap);
    }
  }, [
    state.stakingBalances.BALANCE_STAKED_UNISWAP,
    state.stakingBalances.BALANCE_CONTRACT_UNISWAP,
  ]);


  useEffect(() => {
    if (instances) {
      (async () => {
        const stakedTotal = await Transactions.getTotalSupply(
          stakingContractUniswap
        );

        if (stakedTotal) {
          const percentagePool =
            state.stakingBalances.BALANCE_STAKED_UNISWAP / stakedTotal;

          setPercentagePool(percentagePool);
        } else {
          setPercentagePool(0);
        }
      })();
    }
  }, [instances, state.stakingBalances.BALANCE_STAKED_UNISWAP]);

  
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function handleChange(e) {
    setAmountInput(e.target.value);
  }

  function contentUniswap() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top" style={{ minWidth: '100%' }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Liquidity Provision</h3>
              <p>
                Receive $DG for liquidity provision in the 50/50 ETH-DG Uniswap
                pool and staking the LP tokens on this dashboard.
                <a
                  href="https://decentral-games-1.gitbook.io/dg/governance-1"
                  style={{ color: '#2085f4' }}
                  target="_blank"
                >
                  {' '}
                  Read more
                </a>
                . Balancer LP rewards have now ended following this{' '}
                <a
                  href="https://snapshot.page/#/decentralgames.eth/proposal/QmRnnRAA3uHJjSvgMhLvigtapKRLNF1D5Wes5gVkRyJ1HX"
                  style={{ color: '#2085f4' }}
                  target="_blank"
                >
                  gov proposal
                </a>
                  . Unclaimed $DG and links to the pools can be found{' '}
                <a 
                  href="/dg/balancer"
                  style={{ color: '#2085f4' }}
                >
                  here
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
                <span>
                  <p className="welcome-text">Unclaimed $DG</p>
                  {state.DGBalances.BALANCE_STAKING_UNISWAP ? (
                    <p className="account-name">
                      {props.formatPrice(
                        state.DGBalances.BALANCE_STAKING_UNISWAP,
                        3
                      )}
                    </p>
                  ) : (
                    <Loader
                      active
                      inline
                      size="medium"
                      style={{
                        fontSize: '12px',
                        marginTop: '12px',
                        marginLeft: '15px',
                      }}
                    />
                  )}
                </span>
              </span>
            </span>

            <Divider />

            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '12px',
                paddingBottom: '12px',
              }}
            >
              <p className="earned-text">Value USD</p>
              {priceUSD ? (
                <p className="earned-amount">${priceUSD}</p>
              ) : (
                <Loader
                  active
                  inline
                  size="small"
                  style={{
                    fontSize: '12px',
                    marginTop: '1px',
                    marginBottom: '2px',
                  }}
                />
              )}
            </span>

            <Divider />

            <span className="DG-button-span">
              {Number(state.DGBalances.BALANCE_STAKING_UNISWAP) ? (
                <Button
                  className="DG-claim-button"
                  id="balances-padding-correct"
                  onClick={() => props.reward(stakingContractUniswap)}
                >
                  CLAIM UNISWAP $DG
                </Button>
              ) : (
                <Button disabled className="DG-claim-button">
                  CLAIM UNISWAP $DG
                </Button>
              )}
            </span>
          </div>

          <span className="DG-tablet-container">
            <div
              className="DG-column one-uniswap"
              id="DG-column-hover"
              style={{ position: 'relative', height: '100%' }}
            >
              <span style={{ display: 'flex' }}>
                <img src={Images.ETH_CIRCLE} className="farming-logo" />
                <img
                  src={Images.DG_COIN_LOGO}
                  className="farming-logo"
                  alt="Decentral Games Coin Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text">Uniswap</p>
                  <p className="account-name">ETH-DG</p>
                </span>
              </span>

              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  href="https://info.uniswap.org/pair/0x44c21f5dcb285d92320ae345c92e8b6204be8cdf"
                  target="_blank"
                  style={{ marginTop: '-75px', marginRight: '0px' }}
                >
                  <Icon
                    className="more-text"
                    name="external square alternate"
                  />
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
                    {APYUniswap ? (
                      <p className="earned-amount">{APYUniswap}%</p>
                    ) : (
                      <Loader
                        active
                        inline
                        size="small"
                        style={{
                          fontSize: '12px',
                          marginTop: '5px',
                          marginLeft: '-1px',
                          marginBottom: '-3px',
                        }}
                      />
                    )}
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
                    <p className="earned-text">% of pool</p>
                    <p className="earned-amount">
                      {percentageUniswap ? (
                        <p className="earned-amount">{percentageUniswap}%</p>
                      ) : (
                        <Loader
                          active
                          inline
                          size="small"
                          style={{
                            fontSize: '12px',
                            marginTop: '5px',
                            marginLeft: '-1px',
                            marginBottom: '-3px',
                          }}
                        />
                      )}
                    </p>
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
                  onClick={() =>
                    setAmountInput(state.stakingBalances.BALANCE_WALLET_UNISWAP)
                  }
                >
                  {props.formatPrice(
                    state.stakingBalances.BALANCE_WALLET_UNISWAP,
                    3
                  )}{' '}
                  UNI-V2
                </p>
                <p
                  className="bpt-text"
                  onClick={() =>
                    setAmountInput(state.stakingBalances.BALANCE_STAKED_UNISWAP)
                  }
                >
                  {props.formatPrice(
                    state.stakingBalances.BALANCE_STAKED_UNISWAP,
                    3
                  )}{' '}
                  UNI-V2 staked
                </p>
              </span>

              <span className="DG-button-span">
                {Number(amountInput) ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      props.staking(
                        uniswapContract,
                        Global.ADDRESSES.DG_STAKING_UNISWAP_ADDRESS,
                        stakingContractUniswap,
                        amountInput
                      );
                      setAmountInput('');
                    }}
                  >
                    STAKE UNI-V2
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    STAKE UNI-V2
                  </Button>
                )}

                {percentagePool && Number(amountInput) ? (
                  <Button
                    className="DG-stake-button"
                    id="balances-padding-correct"
                    onClick={() => {
                      props.withdrawal(stakingContractUniswap, amountInput);
                      setAmountInput('');
                    }}
                  >
                    UNSTAKE UNI-V2
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    UNSTAKE UNI-V2
                  </Button>
                )}
              </span>
            </div>
          </span>
        </div>
      </Aux>
    );
  }

  return contentUniswap();
};

export default ContentUniswap;
