import React from 'react';
import { NextSeo } from 'next-seo';
import Home from '../components/home/dashboard'
import Head from 'next/head';


export default class Index extends React.Component {
    render() {
        return (
          <>
            <html lang="en">
              <Head>
                <title> Decentral Games </title>
                <meta name="description" content="3D multiplayer games playable with cryptocurrency in Decentraland. Provably fair game logic, non-custodial accounts, immediate payouts. Sign up in seconds to play today!"/>
              </Head>
            </html>
                <NextSeo
                    openGraph={{
                        type: 'website',
                        url: 'https://decentral.games',
                        title: 'Decentral Games',
                        description: '3D multiplayer games playable with cryptocurrency in Decentraland. Provably fair game logic, non-custodial accounts, immediate payouts. Sign up in seconds to play today!',
                        images: [
                          {
                              url: 'https://cdn.buttercms.com/YzOXgTtkQOiqzTcyAWMg',
                              width: 800,
                              height: 600,
                              alt: 'Decentral Games',
                          },
                        ],
                    }}
                />
                <Home />
            </>
        )
    }
}
