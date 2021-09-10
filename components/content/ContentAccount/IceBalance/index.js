import { React, useContext } from 'react';
import { GlobalContext } from 'store';

import Balance from 'components/content/ContentAccount/IceBalance/Balance';
import Wearable from 'components/content/ContentAccount/IceBalance/Wearable';

const IceBalances = () => {
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <>
      <Balance />
      <Wearable state={state} />
    </>
  );
};

export default IceBalances;
