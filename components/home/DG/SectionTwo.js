import { Button } from 'semantic-ui-react';
import cn from 'classnames';
import { useMediaQuery } from 'hooks';
import Aux from 'components/_Aux';
import styles from './DG.module.scss';
// import { useTranslation, withTranslation, Trans } from 'react-i18next';

function SectionTwo() {
  const mobile = useMediaQuery('(max-width: 767px)');
  const tablet = useMediaQuery('(max-width: 992px)');
  // const { t, i18n } = useTranslation();

  return (
    <Aux>
      <div className={cn(styles.section_two, 'container-fluid')}>
        <div className={styles.tout_container}>
          <h1 className={styles.tout_h1}>Wear NFTs, Play Poker, Earn ICE</h1>
          <p className={styles.tout_p}>
            Play to earn with free play poker in the metaverse. Beta is now
            live!
          </p>
          <div>
            {!mobile && (
              <img
                className={styles.tout_image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1632060620/Group_805_gxueoj.png"
                type="video/mp4"
              ></img>
            )}
            {mobile && (
              <img
                className={styles.tout_image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1632060620/Group_805_gxueoj.png"
                alt="img"
              />
            )}
          </div>
          <span className={styles.tout_span}>
            <Button className={styles.grey_button} href="/ice/getStarted">
              {mobile ? 'Start' : 'Get Started'}
            </Button>
            <Button
              className={styles.blue_button}
              href="https://play.decentral.games/dext"
              target="_blank"
            >
              {mobile ? 'Play' : 'Play Now'}
            </Button>
          </span>

          <a href="https://ice.decentral.games" target="_blank">
            <p className={styles.wp_text}>
              Read Whitepaper
              <svg
                style={{ margin: '0px 0px -1px 4px' }}
                width="10"
                height="10"
                viewBox="0 0 13 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z"
                  fill="white"
                />
              </svg>
            </p>
          </a>
        </div>

        <div
          className={cn(
            'row flex-md-row flex-column-reverse',
            styles.image_span,
            styles.text_group
          )}
        >
          <div
            className={cn(
              mobile
                ? 'col-md-6'
                : 'col-md-6 d-flex flex-column justify-content-center'
            )}
            style={{ position: 'relative', zIndex: '3' }}
          >
            <h1 className={styles.section_h1}>
              {/* {t('Home.PLAYTOEARN')} */}
              Play to Earn
            </h1>
            <p className={styles.section_p}>
              {/* {t('Home.PLAY_GAMES_META')} */}
              Play games in the metaverse and earn $DG token win or lose. Get up
              to 50% of your expected losses back in $DG.
            </p>

            <span className={styles.button_span}>
              <Button
                className={styles.grey_button}
                href="https://docs.decentral.games/"
                target="_blank"
              >
                {
                  mobile
                    ? 'Info' //t('Home.INFO')
                    : 'Learn More' //t('Home.LEARNMORE')
                }
              </Button>
              <Button
                className={styles.blue_button}
                href="/games"
                target="_blank"
              >
                {
                  mobile
                    ? 'Games' // t('Home.GAMES')
                    : 'See Games' // t('Home.SEEGAMES')
                }
              </Button>
            </span>
          </div>
          <div
            className={
              mobile
                ? 'col-xs d-flex justify-content-center'
                : 'col-md-6 d-flex justify-content-center'
            }
          >
            {!mobile && (
              <video
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/video/upload/v1626798440/Play_to_Earn_1_mrum0a.webm"
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
              ></video>
            )}
            {mobile && (
              <img
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/c_crop,h_1324,w_1950/v1626536789/Screen_Shot_2021-07-17_at_5.46.07_PM_p672iu.png"
                alt="img"
              />
            )}
          </div>
        </div>
      </div>

      <div className={cn(styles.section_two, 'container-fluid')}>
        <div className={cn('row', styles.image_span)}>
          <div
            className={
              mobile
                ? 'col-xs d-flex justify-content-center'
                : 'col-md-6 d-flex justify-content-center'
            }
          >
            {!mobile && (
              <video
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/video/upload/v1626798440/Wallet_1_k0dqit.webm"
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
                style={{ left: mobile ? 0 : tablet ? -72 : -100 }}
              ></video>
            )}
            {mobile && (
              <img
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1626804495/Screen_Shot_2021-07-17_at_5.45.43_PM_wv07nl.png"
                alt="img"
              />
            )}
          </div>

          <div
            className={cn(
              styles.text_group,
              mobile
                ? 'col-md-6'
                : 'col-md-6 d-flex flex-column justify-content-center'
            )}
            style={{ position: 'relative', zIndex: '3' }}
          >
            <h1 className={styles.section_h1}>
              {/* {t('Home.EARNAPY')} */}
              Earn APY%
            </h1>
            <p className={styles.section_p}>
              {/* {t('Home.STAKE_DG_GOVERNANCE')} */}
              Stake $DG in governance and earn up to 40% in yield rewards.
            </p>

            <span className={styles.button_span}>
              <Button
                className={styles.grey_button}
                href="https://docs.decentral.games/"
                target="_blank"
              >
                {
                  mobile
                    ? 'Info' //t('Home.INFO')
                    : 'Learn More' //t('Home.LEARNMORE')
                }
              </Button>
              <Button
                className={styles.blue_button}
                href="https://docs.decentral.games/getting-started/earn-dg-gov-rewards"
                target="_blank"
              >
                {
                  mobile
                    ? 'Earn' //t('Home.EARN')
                    : 'Earn APY%' //t('Home.EARNAPY')
                }
              </Button>
            </span>
          </div>
        </div>
      </div>

      <div className={cn(styles.section_two, 'container-fluid')}>
        <div
          className={cn(
            'row flex-md-row flex-column-reverse',
            styles.image_span,
            styles.text_group
          )}
        >
          <div
            className={cn(
              mobile
                ? 'col-md-6'
                : 'col-md-6 d-flex flex-column justify-content-center'
            )}
            style={{ position: 'relative', zIndex: '3' }}
          >
            <h1 className={styles.section_h1}>
              Vote in the DAO {/* {t('Home.VOTE_IN_THE_DAO')}  */}
              <br />
              (Be The House) {/* {t('Home.BE_THE_HOUSE')} */}
            </h1>
            <p className={styles.section_p}>
              {/* {t('Home.WITH_THE_DG_DAO')} */}
              With the $DG DAO, you own the casino. Control the profits, vote
              for new games, and decide on feature proposals.
            </p>

            <span className={styles.button_span}>
              <Button
                className={styles.grey_button}
                href="https://docs.decentral.games/"
                target="_blank"
              >
                {
                  mobile
                    ? 'Info' // t('Home.INFO')
                    : 'Learn More ' // t('Home.LEARNMORE')
                }
              </Button>
              <Button className={styles.blue_button} href="/dg/">
                {
                  tablet
                    ? 'Explore' // t('Home.EXPLORER')
                    : 'Explore Treasury' // t('Home.EXPLORER_THREASURY')
                }
              </Button>
            </span>
          </div>
          <div
            className={
              mobile
                ? 'col-xs d-flex justify-content-center'
                : 'col-md-6 d-flex justify-content-center'
            }
          >
            {!mobile && (
              <video
                className={cn(mobile ? styles.image_mobile : styles.image)}
                src="https://res.cloudinary.com/dnzambf4m/video/upload/v1626798440/Vote_ydj8br.webm"
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
              ></video>
            )}
            {mobile && (
              <img
                className={styles.image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1626804590/Screen_Shot_2021-07-17_at_5.45.16_PM_fo1juv.png"
                alt="img"
              />
            )}
          </div>
        </div>
      </div>
    </Aux>
  );
}

export default SectionTwo;

