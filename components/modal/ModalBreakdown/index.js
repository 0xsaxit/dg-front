import { useEffect, useContext, useState } from 'react';
import cn from 'classnames';
import Web3 from 'web3';
import { Modal } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Transactions from 'common/Transactions';
import Global from 'components/Constants';
import MetaTx from 'common/MetaTx';
import Images from 'common/Images';
import Biconomy from '@biconomy/mexa';
import OpenIcon from 'assets/svg/open.svg';

import styles from './ModalBreakdown.module.scss';

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
      <div className={styles.open_icon}>
        <span className={styles.button_close} onClick={() => setOpen(false)}>
          <OpenIcon />
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
