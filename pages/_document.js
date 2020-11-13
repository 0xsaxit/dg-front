import Document, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from '@emotion/server';
import Global from '../components/Constants';

export default class MyDocument extends Document {

  static async getServerSideProps(ctx) {
    const initialProps = await Document.getServerSideProps(ctx);
    return { ...initialProps };
  }

  static getInitialProps({ renderPage }) {
    const page = renderPage();
    const styles = extractCritical(page.html);
    return {
      ...page,
      ...styles
    }
  }

  constructor(props) {
    super(props);
    const { __NEXT_DATA__, ids } = props;

    if (ids) {
      __NEXT_DATA__.ids = ids;
    }
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="description" content={Global.CONSTANTS.DESCRIPTION} />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
          <link rel="stylesheet" href="/static/css/blog.css" />
          <link rel="stylesheet" href="/static/css/main.css" />
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
          <link
            rel="manifest"
            href="/static/js/manifest.json"
            crossorigin="use-credentials"
          />
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
        </body>
        
      </html>
    );
  }
}

