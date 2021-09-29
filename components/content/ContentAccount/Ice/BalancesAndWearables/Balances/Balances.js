import cn from 'classnames';
import { Button } from 'semantic-ui-react';
import styles from './Balances.module.scss';

// get user's unclaimed DG balance from the Context API store
const Balances = ({ state }) => {
  function formatPrice(balanceDG, units) {
    const balanceAdjusted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return balanceAdjusted;
  }

  const balenceItems = [
    {
      icon: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg',
      name: 'ICE',
      type: 'ICE',
      model: state.iceAmount,
      price: '0.00',
    },
    {
      icon: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_XP_ICN_f9w2se.svg',
      name: 'Gameplay XP',
      type: 'XP',
      model: '0 XP',
      price: '0.00',
    },
    {
      icon: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631325895/dgNewLogo_hkvlps.png',
      name: 'Decentral Games',
      type: 'DG',
      model: formatPrice(state.DGBalances.BALANCE_CHILD_DG, 3),
      price: formatPrice(
        state.DGBalances.BALANCE_CHILD_DG * state.DGPrices.dg,
        2
      ),
    },
  ];

  return (
    <div className={cn('row', styles.balance)}>
      <h2 className={styles.balance_title}>Current Balances</h2>
      <div className={cn('row', styles.content_container)}>
        <div
          className={cn(
            'col-lg-8 col-md-12 col-sm-12 col-xs-12',
            styles.balance_column
          )}
        >
          {balenceItems.map((item, index) => (
            <div className={styles.balance_row} key={index}>
              <div className={styles.float_left}>
                <span className={styles.img_left}>
                  <img
                    className={styles.img + `${item.type}`}
                    src={item.icon}
                  />
                </span>
                <div className={styles.balance_column_header}>
                  <p className={styles.bold_text}>{item.name}</p>
                  <p className={styles.bold_text}>{item.type}</p>
                </div>
              </div>

              <div className={styles.float_right}>
                <div className={styles.text_wrapper}>
                  <p className={styles.bold_text}>{item.model}</p>
                  <p className={styles.bold_text}>${item.price}</p>
                </div>
                {index === 1 ? (
                  <div className={styles.newLink_gamePlay}>
                    <h3>ONLY THROUGH</h3>
                    <h1>Gameplay</h1>
                  </div>
                ) : (
                  <Button
                    className={styles.newLink}
                    href="http://defi.atarichain.com/"
                    target="_blank"
                  >
                    Buy
                    <svg
                      width="13"
                      height="12"
                      viewBox="0 0 13 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z"
                        fill="white"
                      />
                    </svg>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          className={cn(
            'col-lg-4 col-md-12 col-sm-12 col-xs-12',
            styles.reward_column
          )}
        >
          <div className={styles.reward}>
            <p className={styles.reward_header}>Play-to-Earn Rewards</p>
            <div className={styles.reward_value}>
              <p className={styles.DG_value}>1830</p>
              <img
                style={{ marginTop: '-4px' }}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
              />
            </div>
            <p className={styles.price}>$109.32</p>
            <Button className={styles.claim_button}>Claim 1,830 ICE</Button>
            <p className={styles.sell_all}>See All Rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balances;
