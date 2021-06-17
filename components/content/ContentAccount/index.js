import { useContext } from 'react';
import { GlobalContext } from 'store';
import History from './History';
import Balances from './Balances';
import Referrals from './Referrals';
import Items from './Items';

const ContentAccount = props => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  console.log('!!!');
  console.log(state.userInfo.tokenArray);

  if (props.content === 'balances') {
    return <Balances />;
  } else if (props.content === 'items') {
    return <Items state={state} />;
  } else if (props.content === 'history') {
    return <History state={state} />;
  } else if (props.content === 'referrals') {
    return <Referrals state={state} />;
  }
};

export default ContentAccount;
