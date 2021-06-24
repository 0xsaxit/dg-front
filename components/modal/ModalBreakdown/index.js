import { useEffect, useContext, useState } from 'react';
import cn from 'classnames';
import Web3 from 'web3';
import { Modal, Icon } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Transactions from 'common/Transactions';
import Global from 'components/Constants';
import styles from './ModalBreakdown.module.scss';
import MetaTx from '../../../common/MetaTx';
import Images from '../../../common/Images';
import Biconomy from '@biconomy/mexa';

const coins = ['mana', 'dai', 'usdt', 'atri', 'eth'];
const coinNames = ['Decentraland', 'Dai', 'Tether', 'Atari', 'Ethereum'];

const ModalBreakdown = ({ breakdown = {}, totalAmount, address = null }) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [pointerContractNew, setPointerContractNew] = useState('');
  const [web3, setWeb3] = useState({});

  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize Web3 providers and create contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API_1,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      async function fetchData() {
        const pointerContractNew = await Transactions.pointerContractNew(
          getWeb3
        );
        setPointerContractNew(pointerContractNew);
      }

      fetchData();

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Gameplay Rewards');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  async function metaTransaction() {
    try {
      let functionSignature = pointerContractNew.methods
        .distributeAllTokens(state.userAddress, [
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ATRI,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH,
        ])
        .encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        7,
        functionSignature,
        pointerContractNew,
        state.userAddress,
        web3
      );

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);
      }

      setOpen(false);
    } catch (error) {
      console.log('Affiliate array not found: ' + error);
    }
  }

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
            disabled={
              !state.DGBalances.BALANCE_AFFILIATES.length || !totalAmount
            }
            className={cn('btn btn-primary', styles.claim_button_amount)}
          >
            <span className="d-md-flex d-none">
              Claim Referral Earnings (${Number(totalAmount).toFixed(3)})
            </span>
            <span className="d-md-none d-flex">
              Claim (${Number(totalAmount).toFixed(2)})
            </span>
          </button>
        ) : (
          <button className={cn('btn btn-dark', styles.breakdown_button)}>
            See Breakdown
          </button>
        )
      }
    >
      <div
        style={{
          marginTop: '-60px',
          marginBottom: '45px',
          marginLeft: '-48px',
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
      <div>
        <h1 className={styles.title}>
          {address
            ? address.slice(0, 5) + '...' + address.slice(-5)
            : 'Total Earnings'}
        </h1>
        <p className={styles.subtitle}>All Time Referral Earnings</p>
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
                  ${Number(state.DGPrices[coin] * breakdown[coin]).toFixed(2)}
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
          <button
            className={cn('btn btn-primary', styles.claim_button)}
            onClick={metaTransaction}
          >
            Claim ${Number(totalAmount).toFixed(3)}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ModalBreakdown;
