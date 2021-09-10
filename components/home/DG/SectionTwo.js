import { Button } from 'semantic-ui-react';
import cn from 'classnames';
import { useMediaQuery } from 'hooks';
import Aux from 'components/_Aux';
import styles from './DG.module.scss';
import { useTranslation, withTranslation, Trans } from 'react-i18next';

function SectionTwo() {
  const mobile = useMediaQuery('(max-width: 767px)');
  const tablet = useMediaQuery('(max-width: 992px)');
  const { t, i18n } = useTranslation();

  return (
    <Aux>
      <div className={cn(styles.section_two, 'container-fluid')}>

        <div className={styles.tout_container}>
          <h1 className={styles.tout_h1}>Wear NFTs, Play Poker, Earn ICE</h1>
          <p className={styles.tout_p}>
            Play to earn with free play poker in the metaverse. Coming this October.
          </p> 
          <div>
            {!mobile && (
              <video
                className={styles.tout_image}
                src="https://res.cloudinary.com/dnzambf4m/video/upload/v1630492192/ICE_DIAMOND_HYPE_a8btgn.mp4"
                type="video/mp4"
                frameBorder="0"
                autoPlay={true}
                loop
                muted
              ></video>
            )}
            {mobile && (
              <img
                className={styles.tout_image}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630487859/ICE_ICON_hcsgvx.png"
                alt="img"
              />
            )}
          </div>
          <span
            className={styles.tout_span}
          >
            <Button
              className={styles.grey_button}
              href="/blog/decentral-games-announces-play-to-earn-metaverse-poker-ice-token-rollout"
              target="_blank"
            >
            {mobile ?
              'Blog' :
              'Announcement'
            }
            </Button>
            <Button
              className={styles.blue_button}
              href="https://ice.decentral.games"
              target="_blank"
            >
            {mobile ?
              'Info' :
              'White Paper'
            }
            </Button>
          </span>
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
            <h1 className={styles.section_h1}>{t('Home.PLAYTOEARN')}</h1>
            <p className={styles.section_p}>
              {t('Home.PLAY_GAMES_META')}
            </p>

            <span
              className={styles.button_span}
            >
              <Button
                className={styles.grey_button}
                href="https://docs.decentral.games/"
                target="_blank"
              >
              {mobile ?
                t('Home.INFO') :
                t('Home.LEARNMORE')
              }
              </Button>
              <Button
                className={styles.blue_button}
                href="/games"
                target="_blank"
              >
              {mobile ?
                t('Home.GAMES') :
                t('Home.SEEGAMES')
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
            <h1 className={styles.section_h1}>{t('Home.EARNAPY')}</h1>
            <p className={styles.section_p}>
              {t('Home.STAKE_DG_GOVERNANCE')}
            </p>

            <span
              className={styles.button_span}
            >
              <Button
                className={styles.grey_button}
                href="https://docs.decentral.games/"
                target="_blank"
              >
              {mobile ?
                t('Home.INFO') :
                t('Home.LEARNMORE')
              }
              </Button>
              <Button
                className={styles.blue_button}
                href="https://docs.decentral.games/getting-started/earn-dg-gov-rewards"
                target="_blank"
              >
              {mobile ?
                t('Home.EARN') :
                t('Home.EARNAPY')
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
              {t('Home.VOTE_IN_THE_DAO')} <br /> {t('Home.BE_THE_HOUSE')}
            </h1>
            <p className={styles.section_p}>
              {t('Home.WITH_THE_DG_DAO')}
            </p>

            <span
              className={styles.button_span}
            >
              <Button
                className={styles.grey_button}
                href="https://docs.decentral.games/"
                target="_blank"
              >
              {mobile ?
                t('Home.INFO') :
                t('Home.LEARNMORE')
              }
              </Button>
              <Button className={styles.blue_button} href="/dg/">
                {tablet ? t('Home.EXPLORER') : t('Home.EXPLORER_THREASURY')}
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

