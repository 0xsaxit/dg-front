import BlogHome from './blogHome';
import LayoutBlog from '../../components/LayoutBlog.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';

const Index = () => {
  return (
    <LayoutBlog>
      <Header
        title={Global.TITLE + ' | Blog'}
        description={Global.DESCRIPTION}
        image={Global.IMAGES.SOCIAL_SHARE}
      />

      <BlogHome />
    </LayoutBlog>
  );
};

export default Index;
