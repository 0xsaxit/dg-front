import { React, useContext } from 'react';
import { GlobalContext } from 'store';

import Balance from 'components/content/ContentAccount/IceBalance/Balance';
import Wearable from 'components/content/ContentAccount/IceBalance/Wearable/WearableBody';

const IceBalances = () => {
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <>
      {state.userStatus < 20 ? (
        null
      ) : (
        <div>
          <Balance />
          <Wearable state={state} />
        </div>
      )}
    </>
  );
};

export default IceBalances;
