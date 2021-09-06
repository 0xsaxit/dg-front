import React from 'react';
import cn from 'classnames';
import { Grid, Image } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import GreaterThan from 'assets/svg/greaterthan.svg';

import styles from './Items.module.scss';

const Items = ({ state }) => {
  // define local variables
  return (
    <Aux>
      <div className={styles.items_container}>
        <span className={styles.items_container_nfts}>
          <p className={styles.title}>NFTs</p>
          <a href={`https://opensea.io/${state.userAddress}`}>
            <button className={cn('btn', styles.all_button)}>
              <span>
                See All
                <svg
                  className="ml-2"
                  width="6"
                  height="9"
                  viewBox="0 0 6 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.56543 4.82715C5.56104 4.59424 5.48193 4.40967 5.29297 4.2251L1.98389 0.990723C1.84326 0.854492 1.68066 0.78418 1.47852 0.78418C1.07422 0.78418 0.740234 1.11377 0.740234 1.51367C0.740234 1.71582 0.82373 1.90039 0.977539 2.0542L3.84277 4.82275L0.977539 7.6001C0.82373 7.74951 0.740234 7.93408 0.740234 8.14062C0.740234 8.54053 1.07422 8.87012 1.47852 8.87012C1.67627 8.87012 1.84326 8.8042 1.98389 8.66357L5.29297 5.4292C5.48193 5.24463 5.56543 5.05566 5.56543 4.82715Z"
                    fill="white"
                  />
                </svg>
              </span>
            </button>
          </a>
        </span>
        {state.wearables.length !== 0 ? (
          <div className={styles.nft_grid}>
            {state.wearables.slice(0, 3).map((wearable, i) => (
              <div key={i} className={styles.nft_column}>
                <a href={wearable.permalink}>
                  <div className={styles.my_nfts}>
                    <span>
                      <Image
                        className={styles.nft_image}
                        src={wearable.image_url}
                      />
                    </span>

                    <div className={styles.nft_description}>
                      <p className={styles.nft_subheader}>
                        {' '}
                        {wearable.asset_contract.name}{' '}
                      </p>
                      <p className={styles.nft_name}>{wearable.name}</p>

                      <span className={styles.nft_wearable}>
                        <a href={wearable.permalink}>
                          <button className={cn('btn', styles.read_button)}>
                            Info
                          </button>
                        </a>
                        <a href={wearable.permalink}>
                          <button className={cn('btn', styles.sell_button)}>
                            Sell
                          </button>
                        </a>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.error_container}>
            <p className={styles.error_state}>No Wearable NFTs</p>
          </div>
        )}
      </div>

      <div className={styles.items_container}>
        <h1 className={styles.title}>POAPs</h1>
        {state.poaps.length !== 0 ? (
          <Grid className={styles.padding}>
            {state.poaps.map((poap, i) => (
              <Grid.Column computer={2} tablet={4} mobile={8} key={i}>
                <Image src={poap.image_url} />
              </Grid.Column>
            ))}
          </Grid>
        ) : (
          <div className={styles.error_container}>
            <p className={styles.error_state}>No POAPs</p>
          </div>
        )}
      </div>
    </Aux>
  );
};

export default Items;
