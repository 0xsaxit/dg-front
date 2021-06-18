import React from 'react';
import cn from 'classnames';
import { Grid, Image } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import GreaterThan from 'assets/svg/greaterthan.svg';
import styles from './Items.module.scss';

function Items({ state }) {
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
                <GreaterThan />
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
                      <p className={styles.nft_number}>
                        {' '}
                        {wearable.description.split(' ').slice(-1)}
                      </p>
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
                            Learn More
                          </button>
                        </a>
                        <a href={wearable.permalink}>
                          <button className={cn('btn', styles.sell_button)}>
                            Sell NFT
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
        <h1 className={styles.title}>
          POAPs
        </h1>
        {state.poaps.length !== 0 ? (
          <Grid className={styles.title_grid}>
            {state.poaps.map((poap, i) => (
              <Grid.Column computer={2} tablet={4} mobile={8} key={i}>
                <Image src={poap.image_url} className="poap-pic" />
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
}

export default Items;
