import { useContext } from 'react';
import { GlobalContext } from 'store';
import Balances from './Balances';
import Wearables from './Wearables';
import Aux from '../../../../_Aux';

const BalancesAndWearables = () => {
  const [state] = useContext(GlobalContext);
  return (
    <Aux>
      <Balances state={state} />
      <Wearables />
    </Aux>
  );
};

export default BalancesAndWearables;
