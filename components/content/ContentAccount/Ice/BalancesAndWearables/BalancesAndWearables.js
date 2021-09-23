import { useContext } from 'react';
import { GlobalContext } from 'store';
import Balances from './Balances';
import Wearables from './Wearables';

const BalancesAndWearables = () => {
  const [state] = useContext(GlobalContext);
  return (
    <>
      <Balances state={state} />
      <Wearables state={state} />
    </>
  );
};

export default BalancesAndWearables;
