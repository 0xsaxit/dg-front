import Head from 'next/head';
import { NextSeo } from 'next-seo';
import Aux from './_Aux';
import Global from './Constants';

const Header = (props) => {
  function segmentSnippet() {
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

        <script dangerouslySetInnerHTML={{ __html: segmentSnippet() }} />
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
