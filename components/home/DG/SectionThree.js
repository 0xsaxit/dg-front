import React from 'react';
import { Button } from 'semantic-ui-react';
import { useMediaQuery } from 'hooks';
import images from 'common/Images';
import styles from './DG.module.scss';

const FunctionThree = () => {
  const mobile = useMediaQuery('(max-width: 499px)');

  return (
    <>
      <div className={styles.our_partners}>
        <h1>Our Partners</h1>
        <div className="container">
          <div className="row">
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.GBV} alt="GBV" />
            </div>
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.DCG} alt="DCG" />
            </div>
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.CLUSTER} alt="CLUSTER" />
            </div>
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.AU21CAPITAL} alt="AU21CAPITAL" />
            </div>
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.ID_THEORY} alt="ID THEORY" />
            </div>
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.C_C} alt="C+C" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.POLYGON} alt="POLYGON" />
            </div>
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.ATARI} alt="ATARI" />
            </div>
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.DECENTRALAND} alt="DECENTRALAND" />
            </div>
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.MAKER} alt="MAKER" />
            </div>
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.BICONOMY} alt="BICONOMY" />
            </div>
            <div className="col-md-2 col-sm-4 col-6 d-flex justify-content-center mb-5">
              <img src={images.IBIZA} alt="IBIZA" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.get_started}>
        <p className={styles.sub_title}>How to start with $DG</p>
        <h2 className={styles.title}>Get Started</h2>
        <Button
          className={styles.start_here}
          href="https://docs.decentral.games/getting-started/play-to-mine"
          target="_blank"
        >
          Start Here
        </Button>
        {!mobile && (
          <video
            className={styles.dg_video}
            src="https://res.cloudinary.com/dnzambf4m/video/upload/c_crop,w_1400/v1626139762/macbook_animation_lkh0ut.mov"
            type="video/mp4"
            frameBorder="0"
            autoPlay={true}
            loop
            muted
          ></video>
        )}
        {mobile && (
          <div style={{ height: '100px' }} />
        )}
      </div>
    </>
  );
};

export default FunctionThree;
