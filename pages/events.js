import EventData from '../components/home/EventData';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';


const Events = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Events'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <EventData />
    </Layout>
  );
};

export default Events;