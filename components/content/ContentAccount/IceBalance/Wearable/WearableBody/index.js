import { useEffect, useState } from 'react';
import cn from 'classnames';
import Aux from 'components/_Aux';
import styles from './WearableBody.module.scss';
import WearableHeader from 'components/content/ContentAccount/IceBalance/Wearable/WearableHeader';
import ModalWearable from 'components/modal/ModalWearable';
import ModalMint from 'components/modal/ModalMint';
import ICEDWearableCard from 'components/modal/ICEDWearableCard';
import { times } from 'lodash';
import { ItemExtra } from 'semantic-ui-react';

function WearableBody({ state }) {
  // define local variables
  const [itemLimitsArray, setItemLimitsArray] = useState([
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  console.log(
    'state.DGBalances.BALANCE_CHILD_DG ============================= ',
    state.DGBalances.BALANCE_CHILD_DG
  );

  useEffect(() => {
    const itemLimit0 = state.itemLimits[0];
    const itemLimit5 = state.itemLimits[1];
    const itemLimit10 = state.itemLimits[2];
    const itemLimit15 = state.itemLimits[3];
    const itemLimit20 = state.itemLimits[4];

    let itemLimitsArray = [];
    itemLimitsArray.push(itemLimit0);
    itemLimitsArray.push(itemLimit5);
    itemLimitsArray.push(itemLimit10);
    itemLimitsArray.push(itemLimit15);
    itemLimitsArray.push(itemLimit20);

    setItemLimitsArray(itemLimitsArray);
  }, [state.itemLimits]);

  return (
    <Aux>
      <div className={styles.wearable}>
        <WearableHeader />
        {state.userStatus ? (
          <div className={cn('row', styles.wearable_card_container)}>
            {state.iceWearableItems.map((item, index) => (
              <div
                className={cn(
                  'col-lg-4 col-md-4 col-sm-6 col-xs-12',
                  styles.wearable_card
                )}
              >
                <ICEDWearableCard
                  tokenID={item.tokenID}
                  itemID={itemLimitsArray[index][1]}
                  url={item.meta_data.image}
                  desc={item.meta_data.description}
                  text={item.meta_data.name}
                  state={index + 1}
                  rank="Rank x"
                  bonus="+15%"
                  balance={state.DGBalances.BALANCE_CHILD_DG}
                  state={index + 1}
                />
              </div>
            ))}

            <div
              className={cn(
                'col-lg-4 col-md-4 col-sm-6 col-xs-12',
                styles.wearable_card
              )}
            >
              <ICEDWearableCard
                tokenID="abc"
                itemID="5"
                url="https://res.cloudinary.com/dnzambf4m/image/upload/v1630855008/bg_6_bc0ssa.png"
                desc="20% Max ICE Bonus"
                rank="Rank 5"
                bonus="+45%"
                text="Suit Bottoms"
                state="1"
              />
            </div>

            <div
              className={cn(
                'col-lg-4 col-md-4 col-sm-6 col-xs-12',
                styles.wearable_card
              )}
            >
              <ICEDWearableCard
                tokenID="def"
                itemID="10"
                url="https://res.cloudinary.com/dnzambf4m/image/upload/v1632102994/bg_6_nhrkwr.svg"
                address="0x23.."
                desc="30% Max ICE Bonus"
                rank="Rank 1"
                bonus="1 - 7%"
                text="Suit & Tie"
                balance={state.DGBalances.BALANCE_CHILD_DG}
                state="2"
              />
            </div>

            <div
              className={cn(
                'col-lg-4 col-md-4 col-sm-6 col-xs-12',
                styles.wearable_card
              )}
            >
              <ICEDWearableCard
                tokenID="ghi"
                itemID="15"
                url="https://res.cloudinary.com/dnzambf4m/image/upload/v1632102985/bg_6_g3d93e.svg"
                address="0x23.."
                desc="30% Max ICE Bonus"
                rank="Rank 2"
                bonus="+12%"
                text="Money Shades"
                state="3"
              />
            </div>
          </div>
        ) : (
          <div className={styles.wearable_container}>
            <img
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629713505/Group_191_pk1eoo.png"
              className={styles.wearable_img}
            />
            <p className={styles.play_text}>
              {' '}
              Play-to-Earn with ICE Wearables{' '}
            </p>
            <p className={styles.play_lower}>
              {' '}
              Purchase ICE wearables and earn real cash value from free-to-play
              metaverse poker.{' '}
            </p>
          </div>
        )}
      </div>
    </Aux>
  );
}

export default WearableBody;
