import React from 'react';
import Aux from 'components/_Aux';
import NoWearablesSplash from './NoWearablesSplash';
import BalancesAndWearables from './BalancesAndWearables';
import Images from 'common/Images';
import styles from './Ice.module.scss';

function ICE({ state }) {
  console.log("*******************", state.iceWearableItemsLoading);

  return (
    <Aux>
      {!state.iceWearableItemsLoading && !state.iceDelegatedItemsLoading ? (
        <>
          {state.userStatus &&
          (!!state.iceWearableItems.length ||
            !!state.iceDelegatedItems.length) ? (
            <BalancesAndWearables />
          ) : (
            <NoWearablesSplash />
          )}
        </>
      ) : (
        <div className={styles.spinner_wrapper}>
          <img src={Images.LOADING_SPINNER} />
        </div>
      )}
    </Aux>
  );
}

export default ICE;
