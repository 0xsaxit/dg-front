import Admin from "../components/admin/admin";
import { NextSeo } from 'next-seo';
import Head from 'next/head';


export default () => (
    <>
         <html lang="en">
          <Head>
            <title> Decentral Games </title>
          </Head>
        </html>   

    <NextSeo
        openGraph={{
            type: 'website',
            url: 'https://decentral.games',
            title: 'Decentral Games Admin',
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
    <Admin />
    </>
)