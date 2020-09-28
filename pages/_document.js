import Document, { Head, Main, NextScript } from 'next/document';
import { useState, useEffect, useContext } from 'react'

export default class MyDocument extends Document {
  static async getServerSideProps(ctx) {
    const initialProps = await Document.getServerSideProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="description" content="3D multiplayer games playable with cryptocurrency in Decentraland. Provably fair game logic, non-custodial accounts, immediate payouts. Sign up in seconds to play today!" />
          <link
            rel="shortcut icon"
            href="https://res.cloudinary.com/dnzambf4m/image/upload/v1593691630/favicon_ofugym.ico"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="https://res.cloudinary.com/dnzambf4m/image/upload/v1593694291/apple-touch-icon_tmocum.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="https://res.cloudinary.com/dnzambf4m/image/upload/v1593691629/favicon-32x32_kuowrj.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="https://res.cloudinary.com/dnzambf4m/image/upload/v1593691629/favicon-16x16_btdy9a.png"
          />
          <link rel="manifest" href="/static/js/site.webmanifest" />
          <link
            rel="mask-icon"
            href="https://res.cloudinary.com/dnzambf4m/image/upload/v1593959829/safari-pinned-tab_brhtah.svg"
            color="#0086f4"
          />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="theme-color" content="#000000" />
          <meta
            name="google-site-verification"
            content="9aU-7WbT0IK2q6vq2v6jciIc8At4qeagmjmKNhVUhFE"
          />
          <link rel="manifest" href="/static/js/manifest.json" crossorigin="use-credentials" />
          <link rel="stylesheet" href="/static/css/blog.css" />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Lato:400,900&display=swap"
            rel="stylesheet"
            disabled
          />
        </Head>
        <body>
          <Main />
          <NextScript />

          {/* ----------------------------------------------------------- */}
          {/*                        DISCORD CHAT                         */}
          {/* ----------------------------------------------------------- */}

          <div className="discord-outter-container">
            <div className="discord-container">
              <a className="Discord" target="_blank" href="/discord">
                <i className="Discord-icon Discord-icon--message material-icons">
                  chat
                </i>

                <img
                  className="Discord-icon Discord-icon--plane"
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1593959829/discord-brand_swndx8.svg"
                ></img>
                <div className="Discord-text">
                  <span>
                    Talk to us on
                    <br />
                    <strong>Discord</strong>
                  </span>
                </div>
              </a>
            </div>
          </div>

        </body>
      </html>
    );
  }
}
