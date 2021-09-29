import { useEffect, useContext } from 'react';
import { GlobalContext } from 'store/Context.js';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Footer from 'components/home/Footer';
import Global from '../../components/Constants';
import Images from '../../common/Images';
import styles from './Amnesia.module.scss';
import { Button } from 'semantic-ui-react';

// AMNESIA_COMMENT: this whole file should be deleted after we are done with amnesia
const Amnesia = () => {
  const [_, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    dispatch({ type: 'set_amnesia', data: true });

    return () => dispatch({ type: 'set_amnesia', data: false });
  }, []);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Amnesia'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.AMNESIA_SOCIAL_SHARE}
      />

      <main className={styles.container}>
        <section className={styles.top_section}>
          <div className={styles.central_container}>
            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1632930108/amnesia/amnesia_splash_wuozco.png" />

            <div className={styles.buttons_container}>
              <a
                href="https://decentralgames.substack.com/embed"
                target="_blank"
              >
                <Button className={styles.black_button}>Newsletter</Button>
              </a>

              <Button className={styles.blue_button}>RSVP</Button>
            </div>
          </div>
        </section>

        <section className={styles.bottom_section}>
          <section className={styles.content_container}>
            <div className={styles.artists_container}>
              <p className={styles.artists_text}>
                The world's biggests DJs,
                <br />
                live from the metaverse.
              </p>

              <div className={styles.artists}>
                <div className={styles.artists_background_asset_1} />
                <div className={styles.artists_background_asset_2} />

                <div className={styles.artists_top}>
                  <img
                    src={
                      'https://res.cloudinary.com/dnzambf4m/image/upload/v1632934438/amnesia/Luciano1_vwgk8u.jpg'
                    }
                  />

                  <img
                    src={
                      'https://res.cloudinary.com/dnzambf4m/image/upload/v1632934439/amnesia/Luciano_fndcro.jpg'
                    }
                  />
                </div>

                <div className={styles.artists_bottom}>
                  <img
                    src={
                      'https://res.cloudinary.com/dnzambf4m/image/upload/v1632934438/amnesia/Anfisia_Letyago_uw8q0f.jpg'
                    }
                  />

                  <img
                    src={
                      'https://res.cloudinary.com/dnzambf4m/image/upload/v1632934438/amnesia/Benny_Benassi_itii6q.jpg'
                    }
                  />

                  <img
                    src={
                      'https://res.cloudinary.com/dnzambf4m/image/upload/v1632934438/amnesia/Paul_Van_Dyk_eowhes.jpg'
                    }
                  />
                </div>
              </div>
            </div>

            <div className={styles.partners_container}>
              <h2 className={styles.title}>Launch Partners</h2>
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1632937137/amnesia/launch_partners_bhfroa.png" />

              <h2 className={styles.title}>Media Partners</h2>
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1632937365/amnesia/media_partners_j265hc.png" />
            </div>

            <div className={styles.dates_container}>
              <img
                className={styles.phase_1}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1632937683/amnesia/phase_1_asset_qxtpge.png"
              />
              <img
                className={styles.dates}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1632937729/amnesia/dates_phase_1_uaoubf.png"
              />

              <div className={styles.buttons_container}>
                <a
                  href="https://decentralgames.substack.com/embed"
                  target="_blank"
                >
                  <Button className={styles.black_button}>Newsletter</Button>
                </a>

                <Button className={styles.blue_button}>RSVP</Button>
              </div>
            </div>

            <div className={styles.clouds_top}></div>
            <div className={styles.clouds_bottom}></div>
          </section>
        </section>
        <Footer />
      </main>
    </Layout>
  );
};

export default Amnesia;
