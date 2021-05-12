import { useState, useContext } from 'react';
import cn from 'classnames';
import { Modal, Icon } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import styles from './ModalBreakdown.module.scss';
import Images from '../../../common/Images';

const coins = ['mana', 'dai', 'usdt', 'atri', 'eth'];
const coinNames = ['Decentraland', 'Dai', 'Tether', 'Atari', 'Ethereum'];

const ModalBreakdown = ({ breakdown }) => {
	// get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
	const totalAmount = coins.reduce((total, item) => {
		return total + Number(state.DGPrices[item]) * Number(breakdown[item]);
	}, 0).toFixed(2);
  // define local variables
  const [open, setOpen] = useState(false);

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
        <button
          disabled={!totalAmount}
          className={cn('btn btn-primary', styles.claim_button)}
        >
          Deposit Unclaimed Total (${Number(totalAmount).toFixed(2)})
        </button>
      }
    >
      <div className={styles.button_close}>
        <span onClick={() => setOpen(false)}>
          <Icon name="close" />
        </span>
      </div>
      <div>
        <h1 className={styles.title}>Total Earnings</h1>
        <p className={styles.subtitle}>Referral Earnings Breakdown</p>
        {coins.map((coin, index) => {
          return (
            <div className={cn("d-flex justify-content-between", styles.coin_line)}>
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
                  {Number(breakdown[coin]).toFixed(4)}
                </span>
                <span className={cn('mb-0', styles.coin_subtitle)}>
                  ${Number(state.DGPrices[coin] * breakdown[coin]).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
				<div className={cn("d-flex justify-content-between mb-3", styles.coin_line, styles.active)}>
					<div className="d-flex align-items-center">
						<img
							className={styles.circle_icon}
							src="https://res.cloudinary.com/dnzambf4m/image/upload/v1610421682/rwugnpwexjpfzfaiwdv1.png"
						/>
						<div className="d-flex flex-column">
							<span className={cn('mb-0', styles.coin_title)}>
								USD
							</span>
							<span className={cn('mb-0', styles.coin_subtitle)}>
								Total Value
							</span>
						</div>
					</div>
					<div className="d-flex flex-column align-items-end">
						<span className={cn('mb-0', styles.coin_title)}>
							${totalAmount}
						</span>
					</div>
				</div>
				<button className={cn("btn btn-primary w-100", styles.claim_button)}>Claim ${totalAmount}</button>
      </div>
    </Modal>
  );
};

export default ModalBreakdown;
