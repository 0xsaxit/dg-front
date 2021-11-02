import React from 'react';
import Aux from 'components/_Aux';
import NoWearablesSplash from './NoWearablesSplash';
import BalancesAndWearables from './BalancesAndWearables';
import Images from 'common/Images';
import styles from './Ice.module.scss';

function ICE({ state }) {
  return (
    <Aux>
      {!state.iceWearableItemsLoading && !state.iceDelegatedItemsLoading ? (
        <Aux>
          {state.userStatus &&
          (!!state.iceWearableItems.length ||
            !!state.iceDelegatedItems.length) ? (
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
