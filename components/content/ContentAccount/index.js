import { useContext } from 'react';
import { GlobalContext } from '@/store';
import History from './History';
import Balances from './Balances';
import Referrals from './Referrals';
import Items from './Items';
import Ice from './Ice';

const ContentAccount = props => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  if (props.content === 'balances') {
    return <Balances />;
  } else if (props.content === 'ice') {
    return <Ice state={state} />;
  } else if (props.content === 'items') {
    return <Items state={state} />;
  } else if (props.content === 'history') {
    return <History state={state} />;
  } else if (props.content === 'referrals' && !!state.DGBalances.BALANCE_AFFILIATES.length) {
    return <Referrals state={state} />;
  } 
};

export default ContentAccount;
