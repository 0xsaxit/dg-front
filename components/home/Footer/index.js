import { useEffect } from 'react';
import cn from 'classnames';
import { Accordion } from 'semantic-ui-react';
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
          <div className="d-flex flex-md-row flex-column w-100 mb-6">
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

              <div className={styles.input_placeholder}>Enter your email</div>
            </div>
          </div>
          {!onlyTablet && !mobile && (
            <div className={styles.cookie_container}>
              <span className={styles.copyright}>
                Copyright © 2021 Web4 LLC. All rights reserved
              </span>
              <div className="d-flex justify-content-between">
                <p className={styles.description}>
                  We use cookies to create a better experience.
                </p>
                <span className={styles.accept}>Accept</span>
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

          <div className={styles.input_placeholder}>Enter your email</div>
        </div>

        {mobile && (
          <div className={styles.cookie_container_tablet}>
            <span className={styles.copyright}>
              Copyright © 2021 Web4 LLC. All rights reserved
            </span>
          </div>
        )}
        {onlyTablet && (
          <div className={styles.cookie_container}>
            <span className={styles.copyright}>
              Copyright © 2021 Web4 LLC. All rights reserved
            </span>
            <div className="d-flex justify-content-between">
              <p className={styles.description}>
                We use cookies to create a better experience.
              </p>
              <span className={styles.accept}>Accept</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Footer;
