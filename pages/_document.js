import Document, { Html, Head, Main, NextScript } from 'next/document';
import Global from '../components/Constants';

export default class MyDocument extends Document {
  static async getServerSideProps(ctx) {
    const initialProps = await Document.getServerSideProps(ctx);
    return { ...initialProps };
  }

  segmentSnippet() {
    if (typeof window !== 'undefined') {
      // create a queue, but don't obliterate an existing one
      var analytics = (window.analytics = window.analytics || []);

      // if the real analytics.js is already on the page return
      if (analytics.initialize) return;

      // if the snippet was invoked already show an error
      if (analytics.invoked) {
        if (window.console && console.error) {
          console.error('Segment snippet included twice.');
        }
        return;
      }

      // invoked flag, to make sure the snippet is never invoked twice
      analytics.invoked = true;

      // list of the methods in Analytics.js to stub
      analytics.methods = [
        'trackSubmit',
        'trackClick',
        'trackLink',
        'trackForm',
        'pageview',
        'identify',
        'reset',
        'group',
        'track',
        'ready',
        'alias',
        'debug',
        'page',
        'once',
        'off',
        'on',
        'addSourceMiddleware',
        'addIntegrationMiddleware',
        'setAnonymousId',
        'addDestinationMiddleware',
      ];

      // define a factory to create stubs. These are placeholders for methods in Analytics.js so that you never have to wait
      // for it to load to actually record data. The `method` is stored as the first argument, so we can replay the data
      analytics.factory = function (method) {
        return function () {
          var args = Array.prototype.slice.call(arguments);
          args.unshift(method);
          analytics.push(args);
          return analytics;
        };
      };

      // for each of our methods, generate a queueing stub
      for (var i = 0; i < analytics.methods.length; i++) {
        var key = analytics.methods[i];
        analytics[key] = analytics.factory(key);
      }

      // define a method to load Analytics.js from our CDN, and that will be sure to only ever load it once
      analytics.load = function (key, options) {
        // create an async script element based on your key
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src =
          'https://cdn.segment.com/analytics.js/v1/' +
          key +
          '/analytics.min.js';

        // insert our script next to the first script element.
        var first = document.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
        analytics._loadOptions = options;
      };

      // add a version to keep track of what's in the wild.
      analytics.SNIPPET_VERSION = '4.1.0';

      // load Analytics.js with your key, which will automatically load the tools you've enabled for your account
      analytics.load(Global.SEGMENT_WRITE_KEY);

      // make the first page call to load the integrations
      // if you'd like to manually name or tag the page, edit or move this call however you'd like
      analytics.page();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="description" content={Global.CONSTANTS.DESCRIPTION} />
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
          <meta name="theme-color" content="#000000" />
          <meta
            name="google-site-verification"
            content="9aU-7WbT0IK2q6vq2v6jciIc8At4qeagmjmKNhVUhFE"
          />
          <link
            rel="manifest"
            href="/static/js/manifest.json"
            crossOrigin="use-credentials"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Lato:400,900&display=swap"
            rel="stylesheet"
            disabled
          />

          <script dangerouslySetInnerHTML={{ __html: this.segmentSnippet() }} />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
