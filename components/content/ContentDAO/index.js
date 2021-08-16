import { useContext } from 'react';
import { GlobalContext } from 'store';
import Overview from './Overview';
import Governance from './Governance';
import Liquidity from './Liquidity';

const ContentDAO = props => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  if (props.content === 'Overview') {
    return <Overview />;
  } else if (props.content === 'Governance') {
    return <Governance />;
  } else if (props.content === 'Liquidity') {
    return <Liquidity />;
  }
};

export default ContentDAO;