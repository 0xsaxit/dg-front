import Head from 'next/head';
import { NextSeo } from 'next-seo';
import Global from './Constants';

const Header = (props) => {
  return (
    <div>
      <Head>
        <title>{props.title}</title>
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta property="og:image" content={props.image} />
        <meta property="og:url" content={Global.BASE_URL} />
        <meta name="twitter:site" content={Global.SOCIAL_HANDLE} />
      </Head>

      <NextSeo
        openGraph={{
          type: 'website',
          url: Global.BASE_URL,
          title: props.title,
          description: props.description,
          images: [
            {
              url: Global.BUTTER_CMS_URL,
              width: 800,
              height: 600,
              alt: props.title,
            },
          ],
        }}
      />
    </div>
  );
};

export default Header;
