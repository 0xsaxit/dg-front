import React, { useContext, useEffect } from 'react';
import Screen from '../../../components/blogdetail/screen';
import { GlobalContext } from '../../../store';
import { butter } from '../../../store/api';
import { Segment, Modal } from 'semantic-ui-react';
import { useRouter } from 'next/router';

// import { NextSeo } from 'next-seo';
// import Head from 'next/head';
// import Header from '../../../components/Header';

const BlogDetail = ({ page_title, featured_image, page_summary }) => {
  const router = useRouter();
  const [state, dispatch] = useContext(GlobalContext);
  const slug = router.query.id;
  const currentPage = state.pages.data.find((page) => page.slug === slug);
  const category = currentPage ? currentPage.categories[0].name : '';
  const filteredPages = state.pages.data.filter(
    (page) =>
      page.categories[0].name === category && page.slug !== currentPage.slug
  );
  const unfilteredPages = state.pages.data.filter(
    (page) => page.categories[0].name !== category
  );
  useEffect(() => {
    const getPages = async () => {
      const { data } = await butter.post.list({ page_size: 25 });
      dispatch({
        type: 'update_pages',
        data,
      });
    };
    getPages();
  }, []);

  return (
    <Segment vertical style={{ top: '75px' }}>
      {/* <html lang="en">
          <Head>
            <title> Decentral Games </title>
          </Head>
        </html>
         <NextSeo
              openGraph={{
                  type: 'website',
                  url: 'https://decentral.games',
                  title: page_title,
                  description: page_summary,
                  images: [
                          {
                              url: featured_image,
                              width: 800,
                              height: 600,
                              alt: page_title,
                          },
                  ],
              }}
          /> */}

      {/* <Header title={page_title} description={page_summary} image={featured_image} /> */}
        <div className="mobile-menu-dark-pages">
          <img
            className="mobile-menu-image"
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058640/authorize_title_v3ze35.png"
          />
        </div>
        <div className="mobile-menu-words dark">
          <a className="mobile-menu-item-1" href="/blog">
            {' '}
            BLOG{' '}
          </a>
          <a
            className="mobile-menu-item-2"
            href="https://docs.decentral.games"
            target="_blank"
          >
            {' '}
            DOCS{' '}
          </a>
          <Modal
            trigger={<a className="mobile-menu-item-2"> DEMO </a>}
            closeIcon
            basic
            size="small"
          >
            <Modal.Content>
              <iframe
                className="mobile-demo-video"
                src="https://www.youtube.com/embed/qklQZBooM-8?&autoplay=1"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </Modal.Content>
          </Modal>
        </div>
      {currentPage && (
        <Screen
          slug={currentPage.slug}
          image={currentPage.featured_image}
          created={currentPage.created}
          category={currentPage.categories[0]}
          title={currentPage.title}
          summary={currentPage.summary}
          author={currentPage.author}
          body={currentPage.body}
          filteredPages={filteredPages}
          unfilteredPages={unfilteredPages}
        />
      )}
    </Segment>
  );
};
BlogDetail.getInitialProps = async ({ query }) => {
  const slug = query.id;
  const { data } = await butter.post.list({ page_size: 25 });
  const currentPage = data.data.find((page) => page.slug === slug);
  var currentPage_title = currentPage.title;
  currentPage_title = currentPage_title.replace(': ', ':');
  currentPage_title = currentPage_title.replace(' - ', '-');
  return {
    page_title: currentPage_title,
    featured_image: currentPage.featured_image,
    page_summary: currentPage.summary,
  };
};
export default BlogDetail;
