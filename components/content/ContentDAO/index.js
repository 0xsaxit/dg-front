import { useContext } from 'react';
import { GlobalContext } from 'store';
import Overview from './Overview';
import Governance from './Governance';

const ContentDAO = props => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  if (props.content === 'Overview') {
    return <Overview />;
  } else if (props.content === 'Governance') {
    return <Governance />;
  }
};

export default ContentDAO;