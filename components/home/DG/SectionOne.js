import { Button, Icon } from 'semantic-ui-react';
import cn from 'classnames';
import { useMediaQuery } from 'hooks';
import Aux from 'components/_Aux';
import styles from './DG.module.scss';
// import { useTranslation, withTranslation, Trans } from 'react-i18next';

function SectionOne(props) {
  const mobile = useMediaQuery('(max-width: 576px)');
  //const { t, i18n } = useTranslation();

  return (
    <Aux>
      <video
        className={styles.video}
        id="my-video"
        src="https://res.cloudinary.com/dnzambf4m/video/upload/v1622134332/Full_Screen_Background_Animation_uo9h6b.webm"
        type="video/mp4"
        frameBorder="0"
        autoPlay={props.autoPlay}
        loop
        muted
      ></video>

      <div className={cn(styles.home_dashboard_content, 'container-fluid')}>
        <div
          className={cn(
            'row',
            styles.row,
            mobile ? 'text-center' : 'text-left'
          )}
        >
          <div className="col-md-12 col-lg-9 d-flex flex-column">
            <h1>
              {' '}
              {/* { t('Home.PLAY') } */}
              Play-to-earn gaming in the metaverse
            </h1>
            <p className={cn(styles.content, mobile ? 'px-6 mx-auto' : 'px-0')}>
              {mobile
                ? ''
                : 'With $DG, you are the house: You control the profits, vote on new games, and earn money back directly by playing' //t('Home.YOUAREHOUSE')
               }
            </p>
            <span className={styles.button_group}>
              <Button
                color="blue"
                className={styles.earn_dg_button}
                href="https://docs.decentral.games/"
                target="_blank"
              >
                {mobile ?
                  'Info' //t('Home.INFO') 
                  :
                  'Learn More' //t('Home.LEARNMORE')
                }
              </Button>
              <Button
                color="blue"
                className={styles.play_button}
                href="https://play.decentraland.org/?position=-118%2C135&realm=dg"
                target="_blank"
              >
                {mobile ?
                  'Play' //t('Home.PLAY') 
                  :
                  'Play Now' //t('Home.PLAYNOW')
                }
              </Button>
            </span>
          </div>
        </div>

        {/*<p className={styles.chevron_down}>
          <Icon name="chevron down" />
        </p>*/}
      </div>
    </Aux>
  );
}

export default SectionOne;