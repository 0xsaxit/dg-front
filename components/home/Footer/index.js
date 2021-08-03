import { useEffect } from 'react';
import cn from 'classnames';
import { Button } from 'semantic-ui-react';
import { useMediaQuery } from 'hooks';
import Link from 'next/link';
import styles from './Footer.module.scss';

const Footer = () => {
  // define local variables
  let linkDocs = '';
  const mobile = useMediaQuery('(max-width: 768px)');
  const onlyTablet = useMediaQuery(
    '(min-width: 768px) and (max-width: 1200px)'
  );

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    linkDocs = document.getElementById('docs-footer');
  }, []);

  useEffect(() => {
    if (linkDocs) {
      analytics.trackLink(linkDocs, 'Clicked DOCS link (footer)');
    }
  }, [linkDocs]);

  return (
    <>
      <div className={styles.footer_container}>
        <div className={cn(styles.grid_container, 'd-flex flex-column')}>
          <div
            className={cn(
              'd-flex flex-md-row flex-column w-100',
              mobile ? 'mb-0' : 'mb-6'
            )}
          >
            <span className={styles.grid_column}>
              <p className={styles.footer_header}> Token </p>
              <Link href="/dg">
                <p className={styles.footer_link}> Treasury </p>
              </Link>
              <Link href="/dg/governance">
                <p className={styles.footer_link}> Governance </p>
              </Link>
              <Link href="/dg/mining">
                <p className={styles.footer_link}> Gameplay </p>
              </Link>
              <Link href="/dg/liquidity">
                <p className={styles.footer_link}> Liquidity </p>
              </Link>
            </span>

            <span className={styles.grid_column}>
              <p className={styles.footer_header}> Play </p>
              <Link href="/games">
                <p className={styles.footer_link}> Games </p>
              </Link>
              <Link href="/games/casinos">
                <p className={styles.footer_link}> Casino </p>
              </Link>
              <Link href="/games/leaderboard">
                <p className={styles.footer_link}> Leaderboard </p>
              </Link>
            </span>

            <span className={styles.grid_column}>
              <p className={styles.footer_header}> Shop </p>
              <Link href="/games/nfts">
                <p className={styles.footer_link}> NFTs </p>
              </Link>
              <Link href="/games/shop">
                <p className={styles.footer_link}> DCL Shops </p>
              </Link>
            </span>

            <span className={styles.grid_column}>
              <p className={styles.footer_header}> News </p>
              <Link href="/blog">
                <p className={styles.footer_link}> News </p>
              </Link>
              <Link href="/blog">
                <p className={styles.footer_link}> Blog </p>
              </Link>
            </span>

            <span className={styles.grid_column}>
              <p className={styles.footer_header}> Events </p>
              <Link href="/events">
                <p className={styles.footer_link}> All Events </p>
              </Link>
            </span>
            <div className={styles.grid_newsletter}>
              <p className={styles.footer_header}> Join Our Newsletter! </p>
              <Link href="/events">
                <p className={styles.footer_text}>
                  {' '}
                  Subscribe to our newsletter to stay up to date with our weekly
                  updates.{' '}
                </p>
              </Link>

              <div className={styles.input_placeholder}>
                {' '}
                <Button
                  color="blue"
                  className={styles.sign_up_newsletter}
                  href="https://decentralgames.substack.com/embed"
                  target="_blank"
                >
                  Sign Up For Substack
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.6152 13.2617V2.50879C17.6152 1.50977 16.9385 0.822266 15.9287 0.822266H5.16504C4.21973 0.822266 3.51074 1.54199 3.51074 2.40137C3.51074 3.26074 4.24121 3.92676 5.1543 3.92676H9.21484L12.5342 3.80859L10.6758 5.46289L1.28711 14.8623C0.932617 15.2168 0.739258 15.6357 0.739258 16.0654C0.739258 16.9033 1.52344 17.6982 2.37207 17.6982C2.80176 17.6982 3.20996 17.5049 3.5752 17.1504L12.9746 7.76172L14.6396 5.90332L14.5 9.10449V13.2725C14.5 14.1963 15.166 14.916 16.0254 14.916C16.8955 14.916 17.6152 14.1855 17.6152 13.2617Z"
                      fill="white"
                    ></path>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          {!onlyTablet && !mobile && (
            <div className={styles.cookie_container}>
              <span className={styles.copyright}>
                Copyright © 2021 Web4 LTD. All rights reserved
              </span>
              <div className="d-flex justify-content-between">
                <p className={styles.description}>
                  We use cookies to create a better experience.
                </p>
                {/*<span className={styles.accept}>Accept</span>*/}
              </div>
            </div>
          )}
        </div>

        <div className={styles.grid_newsletter_tablet}>
          <p className={styles.footer_header}> Join Our Newsletter! </p>
          <Link href="/events">
            <p className={styles.footer_text}>
              {' '}
              Subscribe to our newsletter to stay up to date with our weekly
              updates.{' '}
            </p>
          </Link>

          <div className={styles.input_placeholder}>
            {' '}
            <Button
              color="blue"
              className={styles.sign_up_newsletter}
              href="https://decentralgames.substack.com/embed"
              target="_blank"
            >
              Sign Up For Substack
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.6152 13.2617V2.50879C17.6152 1.50977 16.9385 0.822266 15.9287 0.822266H5.16504C4.21973 0.822266 3.51074 1.54199 3.51074 2.40137C3.51074 3.26074 4.24121 3.92676 5.1543 3.92676H9.21484L12.5342 3.80859L10.6758 5.46289L1.28711 14.8623C0.932617 15.2168 0.739258 15.6357 0.739258 16.0654C0.739258 16.9033 1.52344 17.6982 2.37207 17.6982C2.80176 17.6982 3.20996 17.5049 3.5752 17.1504L12.9746 7.76172L14.6396 5.90332L14.5 9.10449V13.2725C14.5 14.1963 15.166 14.916 16.0254 14.916C16.8955 14.916 17.6152 14.1855 17.6152 13.2617Z"
                  fill="white"
                ></path>
              </svg>
            </Button>
          </div>
        </div>

        {mobile && (
          <div className={styles.cookie_container_tablet}>
            <span className={styles.copyright}>
              Copyright © 2021 Web4 LTD. All rights reserved
            </span>
          </div>
        )}
        {onlyTablet && (
          <div className={styles.cookie_container}>
            <span className={styles.copyright}>
              Copyright © 2021 Web4 LTD. All rights reserved
            </span>
            <div className="d-flex justify-content-between">
              <p className={styles.description}>
                We use cookies to create a better experience.
              </p>
              {/*<span className={styles.accept}>Accept</span>*/}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Footer;