import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { Modal, Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/spinner_updated';
import { GlobalContext } from '../../../store';
import styles from './ModalInfo.module.scss';
import cn from 'classnames';
import Global from '../../Constants';

const ModalInfo = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [dgTotal, setDGTotal] = useState(0);
  const [xdgTotal, setXDGTotal] = useState(0);
  const [dgTotalUSD, setDGTotalUSD] = useState(0);
  const [xdgTotalUSD, setXDGTotalUSD] = useState(0);
  const [dgMining, setDGMining] = useState(0);
  const [dgMiningUSD, setDGMiningUSD] = useState(0);

  const [dgSummationOld, setDGSummationOld] = useState(0);
  const [dgSummationNew, setDGSummationNew] = useState(0);
  const [dgSummationAll, setDGSummationAll] = useState(0);

  const [DGPrice, setDGPrice] = useState(0);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const dgTotal =
      parseFloat(state.DGBalances.BALANCE_ROOT_DG_LIGHT) +
      parseFloat(state.DGBalances.BALANCE_CHILD_DG_LIGHT);

    setDGTotal(dgTotal);
    setDGTotalUSD(dgTotal * DGPrice);

    const xdgTotal =
      parseFloat(state.stakingBalances.BALANCE_USER_GOVERNANCE) +
      parseFloat(state.DGBalances.BALANCE_CHILD_TOKEN_XDG);

    setXDGTotal(xdgTotal);
    setXDGTotalUSD(xdgTotal * DGPrice);

    const dgMining = 0; // ********** we will set this to the correct value once the new dgPointer is deployed **********
    setDGMining(dgMining);
    setDGMiningUSD(dgMining + DGPrice);

    const dgSummationNew = dgTotal + xdgTotal + dgMining;
    setDGSummationNew(dgSummationNew);
  }, [state.DGBalances, state.stakingBalances]);

  useEffect(() => {
    const balanceMiningOld = state.DGBalances.BALANCE_MINING_DG_V2;
    const balanceMiningAdjustedOld = balanceMiningOld * 1000;

    const balanceStakingB1 = state.DGBalances.BALANCE_STAKING_BALANCER_1;
    const balanceStakingB1Adjusted = balanceStakingB1 * 1000;

    const balanceStakingB2 = state.DGBalances.BALANCE_STAKING_BALANCER_2;
    const balanceStakingB2Adjusted = balanceStakingB2 * 1000;

    const balanceKeeperDG = state.DGBalances.BALANCE_KEEPER_DG;
    const balanceKeeperDGAdjusted = balanceKeeperDG * 1000;

    const balanceStakingUser = state.stakingBalances.BALANCE_USER_GOVERNANCE;
    const balanceStakingUserAdjusted = balanceStakingUser * 1000;

    const balanceStakingUniswap = state.DGBalances.BALANCE_STAKING_UNISWAP;
    const balanceStakingUniswapAdjusted = balanceStakingUniswap * 1000;

    const balanceStakingGovOld = state.DGBalances.BALANCE_STAKING_GOVERNANCE;
    const balanceStakingGovOldAdjusted = balanceStakingGovOld * 1000;

    const balanceRootDG = state.DGBalances.BALANCE_ROOT_DG;
    const balanceRootDGAdjusted = balanceRootDG * 1000;

    const balanceChildDG = state.DGBalances.BALANCE_CHILD_DG;
    const balanceChildDGAdjusted = balanceChildDG * 1000;

    console.log('ModalInfo numbers...');
    console.log(balanceMiningAdjustedOld);
    console.log(balanceStakingB1Adjusted);
    console.log(balanceStakingB2Adjusted);
    console.log(balanceKeeperDGAdjusted);
    console.log(balanceStakingUserAdjusted);
    console.log(balanceStakingUniswapAdjusted);
    console.log(balanceStakingGovOldAdjusted);
    console.log(balanceRootDGAdjusted);
    console.log(balanceChildDGAdjusted);

    const dgSummationOld =
      parseFloat(balanceMiningAdjustedOld) +
      parseFloat(balanceStakingB1Adjusted) +
      parseFloat(balanceStakingB2Adjusted) +
      parseFloat(1) + // balanceKeeperDGAdjusted
      parseFloat(1) + // balanceStakingUserAdjusted
      parseFloat(balanceStakingUniswapAdjusted) +
      parseFloat(1) + // balanceStakingGovOldAdjusted
      parseFloat(1) + // balanceRootDGAdjusted
      parseFloat(balanceChildDGAdjusted);

    setDGSummationOld(formatPrice(dgSummationOld, 0));
  }, [state.DGBalances, state.stakingBalances]);

  useEffect(() => {
    const dgSummationAll = dgSummationNew + dgSummationOld;

    setDGSummationAll(formatPrice(dgSummationAll, 0));
  }, [dgSummationNew, dgSummationOld]);

  useEffect(() => {
    if (state.openModalInfo) {
      setOpen(true);
    }
    state.openModalInfo = false;
  }, [state.openModalInfo]);

  useEffect(() => {
    setDGPrice(state.DGPrices.dg);
  }, [state.DGPrices]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function formatPrice(balanceDG, units) {
    const balanceAdjusted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return balanceAdjusted;
  }

  function topAmounts() {
    return (
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '280px',
          }}
        >
          <h3 className={styles.title}>Your DG Breakdown</h3>

          <section style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img
                className={styles.dg_image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631325895/dgNewLogo_hkvlps.png"
              />

              <h4 className={styles.subtitle_1}>
                {formatPrice(dgTotal, 0)} DG
              </h4>

              {/* <p className={styles.subtitle_2}>${formatPrice(dgTotalUSD, 2)}</p> */}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img
                className={styles.dg_image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1637260602/grayLogo_ojx2hi.png"
              />

              <h4 className={styles.subtitle_1}>
                {formatPrice(xdgTotal, 0)} xDG
              </h4>

              {/* <p className={styles.subtitle_2}>
                ${formatPrice(xdgTotalUSD, 2)}
              </p> */}
            </div>
          </section>
        </span>
      </span>
    );
  }

  function stakedDG() {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0px 12px 0px 12px',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title}>Staked DG (xDG)</h5>

          <p className={styles.row_subtitle}>Staked in Governance</p>
        </span>

        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
            {formatPrice(state.stakingBalances.BALANCE_USER_GOVERNANCE, 3)}
          </h5>

          {/* <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
            $
            {formatPrice(
              state.stakingBalances.BALANCE_USER_GOVERNANCE * DGPrice,
              2
            )}
          </p> */}
        </span>
      </span>
    );
  }

  function mainchainDG() {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '6px 12px 0px 12px',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title}>Mainchain DG</h5>

          <p className={styles.row_subtitle}>ETH Mainnet Total</p>
        </span>

        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
            {formatPrice(state.DGBalances.BALANCE_ROOT_DG_LIGHT, 3)}
          </h5>

          {/* <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
            ${formatPrice(state.DGBalances.BALANCE_ROOT_DG_LIGHT * DGPrice, 2)}
          </p> */}
        </span>
      </span>
    );
  }

  function polygonDG() {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0px 12px 0px 12px',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title}>Polygon DG</h5>

          <p className={styles.row_subtitle}>Polygon Network Total</p>
        </span>

        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
            {formatPrice(state.DGBalances.BALANCE_CHILD_DG_LIGHT, 3)}
          </h5>

          {/* <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
            ${formatPrice(state.DGBalances.BALANCE_CHILD_DG_LIGHT * DGPrice, 2)}
          </p> */}
        </span>
      </span>
    );
  }

  function unclaimedDG() {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0px 12px 6px 12px',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title}>Unclaimed DG</h5>

          <p className={styles.row_subtitle}>Gameplay Rewards</p>
        </span>

        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
            {formatPrice(dgMining, 3)}
          </h5>

          {/* <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
            ${formatPrice(dgMining * DGPrice, 2)}
          </p> */}
        </span>
      </span>
    );
  }

  function mainchainDGOld() {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '6px 12px 0px 12px',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title}>Mainchain (Old) $DG</h5>

          <p className={styles.row_subtitle}>Total From All Sources</p>
        </span>

        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
            {formatPrice(dgSummationOld, 3)}
          </h5>

          {/* <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
            ${formatPrice(dgSummationOld * DGPrice, 2)}
          </p> */}
        </span>
      </span>
    );
  }

  function polygonDGOld() {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0px 12px 0px 12px',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title}>Polygon (Old) $DG</h5>

          <p className={styles.row_subtitle}>Total From All Sources</p>
        </span>

        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <h5 className={styles.row_title} style={{ textAlign: 'right' }}>
            {formatPrice(state.DGBalances.BALANCE_CHILD_DG, 3)}
          </h5>

          {/* <p className={styles.row_subtitle} style={{ textAlign: 'right' }}>
            ${formatPrice(state.DGBalances.BALANCE_CHILD_DG * DGPrice, 2)}
          </p> */}
        </span>
      </span>
    );
  }

  function breakdownButton() {
    return (
      <span>
        {!state.DGBalances.BALANCE_ROOT_DG ||
        !state.DGBalances.BALANCE_ROOT_DG_LIGHT ? (
          <Button className="account-button" style={{ marginTop: 0 }}>
            <p className="right-menu-text bnb" style={{ marginTop: '-5px' }}>
              <Spinner width={30} height={30} />
            </p>
          </Button>
        ) : (
          <Button className="account-button" style={{ marginTop: 0 }}>
            <p className="right-menu-text bnb">
              {dgSummationAll.toLocaleString()} DG
            </p>
          </Button>
        )}
      </span>
    );
  }

  function closeButton() {
    return (
      <div
        style={{
          marginTop: '-60px',
          marginBottom: '45px',
          marginLeft: '-30px',
        }}
      >
        <span className={styles.button_close} onClick={() => setOpen(false)}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
              fill="white"
            />
          </svg>
        </span>
      </div>
    );
  }

  function buyAndStakeButtons() {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '24px',
        }}
      >
        <a
          href={`https://app.uniswap.org/#/swap?outputCurrency=${Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DG}`}
          target="_blank"
        >
          <button className={cn('btn', styles.buy_button)}>Buy DG</button>
        </a>

        <Link href="/dg/governance" target="_blank">
          <button className={cn('btn', styles.learn_button)}>Stake DG</button>
        </Link>
      </span>
    );
  }

  return (
    <Modal
      className={styles.info_modal}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={breakdownButton()}
    >
      {closeButton()}
      {topAmounts()}
      {stakedDG()}
      {mainchainDG()}
      {polygonDG()}
      {unclaimedDG()}
      {mainchainDGOld()}
      {polygonDGOld()}
      {buyAndStakeButtons()}
    </Modal>
  );
};

export default ModalInfo;
