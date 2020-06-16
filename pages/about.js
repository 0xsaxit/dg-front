import About from '../components/home/about';
import { NextSeo } from 'next-seo';
// import Head from 'next/head';
import Layout from '../components/layout.js';
import Global from '../components/constants';

export default () => (
  <Layout>
    {/* <html lang="en">
      <Head>
        <title> Decentral Games </title>
      </Head>
    </html> */}

    <NextSeo
      openGraph={{
        type: 'website',
        url: Global.BASE_URL,
        title: Global.TITLE,
        description: Global.DESCRIPTION,
        images: [
          {
            url: Global.BUTTER_CMS_URL,
            width: 800,
            height: 600,
            alt: Global.TITLE,
          },
        ],
      }}
    />
    <About />
  </Layout>
);
