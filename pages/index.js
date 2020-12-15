import Chateau from '../components/home/Chateau';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';
import { GlobalContext } from '../store';
import { useContext } from 'react';
import Spinner from '../components/Spinner';

const Index = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={
          Global.CONSTANTS.TITLE +
          ' | Metavarse Casinos Playable with Crypto'
        }
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userStatus === 3 ? (
        <Spinner background={3} />
      ) : (
        <Chateau />
      )}
    </Layout>
  );
};

export default Index;
