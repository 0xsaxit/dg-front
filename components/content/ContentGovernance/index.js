import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from 'store';
import Web3 from 'web3';
import { Button, Divider, Input, Loader } from 'semantic-ui-react';
import Transactions from 'common/Transactions';
import Aux from 'components/_Aux';
import Images from 'common/Images';
import Fetch from 'common/Fetch';
import Global from 'components/Constants';

import styles from './ContentGovernance.module.scss';

const GovernanceProposalsItem = ({ passed, link, govName, end }) => {
  return (
    <a
      target="_blank"
      href={`https://snapshot.org/#/decentralgames.eth/proposal/${link}`}
    >
      <div
        className={`${
          passed ? styles.governance_block : styles.governance_block_blue
        }`}
      >
        <p className={styles.earned_amount}>{govName}</p>
        <span className="d-flex">
          {passed == true ? (
            <Button className={styles.etherscan_button_green} disabled>
              PASSED
            </Button>
          ) : (
            <Button className={styles.etherscan_button_blue} disabled>
              ACTIVE
            </Button>
          )}
          <p className={styles.earned_text}>
            {' '}
            EXECUTED ∙ {end}
          </p>
        </span>
      </div>
    </a>
  );
};

const ContentGovernance = props => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [amountInput, setAmountInput] = useState('');
  const [percentGovernanceStaked, setPercentGovernanceStaked] = useState(0);
  const [percentGovernanceContract, setPercentGovernanceContract] = useState(0);
  const [APYGovernance, setAPYGovernance] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [stakeContractGovernance, setStakeContractGovernance] = useState({});
  const [DGTokenContract, setDGTokenContract] = useState({});
  const [instances, setInstances] = useState(false);

  // governance variables
  const [govOne, setGovOne] = useState('');
  const [passedOne, setPassedOne] = useState(false);
  const [endOne, setEndOne] = useState('');
  const [linkOne, setLinkOne] = useState('');

  const [govTwo, setGovTwo] = useState('');
  const [passedTwo, setPassedTwo] = useState(false);
  const [endTwo, setEndTwo] = useState('');
  const [linkTwo, setLinkTwo] = useState('');

  const [govThree, setGovThree] = useState('');
  const [passedThree, setPassedThree] = useState(false);
  const [endThree, setEndThree] = useState('');
  const [linkThree, setLinkThree] = useState('');

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const length = (obj) => {
    return Object.keys(obj).length;
  }

  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const stakeContractGovernance =
          await Transactions.stakingContractGovernance(web3);
        setStakeContractGovernance(stakeContractGovernance);

        const DGTokenContract = await Transactions.DGTokenContract(web3);
        setDGTokenContract(DGTokenContract);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) {
      const percentGovernanceContract = (
        (state.stakingBalances.BALANCE_USER_GOVERNANCE /
          state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) *
        100
      ).toFixed(2);

      setPercentGovernanceContract(percentGovernanceContract);

      const APYGovernance = (
        (50000 / state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) *
        100
      ).toFixed(2);

      setAPYGovernance(APYGovernance);
    }
  }, [state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE]);

  useEffect(() => {
    if (instances) {
      (async () => {
        const stakedTotal = await Transactions.getTotalSupply(
          stakeContractGovernance
        );

        if (stakedTotal) {
          const percentGovernanceStaked =
            (state.stakingBalances.BALANCE_USER_GOVERNANCE / stakedTotal) * 100;

          setPercentGovernanceStaked(percentGovernanceStaked);
        } else {
          setPercentageGov(0);
        }
      })();
    }
  }, [instances, state.stakingBalances.BALANCE_USER_GOVERNANCE]);

  useEffect(() => {
    if (props.price && state.DGBalances.BALANCE_STAKING_GOVERNANCE) {
      const priceUSD = Number(
        props.price * state.DGBalances.BALANCE_STAKING_GOVERNANCE
      );
      const priceUSDAdjusted = priceUSD
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      setPriceUSD(priceUSDAdjusted);
    }
  }, [props.price, state.DGBalances.BALANCE_STAKING_GOVERNANCE]);

  useEffect(() => {
    (async function () {
      // get snapshot statistics
      let response = await Fetch.PROPOSALS();
      let json = await response.json();

      setGovOne(
        json.QmYnVzkg6gQcw5Zukj7icDjSVg5nbeuJG3irhmSkCzEQHM.msg.payload
      );
      setLinkOne(
        json.QmYnVzkg6gQcw5Zukj7icDjSVg5nbeuJG3irhmSkCzEQHM.authorIpfsHash
      );
      let temp_one =
        json.QmYnVzkg6gQcw5Zukj7icDjSVg5nbeuJG3irhmSkCzEQHM.msg.payload.end;

      if (temp_one * 1000 < Date.now()) {
        setPassedOne(true);
      } else {
        setPassedOne(false);
      }

      var date = new Date(govOne.end * 1000);
      setEndOne(date.toDateString());

      setGovTwo(
        json.QmY3QdaajkMmNq5PsQLpUKFDV9hhxcXeD1E3DMTnPtQbXn.msg.payload
      );
      setLinkTwo(
        json.QmY3QdaajkMmNq5PsQLpUKFDV9hhxcXeD1E3DMTnPtQbXn.authorIpfsHash
      );
      let temp_two =
        json.QmY3QdaajkMmNq5PsQLpUKFDV9hhxcXeD1E3DMTnPtQbXn.msg.payload.end;

      if (temp_two * 1000 < Date.now()) {
        setPassedTwo(true);
      } else {
        setPassedTwo(false);
      }

      var date = new Date(govTwo.end * 1000);
      setEndTwo(date.toDateString());

      setGovThree(
        json.QmXFBUZkrXAxz8h1jMummzLkW1yfeV3F5dep2WBzFpinsH.msg.payload
      );
      setLinkThree(
        json.QmXFBUZkrXAxz8h1jMummzLkW1yfeV3F5dep2WBzFpinsH.authorIpfsHash
      );
      let temp_three =
        json.QmXFBUZkrXAxz8h1jMummzLkW1yfeV3F5dep2WBzFpinsH.msg.payload.end;

      if (temp_three * 1000 < Date.now()) {
        setPassedThree(true);
      } else {
        setPassedThree(false);
      }

      var date = new Date(temp_three * 1000);
      setEndThree(date.toDateString());
    })();
  }, [endOne, endTwo, endThree]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const handleChange = (e) => {
    setAmountInput(e.target.value);
  }

  return (
    <Aux>
      <div className={styles.content_governance_container}>
        <div className={styles.dg_liquidity_container}>
          <div className={styles.dg_column_unclaimed}>
            <p className={styles.earned_amount}>
              Unclaimed
            </p>

            <Divider className={styles.divider_dg_top} />

            <div className="d-flex">
              <img
                src={Images.DG_COIN_LOGO}
                className={styles.farming_logo_small}
                alt="Decentral Games Coin Logo"
              />
              <span className={styles.farming_pool_span}>
                <p className={styles.welcome_text_top}>$DG Balance</p>
                {state.DGBalances.BALANCE_STAKING_GOVERNANCE ? (
                  <p className={styles.earned_amount}>
                    {props.formatPrice(
                      state.DGBalances.BALANCE_STAKING_GOVERNANCE,
                      3
                    )}
                  </p>
                ) : (
                  <Loader
                    active
                    inline
                    size="small"
                    className={styles.governance_loader}
                  />
                )}
              </span>
            </div>

            <Divider className={styles.divider_dg_top} />

            <span className={styles.governance_total}>
              <p className={styles.welcome_text}>
                {' '}
                TOTAL USD{' '}
              </p>
              <p className={styles.earned_amount}> ${priceUSD} </p>
            </span>

            <Divider className={styles.divider_dg_top} />

            <p style={{ fontSize: '18px' }}>
              Stake $DG tokens, govern the treasury, and earn governance rewards.
              Read more about $DG governance in our{' '}
              <a
                href={`${Global.CONSTANTS.BASE_URL}/blog/governance-staking-is-now-live-start-earning-dg-gov-rewards`}
                style={{ color: '#2085f4' }}
                target="_blank"
              >
                announcement{' '}
              </a>
              and get $DG{' '}
              <a
                href={`https://info.uniswap.org/pair/${Global.ADDRESSES.UNISWAP_ADDRESS_STAKING}`}
                style={{ color: '#2085f4' }}
                target="_blank"
              >
                here
              </a>
              .
            </p>

            <Divider className={styles.divider_dg_top} />

            <span className={styles.dg_button_span}>
              {Number(state.DGBalances.BALANCE_STAKING_GOVERNANCE) ? (
                <Button
                  className={styles.dg_claim_button}
                  id="balances-padding-correct"
                  onClick={() => props.reward(stakeContractGovernance)}
                >
                  Claim
                </Button>
              ) : (
                <Button disabled className={styles.dg_claim_button}>
                  Claim
                </Button>
              )}
            </span>
          </div>

          <div className={styles.dg_tablet_container_gov}>
            <div className={styles.dg_column_treasury_two}>
              <p className={styles.earned_amount}>
                Governance Staking
              </p>

              <Divider className={styles.divider_dg_top} />

              <div className="d-flex">
                <img
                  src={Images.DG_COIN_LOGO}
                  className={styles.farming_logo_small}
                  alt="Decentral Games Coin Logo"
                />
                <span className={styles.farming_pool_span}>
                  <p className={styles.welcome_text_top}>Total $DG Staked</p>
                  {state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE ? (
                    <p className={styles.earned_amount}>
                      {props.formatPrice(
                        state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE,
                        0
                      )}
                    </p>
                  ) : (
                    <Loader
                      className={styles.gameplay_loader}
                      active
                      inline
                      size="small"
                    />
                  )}
                </span>
              </div>

              <Divider className={styles.divider_dg_top} />

              <div className="d-flex">
                <div className={styles.gameplay_left_column}>
                  <span className={styles.gameplay_left_column_text}>
                    <p className={styles.earned_text}>APY</p>
                    {APYGovernance ? (
                      <p className={styles.earned_amount}>{APYGovernance}%</p>
                    ) : (
                      <Loader
                        className={styles.gameplay_loader}
                        active
                        inline
                        size="small"
                      />
                    )}
                  </span>
                </div>

                <div className={styles.gameplay_right_column} >
                  <span className={styles.gameplay_right_column_text}>
                    <p className={styles.earned_text}>% of gov pool</p>
                    {percentGovernanceContract ? (
                      <p className={styles.earned_amount}>
                        {percentGovernanceContract}%
                      </p>
                    ) : (
                      <Loader
                        className={styles.gameplay_loader}
                        active
                        inline
                        size="small"
                      />
                    )}
                  </span>
                </div>
              </div>

              <Divider className={styles.divider_dg_top} />

              <Input
                className={styles.liquidity_input}
                fluid
                placeholder="Amount"
                value={amountInput}
                onChange={handleChange}
              />

              <span className={styles.governance_staking_button}>
                <p
                  className={styles.bpt_text}
                  onClick={() => setAmountInput(state.DGBalances.BALANCE_ROOT_DG)}
                >
                  {props.formatPrice(state.DGBalances.BALANCE_ROOT_DG, 3)} DG
                </p>
                <p
                  className={styles.bpt_text}
                  onClick={() =>
                    setAmountInput(state.stakingBalances.BALANCE_USER_GOVERNANCE)
                  }
                >
                  {props.formatPrice(
                    state.stakingBalances.BALANCE_USER_GOVERNANCE,
                    3
                  )}{' '}
                  DG STAKED
                </p>
              </span>

              <span className={styles.dg_button_span}>
                {Number(amountInput) ? (
                  <Button
                    className={styles.dg_stake_button}
                    id="balances-padding-correct"
                    onClick={() => {
                      props.staking(
                        DGTokenContract,
                        Global.ADDRESSES.DG_STAKING_GOVERNANCE_ADDRESS,
                        stakeContractGovernance,
                        amountInput
                      );
                      setAmountInput('');
                    }}
                  >
                    Stake
                  </Button>
                ) : (
                  <Button disabled className={styles.dg_stake_button}>
                    Stake
                  </Button>
                )}

                {percentGovernanceStaked && Number(amountInput) ? (
                  <Button
                    className={styles.dg_stake_button}
                    id="balances-padding-correct"
                    onClick={() => {
                      props.withdrawal(stakeContractGovernance, amountInput);
                      setAmountInput('');
                    }}
                  >
                    Unstake
                  </Button>
                ) : (
                  <Button disabled className={styles.dg_stake_button}>
                    Unstake
                  </Button>
                )}
              </span>
            </div>

            <div className={styles.dg_column_treasury_three}>
              <p className={styles.earned_amount}>
                Governance Proposals
              </p>

              <Divider className={styles.divider_dg_top} />
              <GovernanceProposalsItem passed={passedOne} link={linkOne} govName={govOne.name} end={endOne} />
              <Divider className={styles.divdier_dg_top} />
              <GovernanceProposalsItem passed={passedTwo} link={linkTwo} govName={govTwo.name} end={endTwo} />
              <Divider className={styles.divider_dg_top} />
              <GovernanceProposalsItem passed={passedThree} link={linkThree} govName={govThree.name} end={endThree} />
              <Divider className={styles.divider_dg_top} />

              <span className={styles.dg_button_span}>
                <Button
                  href="https://gov.decentral.games"
                  target="_blank"
                  className={styles.dg_stake_button}
                  id="balances-padding-correct-two"
                >
                  Discussion
                </Button>
                <Button
                  href="https://snapshot.page/#/decentralgames.eth"
                  target="_blank"
                  className={styles.dg_stake_button}
                  id="balances-padding-correct-two"
                >
                  All Proposals
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default ContentGovernance;
