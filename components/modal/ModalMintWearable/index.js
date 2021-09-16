import { useEffect, useContext, useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import ModalETHAuth from 'components/modal/ModalEthAuth'
import IceMintDGStackedTooltip from 'components/tooltips/IceMintDGStackedTooltip'
import styles from './ModalMintWearable.module.scss';
import Images from 'common/Images';

const ModalMint = props => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [safari, setSafari] = useState(false);

  // using Safari browser
  useEffect(() => {
    if (window.safari !== undefined) {
      setSafari(true);
    }
  }, []);

  return (
    <>
      <Modal
        className={styles.mintable_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        trigger={
          <Button className={styles.button_right}>Mint New Wearable</Button>
        }
      >
        <div className={styles.modal_wrapper}>
          <span className={styles.button_close} onClick={() => setOpen(false)}>
            <svg
              width="20"
              height="20"
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
        <div className={styles.mint_wrapper}>
          <div className={styles.mint_box}>
            <div className={styles.mint_box_purple}>
              <img
                src={props.wearableImg}
                className={styles.wearable_main_img}
              />
            </div>
            <div className={styles.card_body}>
              <div className={styles.card}>Rank 1</div>
              <div className={styles.card}>
                + 1 - 7%
                <img
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
                  className={styles.img_card}
                />
              </div>
              <div className={styles.card}>1 of 100</div>
            </div>
          </div>

          <div className={styles.mint_box_right}>
            <div className={styles.header}>Mint WEARABLE NAME (ICE Rank 1)</div>

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
                    <img
                      src={props.wearableBodyImg}
                      className={styles.img_card2}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.price_area}>
              Price <span>($521.21)</span>
              <div className={styles.card_area}>
                <div className={styles.card_area_body}>
                  {state.ethereumBal < 0.1 && <span>Not Enough</span>}
                  <div className={styles.card}>
                    0.1 ETH
                    <img src={Images.ETH_CIRCLE} className={styles.img_card2} />
                  </div>
                  <div className={styles.description}>0.0 ETH Available</div>
                  <div className={styles.network}>(On Mainnet)</div>
                </div>
                &nbsp;+&nbsp;
                <div className={styles.card_area_body}>
                  {state.stakingBalances.BALANCE_USER_GOVERNANCE < 1 ?
                    <span className={styles.dgStackedSpan}>
                      Not Enough Staked
                      <IceMintDGStackedTooltip />
                    </span>
                    : null}
                  <div className={styles.card} style={{ width: '150px' }}>
                    1 DG Staked
                    <img
                      src={Images.DG_COIN_LOGO}
                      className={styles.img_card2}
                    />
                  </div>
                  <div className={styles.description}>
                    You must have at least 1 DG
                  </div>
                  <div className={styles.description}>
                    staked in governance to mint
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.button_area}>
              {state.ethereumBal < 0.1 || state.stakingBalances.BALANCE_USER_GOVERNANCE < 1 ?
                <Button
                  className={styles.button_upgrade}
                  disabled={true}
                >
                  Mint Wearable
                </Button>
                :
                <ModalETHAuth
                  index={0}
                />
              }
              <Button className={styles.button_close}>Learn More</Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalMint;
