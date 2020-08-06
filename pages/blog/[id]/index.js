import BlogPages from './blogPages';
import LayoutBlog from '../../../components/LayoutBlog.js';
import Header from '../../../components/Header';
import Global from '../../../components/Constants';

const Index = ({ page_title, featured_image, page_summary }) => {
  return (
    <LayoutBlog>
      <Header
        title={page_title}
        description={page_summary}
        image={featured_image}
      />

      <BlogPages />
    </LayoutBlog>
  );
};

Index.getInitialProps = async ({ query }) => {
  const slug = query.id;
  const { data } = await Global.BUTTER.post.list({ page_size: 25 });
  const currentPage = data.data.find((page) => page.slug === slug);

  let currentPage_title = currentPage.title;
  currentPage_title = currentPage_title.replace(': ', ':');
  currentPage_title = currentPage_title.replace(' - ', '-');

  return {
    page_title: currentPage_title,
    featured_image: currentPage.featured_image,
    page_summary: currentPage.summary,
  };
};

export default Index;
