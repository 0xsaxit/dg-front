import { useEffect, useState, useContext } from 'react';
import ICEWearableCard from 'components/common/cards/ICEWearableCard';
import ICEDelegatedCard from 'components/common/cards/ICEDelegatedCard';
import { Button } from 'semantic-ui-react';
import styles from './Wearables.module.scss';
import Fetch from 'common/Fetch';
import { GlobalContext } from 'store';
import ModalDelegate from 'components/modal/ModalDelegate';
import ModalUpgradeSuccess from 'components/modal/ModalUpgradeSuccess';

const Wearables = () => {
  // define local variables
  const [state, dispatch] = useContext(GlobalContext);
  const [maxICEBonus, setMaxICEBonus] = useState(0);
  const activeWearables = state.iceWearableItems.filter(
    item =>
      item.isActivated &&
      item.bonus > 0
  );
  const delegatedWearables = state.iceDelegatedItems.filter(
    item => item.rank > 0
  );

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  return (
    <section className={styles.wearableSection}>
      <div className={styles.wearableHeader}>
        <div>
          <h2>ICE Wearables</h2>
          {!!state.iceWearableItems.length ||
          !!state.iceDelegatedItems.length ? (
            <p>{`(${activeWearables.length} of ${state.iceWearableItems.length} Active)`}</p>
          ) : null}
        </div>
        <Button className={styles.open_sea} href="/ice/marketplace">
          Mint Wearable
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
      </div>

      <section className={styles.grid_container}>
        {!!state.iceWearableItems.length || !!state.iceDelegatedItems.length ? (
          <div className={styles.wearables_grid}>
            {state.iceWearableItems.map((item, index) => {
              return (
                (item.tokenOwner === state.userAddress) 
                ? <ICEWearableCard item={item} key={index} />
                : null
              );
            })}

            {state.iceDelegatedItems.map((item, index) => (
              <ICEDelegatedCard item={item} key={index} />
            ))}
          </div>
        ) : (
          <div className={styles.no_ice_wearables}>No ICE Wearables</div>
        )}
      </section>
    </section>
  );
};

export default Wearables;
