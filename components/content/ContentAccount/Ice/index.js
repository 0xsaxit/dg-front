import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../../../store';
import Fetch from '../../../../common/Fetch';
import React from 'react';
import Aux from 'components/_Aux';
import NoWearablesSplash from './NoWearablesSplash';
import BalancesAndWearables from './BalancesAndWearables';
import Images from 'common/Images';
import styles from './Ice.module.scss';

const ICE = () => {

  // dispatch user's ICE amounts to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [totalICE, setTotalICE] = useState(0);

  useEffect(() => {
    (async () => {
      let json = await Fetch.ICE_AMOUNTS(state.userAddress);
      setTotalICE(json.totalUnclaimedAmount);
    })();
  }, [totalICE]);

  console.log('!!!');
  console.log(totalICE);

  return (
    <Aux>
      {!state.iceWearableItemsLoading && !state.iceDelegatedItemsLoading ? (
        <Aux>
          {state.userStatus &&
          (!!state.iceWearableItems.length ||
            !!state.iceDelegatedItems.length) ||
              totalICE >= 0 ? (
            <BalancesAndWearables />
          ) : (
            <NoWearablesSplash />
          )}
        </Aux>
      ) : (
        <div className={styles.spinner_wrapper}>
          <img src={Images.LOADING_SPINNER} />
        </div>
      )}
    </Aux>
  );
}

export default ICE;
