import { useEffect, useState, useContext } from 'react';
import { Modal, Button, Loader } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Fetch from 'common/Fetch';
import cn from 'classnames';
import Global from 'components/Constants';
import DGMetaMask from 'assets/svg/dgmetamask.svg';

import styles from './ModalInfo.module.scss';

const ModalInfo = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [DGTotal, setDGTotal] = useState(0);
  const [DGTotal_2, setDGTotal_2] = useState(0);
  const [supply, setSupply] = useState(0);
  const [DGPrice, setDGPrice] = useState(0);

  useEffect(() => {
    const totalDG =
      parseFloat(state.DGBalances.BALANCE_MINING_DG) +
      parseFloat(state.DGBalances.BALANCE_STAKING_BALANCER_1) +
      parseFloat(state.DGBalances.BALANCE_STAKING_BALANCER_2) +
      parseFloat(state.DGBalances.BALANCE_KEEPER_DG) +
      parseFloat(state.DGBalances.BALANCE_ROOT_DG) +
      parseFloat(state.DGBalances.BALANCE_CHILD_DG) +
      parseFloat(state.stakingBalances.BALANCE_USER_GOVERNANCE) +
      parseFloat(state.DGBalances.BALANCE_STAKING_UNISWAP) +
      parseFloat(state.DGBalances.BALANCE_STAKING_GOVERNANCE);

    const totalDGAdjusted_temp = totalDG.toFixed(0);
    const totalDGAdjusted = Number(totalDGAdjusted_temp);

    setDGTotal(totalDGAdjusted);

    const totalDGAdjusted_2 = totalDG.toFixed(3);
    setDGTotal_2(totalDGAdjusted_2);
  }, [state.DGBalances, state.stakingBalances]);

  // total unclaimed
  const unclaimed =
    Number(state.DGBalances.BALANCE_STAKING_GOVERNANCE) +
    Number(state.DGBalances.BALANCE_STAKING_UNISWAP) +
    Number(state.DGBalances.BALANCE_MINING_DG) +
    Number(state.DGBalances.BALANCE_KEEPER_DG);

  // fetch circulating supply
  useEffect(() => {
    (async function () {
      const json = await Fetch.DG_SUPPLY_GECKO();
      setSupply(json.market_data.circulating_supply);
      setDGPrice(json.market_data.current_price.usd);
    })();
  }, []);

  // calculate market cap
  const temp = supply * DGPrice;
  const marketCap = temp.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const temp_2 = DGTotal_2 * DGPrice;
  const unclaimedUSD = temp_2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const gov_staked = Number(state.stakingBalances.BALANCE_USER_GOVERNANCE);
  const gov_unclaimed = Number(state.DGBalances.BALANCE_STAKING_GOVERNANCE); // governance

  const formatPrice = (balanceDG, units) => {
    const balanceAdjusted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return balanceAdjusted;
  }

  return (
    <Modal
      className={styles.info_modal}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <span>
          {!state.DGBalances.BALANCE_KEEPER_DG ? (
            <Button className={styles.account_button}>
              <p className={styles.right_menu_text}>
                <Loader
                  className={styles.info_modal_loader}
                  active
                  inline
                  size="small"
                />
              </p>
            </Button>
          ) : state.DGBalances.BALANCE_KEEPER_DG == 10 ? null : (
            <Button className={styles.account_button}>
              <p className={styles.right_menu_text}>
                {DGTotal.toLocaleString()} DG
              </p>
            </Button>
          )}
        </span>
      }
    >
      <div className={styles.button_close} style={{ margin: '-60px 0 45px -30px' }}>
        <span className={styles.button_close} onClick={() => setOpen(false)}>
          <DGMetaMask />
        </span>
      </div>

      <div>
        <span className="d-flex justify-content-center">
          <span className="d-flex flex-column">
            <h3 className={styles.title}>Your DG Breakdown</h3>
            <img
              className={styles.dg_image}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624411671/Spinning-Logo-DG_n9f4xd.gif"
            />
            {state.DGBalances.BALANCE_KEEPER_DG == 10 ? (
              <h4 className={styles.subtitle_1}>0.000 DG</h4>
            ) : (
              <h4 className={styles.subtitle_1}>
                {formatPrice(DGTotal_2, 3)} DG
              </h4>
            )}
            <p className={styles.subtitle_2}>${unclaimedUSD}</p>
          </span>
        </span>

        <span className={cn("d-flex justify-content-between", styles.machain_dg_element)}>
          <span className="d-flex flex-column">
            <h5 className={styles.row_title}>Mainchain DG</h5>
            <p className={styles.row_subtitle}>ETH Mainnet Total</p>
          </span>

          <span className="d-flex flex-column">
            <h5 className={cn("text-end", styles.row_title)}>
              {formatPrice(state.DGBalances.BALANCE_ROOT_DG, 3)}
            </h5>
            <p className={cn("text-end", styles.row_subtitle)}>
              ${formatPrice(state.DGBalances.BALANCE_ROOT_DG * DGPrice, 2)}
            </p>
          </span>
        </span>

        <span className={cn("d-flex justify-content-between", styles.staked_dg_element)}>
          <span className="d-flex flex-column">
            <h5 className={styles.row_title}>Polygon Wallet DG</h5>
            <p className={styles.row_subtitle}>Polygon Network Total</p>
          </span>

          <span className="d-flex flex-column">
            <h5 className={cn("text-end", styles.row_title)}>
              {formatPrice(state.DGBalances.BALANCE_CHILD_DG, 3)}
            </h5>
            <p className={cn("text-end", styles.row_subtitle)}>
              ${formatPrice(state.DGBalances.BALANCE_CHILD_DG * DGPrice, 2)}
            </p>
          </span>
        </span>

        <span className={cn("d-flex justify-content-between", styles.staked_dg_element)}>
          <span className="d-flex flex-column">
            <h5 className={styles.row_title}>Staked DG</h5>
            <p className={styles.row_subtitle}>Staked in Governance</p>
          </span>

          <span className="d-flex flex-column">
            <h5 className={cn("text-end", styles.row_title)}>
              {formatPrice(state.stakingBalances.BALANCE_USER_GOVERNANCE, 3)}
            </h5>
            <p className={cn("text-end", styles.row_subtitle)}>
              $
              {formatPrice(
                state.stakingBalances.BALANCE_USER_GOVERNANCE * DGPrice,
                2
              )}
            </p>
          </span>
        </span>

        <span className={cn("d-flex justify-content-between", styles.unclaimed_element)}>
          <span className="d-flex flex-column">
            <h5 className={styles.row_title}>Unclaimed DG</h5>
            <p className={styles.row_subtitle}>Total From All Sources</p>
          </span>

          <span className="d-flex flex-column">
            <h5 className={cn("text-end", styles.row_title)}>
              {formatPrice(unclaimed, 3)}
            </h5>
            <p className={cn("text-end", styles.row_subtitle)}>
              ${formatPrice(unclaimed * DGPrice, 2)}
            </p>
          </span>
        </span>

        <span className={cn("d-flex justify-content-between", styles.buy_dg_element)}>
          <a
            href={`https://app.uniswap.org/#/swap?outputCurrency=${Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DG}`}
            target="_blank"
          >
            <button className={cn('btn', styles.buy_button)}>Buy $DG</button>
          </a>
          <a href="https://docs.decentral.games/faq" target="_blank">
            <button className={cn('btn', styles.learn_button)}>
              Learn More
            </button>
          </a>
        </span>
      </div>
    </Modal>
  );
};

export default ModalInfo;
