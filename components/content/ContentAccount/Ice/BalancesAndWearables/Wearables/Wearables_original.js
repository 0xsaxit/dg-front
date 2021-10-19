import { useEffect, useState } from 'react';
import ICEWearableCard from 'components/common/cards/ICEWearableCard';
import { Button } from 'semantic-ui-react';
import styles from './Wearables.module.scss';

const Wearables = ({ state }) => {
  // define local variables
  // const [itemLimitsArray, setItemLimitsArray] = useState([
  //   [0, 0],
  //   [0, 0],
  //   [0, 0],
  //   [0, 0],
  //   [0, 0],
  // ]);
  const activeWearables = state.iceWearableItems.filter(
    item => item.meta_data && item.meta_data.attributes.at(-1).value > 0
  );
  const maxICEBonus = activeWearables.reduce((prev, current) => {
    let bonus = parseInt(current.meta_data.attributes.at(-1).value);
    if (bonus <= 7) {
      return 7 + prev;
    } else if (bonus <= 15) {
      return 15 + prev;
    } else if (bonus <= 24) {
      return 24 + prev;
    } else if (bonus <= 34) {
      return 34 + prev;
    } else if (bonus >= 35) {
      return 45 + prev;
    }
  }, 0);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   const itemLimit0 = state.itemLimits[0];
  //   const itemLimit5 = state.itemLimits[1];
  //   const itemLimit10 = state.itemLimits[2];
  //   const itemLimit15 = state.itemLimits[3];
  //   const itemLimit20 = state.itemLimits[4];

  //   let itemLimitsArray = [];
  //   itemLimitsArray.push(itemLimit0);
  //   itemLimitsArray.push(itemLimit5);
  //   itemLimitsArray.push(itemLimit10);
  //   itemLimitsArray.push(itemLimit15);
  //   itemLimitsArray.push(itemLimit20);

  //   setItemLimitsArray(itemLimitsArray);
  // }, [state.itemLimits]);

  return (
    <section className={styles.wearableSection}>
      <div className={styles.wearableHeader}>
        <div>
          <h2>ICED Wearables</h2>
          <p>{`(${activeWearables.length} of ${state.iceWearableItems.length} Active) ${maxICEBonus}% Max ICE Bonus`}</p>
        </div>
        <Button
          className={styles.open_sea}
          href="http://defi.atarichain.com/"
          target="_blank"
        >
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

      {console.log('item limits array index:')}
      {console.log(state.iceWearableItems)}

      <section className={styles.grid_container}>
        <div className={styles.wearables_grid}>
          {state.iceWearableItems.map((item, index) => (
            <ICEWearableCard
              data={item.meta_data}
              // key={index}
              tokenID={item.tokenID}
              // itemID={itemLimitsArray[index][1]}
              itemID={item.itemID}
            />
          ))}
        </div>
      </section>
    </section>
  );
};

export default Wearables;
