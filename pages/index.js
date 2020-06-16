import React from 'react';
import { NextSeo } from 'next-seo';
// import Menu from '../components/home/menu';
import Home from '../components/home/dashboard';
// import Head from 'next/head';
import Layout from '../components/layout.js';
import Global from '../components/constants';

export default class Index extends React.Component {
  render() {
    return (
      <Layout>
        {/* <html lang="en">
          <Head>
            <title> Decentral Games </title>
            <meta
              name="description"
              content="3D multiplayer games playable with cryptocurrency in Decentraland. Provably fair game logic, non-custodial accounts, immediate payouts. Sign up in seconds to play today!"
            />
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
        {/* <Menu dashboard={1} /> */}
        <Home />
      </Layout>
    );
  }
}
