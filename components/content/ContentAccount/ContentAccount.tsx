import React, { ReactElement, useContext } from 'react';
import { GlobalContext } from '@/store';
import History from './History/History';
import Balances from './Balances/Balances';
import Referrals from './Referrals/Referrals';
import Items from './Items/Items';
import Ice from './Ice/Ice';

export interface ContentAccountType {
  className?: string;
}

export interface PageProps {
  content?: any;
}

const ContentAccount = (props: PageProps): ReactElement => {
  // get user's transaction history from the Context API store
  const [state] = useContext(GlobalContext);

  if (props.content === 'balances') {
    return <Balances />;
  } else if (props.content === 'ice') {
    return <Ice />;
  } else if (props.content === 'items') {
    return <Items />;
  } else if (props.content === 'history') {
    return <History />;
  } else if (props.content === 'referrals' && !!state.DGBalances.BALANCE_AFFILIATES.length) {
    return <Referrals />;
  }
};

export default ContentAccount;
