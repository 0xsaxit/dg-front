import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../../../../../store';
import cn from 'classnames';
import { Button } from 'semantic-ui-react';
import styles from './Balances.module.scss';
import Fetch from '../../../../../../common/Fetch';
import Aux from '../../../../../_Aux';

const Balances = ({ state }) => {
  // dispatch user's ICE amounts to the Context API store
  const [dispatch] = useContext(GlobalContext);

  // define local variables
  const [clicked, setClicked] = useState(false);
  const balenceItems = [
    {
      icon: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg',
      name: 'ICE',
      type: 'ICE',
      model: state.iceAmounts.ICE_AVAILABLE_AMOUNT,
      price: formatPrice(
        state.iceAmounts.ICE_CLAIM_AMOUNT * state.DGPrices.ice,
        2
      ),
    },
    {
      icon: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_XP_ICN_f9w2se.svg',
      name: 'Gameplay XP',
      type: 'XP',
      model: state.xpAmounts,
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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // after claiming rewards this code gets executed
  useEffect(() => {
    setClicked(false);
  }, [state.iceAmounts]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function formatPrice(balanceDG, units) {
    const balanceAdjusted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return balanceAdjusted;
  }

  function content() {
    return (
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
                <img className={styles.img + `${item.type}`} src={item.icon} />
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
                buyToken(item.type)
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function buyToken(type) {
    return (
      <Aux>
        {type === 'DG' ? (
          <Button
            className={styles.newLink}
            href="http://defi.atarichain.com/"
            target="_blank"
          >
            Buy {arrow()}
          </Button>
        ) : type === 'ICE' ? (
          <Button
            className={styles.newLink}
            href="http://defi.atarichain.com/"
            target="_blank"
          >
            Buy {arrow()}
          </Button>
        ) : null}
      </Aux>
    );
  }

  function arrow() {
    return (
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
    );
  }

  function claimBox() {
    return (
      <div className={styles.reward}>
        <p className={styles.reward_header}>Play-to-Earn Rewards</p>

        <div className={styles.reward_value}>
          <p className={styles.DG_value}>{state.iceAmounts.ICE_CLAIM_AMOUNT}</p>
          <img
            style={{ marginTop: '-4px' }}
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
          />
        </div>
        <p className={styles.price}>
          $
          {formatPrice(
            state.iceAmounts.ICE_CLAIM_AMOUNT * state.DGPrices.ice,
            2
          )}
        </p>

        {!clicked ? (
          <Button className={styles.claim_button} onClick={() => claimTokens()}>
            Claim {state.iceAmounts.ICE_CLAIM_AMOUNT} ICE
          </Button>
        ) : (
          <Button className={styles.claim_button} disabled>
            Claim {state.iceAmounts.ICE_CLAIM_AMOUNT} ICE
          </Button>
        )}

        <p className={styles.sell_all}>See All Rewards</p>
      </div>
    );
  }

  async function claimTokens() {
    console.log('Claiming ICE Rewards: ' + state.iceAmounts.ICE_CLAIM_AMOUNT);
    setClicked(true);

    try {
      const json = await Fetch.CLAIM_REWARDS();

      if (json.status) {
        console.log('Claim ICE rewards request successful');
        console.log('Claim ICE amount: ' + json.txHash);

        // update global state ice amounts
        const refresh = !state.refreshICEAmounts;
        dispatch({
          type: 'refresh_ice_amounts',
          data: refresh,
        });
      } else {
        console.log('Claim ICE rewards request error: ' + json.reason);

        setClicked(false);
      }
    } catch (error) {
      console.log(error); // API request timeount error

      setClicked(false);
    }
  }

  return (
    <div className={cn('row', styles.balance)}>
      <h2 className={styles.balance_title}>Current Balances</h2>

      <div className={cn('row', styles.content_container)}>
        {content()}

        <div
          className={cn(
            'col-lg-4 col-md-12 col-sm-12 col-xs-12',
            styles.reward_column
          )}
        >
          {claimBox()}
        </div>
      </div>
    </div>
  );
};

export default Balances;
