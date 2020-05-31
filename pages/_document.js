import Document, { Head, Main, NextScript } from 'next/document';


export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="shortcut icon" href="static/images/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/images/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/images/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/staticimages/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/js/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/static/images/safari-pinned-tab.svg"
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
          <link rel="manifest" href="/static/js/manifest.json" />
          <link rel="stylesheet" href="/static/css/blog.css" />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css?family=Lato:400,900&display=swap"
            rel="stylesheet"
            disabled
          />
          <script src="/static/js/ethereumjs-tx-1.3.3.min.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />

          {/* ----------------------------------------------------------- */}
          {/*                        DISCORD CHAT                         */}
          {/* ----------------------------------------------------------- */}
          <a className="Discord" target="_blank" href="/discord">
            <i className="Discord-icon Discord-icon--message material-icons">
              chat
            </i>

            <img
              className="Discord-icon Discord-icon--plane"
              src="../../static/images/discord-brand.svg"
            ></img>
            <div className="Discord-text">
              <span>
                Talk to us on
                <br />
                <strong>Discord</strong>
              </span>
            </div>
          </a>
        </body>
      </html>
    );
  }
}
