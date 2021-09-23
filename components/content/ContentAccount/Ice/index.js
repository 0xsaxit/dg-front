import React from 'react';
import Aux from 'components/_Aux';
import NoWearablesSplash from './NoWearablesSplash';
import BalancesAndWearables from './BalancesAndWearables';

function ICE({ state }) {
  return (
    <Aux>
      {state.userStatus && !!state.iceWearableItems.length ? (
        <BalancesAndWearables />
      ) : (
        <NoWearablesSplash />
      )}
    </Aux>
  );
}

export default ICE;
