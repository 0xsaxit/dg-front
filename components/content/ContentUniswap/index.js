import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from 'store';
import Web3 from 'web3';
import { Button, Divider, Loader, Icon, Input, Modal } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import Images from 'common/Images';
import Fetch from 'common/Fetch';
import Transactions from 'common/Transactions';
import Global from 'components/Constants';

import styles from './ContentUniswap.module.scss';

const ContentUniswap = props => {
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
        const stakingContractUniswap =
          await Transactions.stakingContractUniswap(web3);
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
        const uni_num = 51 * 225 * props.price;
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
        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed" style={{ maxHeight: '100%' }}>
            <p className="earned-amount" style={{ paddingTop: '2px' }}>
              Unclaimed
            </p>

            <Divider className="divider-dg-top" />

            <span style={{ display: 'flex' }}>
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo-small"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text-top">$DG Balance</p>
                {state.DGBalances.BALANCE_STAKING_UNISWAP ? (
                  <p className="earned-amount">
                    {props.formatPrice(
                      state.DGBalances.BALANCE_STAKING_UNISWAP,
                      3
                    )}
                  </p>
                ) : (
                  <Loader
                    active
                    inline
                    size="small"
                    style={{
                      fontSize: '12px',
                      marginTop: '5px',
                      marginLeft: '-1px',
                      marginBottom: '-2px',
                    }}
                  />
                )}
              </span>
            </span>

            <Divider className="divider-dg-top" />

            <span
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '3px',
              }}
            >
              <p className="welcome-text" style={{ paddingLeft: '0px' }}>
                {' '}
                TOTAL USD{' '}
              </p>
              <p className="earned-amount"> ${priceUSD} </p>
            </span>

            <Divider className="divider-dg-top" />

            <p style={{ fontSize: '18px' }}>
              Receive $DG for liquidity provision in the 50/50 ETH-DG Uniswap
              pool by staking the LP tokens on this dashboard.
              <a
                href="https://decentral-games-1.gitbook.io/dg/governance-1"
                style={{ color: '#2085f4' }}
                target="_blank"
              >
                {' '}
                Read more
              </a>
              .
            </p>

            <Divider className="divider-dg-top" />

            <span className="DG-button-span">
              {Number(state.DGBalances.BALANCE_STAKING_UNISWAP) ? (
                <Button
                  className="DG-claim-button"
                  id="balances-padding-correct"
                  onClick={() => props.reward(stakingContractUniswap)}
                >
                  Claim
                </Button>
              ) : (
                <Button disabled className="DG-claim-button">
                  Claim
                </Button>
              )}
            </span>
          </div>

          <div className="DG-tablet-container-gov">
            <div
              className="DG-column-treasury two"
              style={{
                position: 'relative',
                height: '100%',
              }}
            >
              <p className="earned-amount" style={{ paddingTop: '2px' }}>
                Liquidity Provision
              </p>

              <Divider className="divider-dg-top" />

              <span style={{ display: 'flex' }}>
                <img src={Images.ETH_CIRCLE} className="farming-logo-small" />
                <img
                  src={Images.DG_COIN_LOGO}
                  className="farming-logo-small two"
                  alt="Decentral Games Coin Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text-top">Uniswap</p>
                  <p className="earned-amount">ETH-DG</p>
                </span>
              </span>

              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  href={`https://info.uniswap.org/pair/${Global.ADDRESSES.UNISWAP_ADDRESS_STAKING}`}
                  target="_blank"
                  style={{ marginTop: '-60px', marginRight: '-4px' }}
                >
                  <Icon
                    className="more-text"
                    name="external square alternate"
                  />
                </a>
              </span>

              <Divider className="divider-dg-top" />

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
                      <p className="earned-amount stat">{APYUniswap}%</p>
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
                    <p className="earned-amount stat">
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

              <Divider className="divider-dg-top" />

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

              <span className="DG-button-span" style={{ paddingTop: '8px' }}>
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
                    Stake Uni V2
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    Stake Uni v2
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
                    Unstake Uni v2
                  </Button>
                ) : (
                  <Button disabled className="DG-stake-button">
                    Unstake Uni v2
                  </Button>
                )}
              </span>
            </div>

            <div className="DG-column-blank" />
          </div>
        </div>
      </Aux>
    );
  }

  return contentUniswap();
};

export default ContentUniswap;
