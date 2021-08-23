import React from 'react';
import cn from 'classnames';
import { Button } from 'semantic-ui-react';
import { useMediaQuery } from 'hooks';
import images from 'common/Images';
import styles from './DG.module.scss';

const FunctionThree = () => {
  const mobile = useMediaQuery('(max-width: 576px)');

  return (
    <>
      <div className={styles.our_partners}>
        <h1>Our Partners</h1>
        <div className="container">
          <div className={styles.row}>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.GBV} alt="GBV" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.DCG} alt="DCG" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.CLUSTER} alt="CLUSTER" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.AU21CAPITAL} alt="AU21CAPITAL" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
              style={{ width: '120px' }}
            >
              <img src={images.VEGAS} alt="VEGAS CITY" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.ID_THEORY} alt="ID THEORY" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.C_C} alt="C+C" />
            </div>
          </div>
          <div className={styles.row}>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.POLYGON} alt="POLYGON" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
              style={{ width: '120px' }}
            >
              <img src={images.DECENTRALAND} alt="DECENTRALAND" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.MAKER} alt="MAKER" />
            </div>
            <div
              className={cn(
                styles.image_section_atari,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.ATARI} alt="ATARI" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
              style={{ width: '210px' }}
            >
              <img src={images.BAYC} alt="BORED APE YACHT CLUB" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
              style={{ width: '150px' }}
            >
              <img src={images.BINANCE} alt="BINANCE" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.BICONOMY} alt="BICONOMY" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.IBIZA} alt="IBIZA" />
            </div>
            <div
              className={cn(
                styles.image_section,
                ' d-flex justify-content-center mb-5'
              )}
            >
              <img src={images.HASHKEY} alt="HASHKEY" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.get_started}>
        <p className={styles.sub_title}>How to start with $DG</p>
        <h2 className={styles.title}>Get Started</h2>
        <Button
          className={styles.start_here}
          href="/start"
        >
          Start Here
        </Button>
        {!mobile && (
          <video
            className={styles.dg_video}
            src="https://res.cloudinary.com/dnzambf4m/video/upload/c_crop,h_885,w_1920/v1626533688/macbook_animation_lkh0ut_1_wggkl1.webm"
            type="video/mp4"
            frameBorder="0"
            autoPlay={true}
            loop
            muted
          ></video>
        )}
      </div>
    </>
  );
};

export default FunctionThree;
