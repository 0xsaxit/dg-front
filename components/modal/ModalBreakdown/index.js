import { useState, useContext, useEffect } from 'react';
import cn from 'classnames';
import { Modal, Icon } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Transactions from 'common/Transactions';
import Global from 'components/Constants';
import styles from './ModalBreakdown.module.scss';
import Images from '../../../common/Images';

const coins = ['mana', 'dai', 'usdt', 'atri', 'eth'];
const coinNames = ['Decentraland', 'Dai', 'Tether', 'Atari', 'Ethereum'];

const ModalBreakdown = ({ breakdown = {}, totalAmount, address = null }) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  
  // define local variables
  const [open, setOpen] = useState(false);
  const [pointerContractNew, setPointerContractNew] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); 
        const pointerContractNew = await Transactions.pointerContractNew(
          maticWeb3
        );
        setPointerContractNew(pointerContractNew);
      } catch (error) {
        console.log(error);
      }

      fetchData();
    }
  }, []);

  const metaTransaction = async () => {
    try {
      await pointerContractNew.methods
        .distributeAllTokens(
          state.userAddress,
          [
            Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT, 
            Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI,
            Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA,
            Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ATRI,
            Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH
          ]
        )
        .call();
    } catch (error) {
      console.log('Affiliate array not found: ' + error);
    }
  };

  return (
    <Modal
      className={styles.menu_info_modal}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      size="tiny"
      centered={true}
      trigger={
        !address ? (
          <button
            disabled={!state.DGBalances.BALANCE_AFFILIATES.length || !totalAmount}
            className={cn('btn btn-primary', styles.claim_button)}
          >
            Claim Referral Earnings (${Number(totalAmount).toFixed(3)})
          </button>
        ) : (
          <button
            className={cn('btn btn-dark', styles.claim_button)}
          >
						See Breakdown
          </button>
        )
      }
    >
      <div className={styles.button_close}>
        <span onClick={() => setOpen(false)}>
          <Icon name="close" />
        </span>
      </div>
      <div>
        <h1 className={styles.title}>{address ? address.slice(0, 5) + '...' + address.slice(-5) : 'Total Earnings'}</h1>
        <p className={styles.subtitle}>Referral Earnings Breakdown</p>
        {coins.map((coin, index) => {
          return (
            <div
              className={cn('d-flex justify-content-between', styles.coin_line)}
            >
              <div className="d-flex align-items-center">
                <img
                  className={styles.circle_icon}
                  src={Images[`${coin.toUpperCase()}_CIRCLE`]}
                />
                <div className="d-flex flex-column">
                  <span className={cn('mb-0', styles.coin_title)}>
                    {coin.toUpperCase()}
                  </span>
                  <span className={cn('mb-0', styles.coin_subtitle)}>
                    {coinNames[index]}
                  </span>
                </div>
              </div>
              <div className="d-flex flex-column align-items-end">
                <span className={cn('mb-0', styles.coin_title)}>
                  {Number(breakdown[coin]).toFixed(3)}
                </span>
                <span className={cn('mb-0', styles.coin_subtitle)}>
                  ${Number(state.DGPrices[coin] * breakdown[coin]).toFixed(3)}
                </span>
              </div>
            </div>
          );
        })}
        <div
          className={cn(
            'd-flex justify-content-between mb-3',
            styles.coin_line,
            styles.active
          )}
        >
          <div className="d-flex align-items-center">
            <img
              className={styles.circle_icon}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1610421682/rwugnpwexjpfzfaiwdv1.png"
            />
            <div className="d-flex flex-column">
              <span className={cn('mb-0', styles.coin_title)}>USD</span>
              <span className={cn('mb-0', styles.coin_subtitle)}>
                Total Value
              </span>
            </div>
          </div>
          <div className="d-flex flex-column align-items-end">
            <span className={cn('mb-0', styles.coin_title)}>
              ${Number(totalAmount).toFixed(3)}
            </span>
          </div>
        </div>
        {!address && (
          <button className={cn('btn btn-primary w-100', styles.claim_button)} onClick={metaTransaction}>
            Claim ${Number(totalAmount).toFixed(3)}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ModalBreakdown;
