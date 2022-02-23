import React, { FC, ReactElement, useState, useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import Fetch from '../../../../common/Fetch';
import Aux from 'components/_Aux';
import NoWearablesSplash from './NoWearablesSplash/NoWearablesSplash';
import BalancesAndWearables from './BalancesAndWearables/BalancesAndWearables';
import Images from 'common/Images';
import styles from './Ice.module.scss';

export interface IceType {
  className?: string;
}

const Ice: FC<IceType> = ({ className = '' }: IceType): ReactElement => {
  // get user's transaction history from the Context API store
  const [state] = useContext(GlobalContext);

  // define local variables
  const [totalIce, setTotalIce] = useState(0);

  useEffect(() => {
    (async () => {
      const json = await Fetch.ICE_AMOUNTS(state.userAddress);

      setTotalIce(json.totalUnclaimedAmount);
    })();
  }, [totalIce]);

  return (
    <Aux>
      {!state.iceWearableItemsLoading && !state.iceDelegatedItemsLoading ? (
        <Aux>{(state.userStatus && (!!state.iceWearableItems.length || !!state.iceDelegatedItems.length)) || totalIce >= 0 ? <BalancesAndWearables /> : <NoWearablesSplash />}</Aux>
      ) : (
        <div className={styles.spinner_wrapper}>
          <img src={Images.LOADING_SPINNER} />
        </div>
      )}
    </Aux>
  );
};

export default Ice;
