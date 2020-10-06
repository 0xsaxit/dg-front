import Head from 'next/head';
import { NextSeo } from 'next-seo';
import Aux from './_Aux';
import Global from './Constants';

const Header = (props) => {
  return (
    <Aux>
      <Head>
        <title>{props.title}</title>
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta property="og:image" content={props.image} />
        <meta property="og:url" content={Global.CONSTANTS.BASE_URL} />
        <meta
          name="twitter:site"
          content={'@' + Global.CONSTANTS.SOCIAL_HANDLE}
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <NextSeo
        openGraph={{
          type: 'website',
          url: Global.CONSTANTS.BASE_URL,
          title: props.title,
          description: props.description,
          images: [
            {
              url: props.image,
              width: 800,
              height: 600,
              alt: props.title,
            },
          ],
        }}
      />
    </Aux>
  );
};

export default Header;
