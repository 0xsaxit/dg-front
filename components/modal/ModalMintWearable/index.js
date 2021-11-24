import { useContext, useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import ModalETHAuth from 'components/modal/ModalEthAuth';
import IceMintETHTooltip from 'components/tooltips/IceMintETHTooltip';
import IceMintDGStackedTooltip from 'components/tooltips/IceMintDGStackedTooltip';
import styles from './ModalMintWearable.module.scss';
import Images from 'common/Images';
import Global from '../../Constants';
import Aux from '../../_Aux';

const ModalMint = props => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [openETHAuth, setOpenETHAuth] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function imageAndInfo() {
    return (
      <div className={styles.mint_box}>
        <div className={styles.mint_box_purple}>
          <img src={props.wearableImg} className={styles.wearable_main_img} />
        </div>

        <div className={styles.card_body}>
          <div className={styles.card}>Rank 1</div>
          <div className={styles.card}>
            + 1 - 7%
            <img
              src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
              className={styles.img_card}
            />
          </div>
          <div className={styles.card}>{101 - props.numberLeft} of 100</div>
        </div>
      </div>
    );
  }

  function priceAndStaked() {
    return (
      <div className={styles.price_area}>
        Price{' '}
        <span>
          ($
          {(state.DGPrices.eth * state.tokenAmounts.WETH_COST_AMOUNT).toFixed(
            2
          )}
          )
        </span>
        <div className={styles.card_area}>
          <div className={styles.card_area_body}>
            {state.userBalances[2][3] < Global.CONSTANTS.WETH_MINT_AMOUNT ? (
              <span>
                Not Enough
                <IceMintETHTooltip />
              </span>
            ) : null}

            <div className={styles.card}>
              {state.tokenAmounts.WETH_COST_AMOUNT} ETH
              <img src={Images.ETH_CIRCLE} className={styles.img_card2} />
            </div>

            {state.userBalances[2][3] >= Global.CONSTANTS.WETH_MINT_AMOUNT ? (
              <div className={styles.green_check}>
                {Number(state.userBalances[2][3]).toFixed(3)} ETH Available
                &nbsp;
                <svg
                  width="9"
                  height="8"
                  viewBox="0 0 9 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.83203 7.73047C4.10547 7.73047 4.32031 7.625 4.46875 7.40625L8.10547 1.86328C8.21094 1.70312 8.25391 1.55078 8.25391 1.41016C8.25391 1.03125 7.96484 0.75 7.57422 0.75C7.30859 0.75 7.14062 0.847656 6.97656 1.10156L3.81641 6.08594L2.21484 4.12109C2.06641 3.94141 1.90234 3.86328 1.67578 3.86328C1.28125 3.86328 0.996094 4.14453 0.996094 4.52734C0.996094 4.69922 1.04688 4.84766 1.19531 5.01562L3.21094 7.4375C3.37891 7.63672 3.57422 7.73047 3.83203 7.73047Z"
                    fill="#67DD6C"
                  />
                </svg>
              </div>
            ) : (
              <div className={styles.description}>
                {Number(state.userBalances[2][3]).toFixed(3)} ETH Available
              </div>
            )}

            <div className={styles.network}>(On Polygon)</div>
          </div>
          <p style={{ margin: '0px 8px 0px 8px' }}>+</p>
          <div className={styles.card_area_body}>
            {state.stakingBalances.BALANCE_USER_GOVERNANCE <
            Global.CONSTANTS.DG_STAKED_AMOUNT ? (
              <span className={styles.dgStackedSpan}>
                Not Enough Staked
                <IceMintDGStackedTooltip />
              </span>
            ) : null}

            <div className={styles.card} style={{ width: '150px' }}>
              {Global.CONSTANTS.DG_STAKED_AMOUNT} DG Staked
              <img
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1631325895/dgNewLogo_hkvlps.png"
                className={styles.img_card2}
              />
            </div>

            {state.stakingBalances.BALANCE_USER_GOVERNANCE >=
            Global.CONSTANTS.DG_STAKED_AMOUNT ? (
              <div className={styles.green_check}>
                {roundup(state.stakingBalances.BALANCE_USER_GOVERNANCE)} DG
                Staked &nbsp;
                <svg
                  width="9"
                  height="8"
                  viewBox="0 0 9 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.83203 7.73047C4.10547 7.73047 4.32031 7.625 4.46875 7.40625L8.10547 1.86328C8.21094 1.70312 8.25391 1.55078 8.25391 1.41016C8.25391 1.03125 7.96484 0.75 7.57422 0.75C7.30859 0.75 7.14062 0.847656 6.97656 1.10156L3.81641 6.08594L2.21484 4.12109C2.06641 3.94141 1.90234 3.86328 1.67578 3.86328C1.28125 3.86328 0.996094 4.14453 0.996094 4.52734C0.996094 4.69922 1.04688 4.84766 1.19531 5.01562L3.21094 7.4375C3.37891 7.63672 3.57422 7.73047 3.83203 7.73047Z"
                    fill="#67DD6C"
                  />
                </svg>
              </div>
            ) : (
              <div>
                <div className={styles.description}>
                  You must have at least {Global.CONSTANTS.DG_STAKED_AMOUNT} DG
                </div>
                <div className={styles.description}>
                  staked in governance to mint
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function roundup(num) {
    let decimalPlaces = 0;
    if (num < 0.1) {
      decimalPlaces = 2;
      num = Math.floor(num + 'e' + decimalPlaces);
    } else {
      decimalPlaces = 1;
      num = Math.round(num + 'e' + decimalPlaces);
    }

    return Number(num + 'e' + -decimalPlaces);
  }

  function description() {
    return (
      <Aux>
        <div className={styles.header}>
          Mint {props.wearableName} (ICE Rank 1)
        </div>

        <div className={styles.benefit_area}>
          Benefits
          <div className={styles.benefit_list}>
            <ul>
              <li>Get access to Play-to-Earn ICEpoker tables</li>
              <li>Daily free chip stack starting at 3,000 chips</li>
            </ul>
          </div>
        </div>

        <div className={styles.price_area}>
          Body Part Type
          <div className={styles.card_area}>
            <div className={styles.card_area_body}>
              <div className={styles.card}>
                {props.wearableBodyType}
                <img src={props.wearableBodyImg} className={styles.img_card2} />
              </div>
            </div>
          </div>
        </div>
      </Aux>
    );
  }

  function buttons() {
    return (
      <div className={styles.button_area}>
        {props.numberLeft ? (
          state.userBalances[2][3] < state.tokenAmounts.WETH_COST_AMOUNT ||
          state.stakingBalances.BALANCE_USER_GOVERNANCE <
            Global.CONSTANTS.DG_STAKED_AMOUNT ? (
            <Button className={styles.button_upgrade} disabled={true}>
              Mint Wearable
            </Button>
          ) : (
            <Button
              className={styles.button_upgrade}
              onClick={() => {
                setOpen(false);
                setOpenETHAuth(true);
              }}
            >
              Mint Wearable
            </Button>
          )
        ) : (
          <Button disabled className={styles.open_button}>
            Sold Out!
          </Button>
        )}

        <Button
          className={styles.button_close}
          onClick={() => {
            window.open(
              'https://ice.decentral.games/ice-nft-wearables',
              '_blank'
            );
          }}
        >
          Learn More
        </Button>
      </div>
    );
  }

  function ethAuthModal() {
    return (
      <ModalETHAuth
        itemID={props.itemID}
        address={props.address}
        wearableImg={props.wearableImg}
        show={openETHAuth}
        back={() => {
          setOpen(true);
          setOpenETHAuth(false);
        }}
        close={() => {
          setOpenETHAuth(false);
        }}
      />
    );
  }

  function closeButton() {
    return (
      <div className={styles.modal_wrapper}>
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

  return (
    <Aux>
      <Modal
        className={styles.mintable_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        trigger={
          <Button className={styles.wearable_button}>
            Mint New Wearable
          </Button>
        }
      >
        {closeButton()}

        <div className={styles.mint_wrapper}>
          {imageAndInfo()}

          <div className={styles.mint_box_right}>
            {description()}
            {priceAndStaked()}
            {buttons()}
          </div>
        </div>
      </Modal>

      {ethAuthModal()}
    </Aux>
  );
};

export default ModalMint;
