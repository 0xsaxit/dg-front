import History from './History';
import Balances from './Balances';
import Items from './Items';

const ContentAccount = props => {
  // get token balances from the Context API store
  if (props.content === 'balances') {
    return <Balances />;
  } else if (props.content === 'wearables') {
    return <Items state={state} />;
  } else if (props.content === 'play') {
    return <History state={state} />;
  } else if (props.content === 'referrals') {
    return <Referrals state={state} />;
  }
};

export default ContentAccount;
