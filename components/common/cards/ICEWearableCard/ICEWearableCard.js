import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../../store';
import Fetch from '../../../../common/Fetch';
import IceP2EEnabledTooltip from 'components/tooltips/IceP2EEnabledTooltip';
import IceNeedToActivateTooltip from 'components/tooltips/IceNeedToActivateTooltip';
import IceWearableBonusTooltip from 'components/tooltips/IceWearableBonusTooltip';
import ModalDelegate from 'components/modal/ModalDelegate';
import ModalWithdrawDelegation from 'components/modal/ModalWithdrawDelegation';
import ActivateWearableModal from 'components/modal/ActivateWearableModal';
import NeedMoreDGActivateModal from 'components/modal/NeedMoreDGActivateModal';
import ModalWearable from 'components/modal/ModalWearable';
import styles from './ICEWearableCard.module.scss';

const getRank = bonus => {
  if (bonus === 0) {
    return { value: 0, percentage: '0%' };
  } else if (bonus >= 1 && bonus <= 7) {
    return { value: 1, percentage: '+' + bonus + '%' };
  } else if (bonus >= 8 && bonus <= 15) {
    return { value: 2, percentage: '+' + bonus + '%' };
  } else if (bonus >= 16 && bonus <= 24) {
    return { value: 3, percentage: '+' + bonus + '%' };
  } else if (bonus >= 25 && bonus <= 34) {
    return { value: 4, percentage: '+' + bonus + '%' };
  } else if (bonus >= 35 && bonus <= 45) {
    return { value: 5, percentage: '+' + bonus + '%' };
  }
};

const ICEWearableCard = props => {
  // get user's wallet address from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isDelegated, setIsDelegated] = useState(false);
  const [delegateAddress, setDelegateAddress] = useState('');

  const { name, description, image, attributes } = props.data;
  const rank = getRank(parseInt(attributes.at(-1).value));

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // fetch user's incoming/outgoing delegate mapping data. Refreshes upon delegation/undelegation
  useEffect(() => {
    if (state.userStatus >= 4) {
      (async function () {
        const delegationInfo = await Fetch.DELEGATE_INFO(state.userAddress);

        // console.log('Outgoing delegations:');
        // console.log(delegationInfo);

        delegationInfo.outgoingDelegations.forEach((item, i) => {
          if (item) {
            // console.log('Outgoing delegations:' + i);
            // console.log(item);

            const delegateAddress = item.delegateAddress.toLowerCase();

            const tokenId = item.tokenId.toLowerCase();

            if (tokenId === props.tokenID) {
              setIsDelegated(true);
              setDelegateAddress(delegateAddress);

              // return true;
            } else {
              setIsDelegated(false);
              setDelegateAddress('');
            }
          }
        });
      })();
    }
  }, [state.refreshDelegateInfo]);

  return (
    <div className={styles.card_container}>
      <div className={styles.wearable_modal}>
        <div className={styles.wear_box}>
          <div className={styles.wear_box_purple}>
            {rank.value <= 0 ? (
              <IceNeedToActivateTooltip />
            ) : (
              <IceP2EEnabledTooltip />
            )}
            <img src={image} />
          </div>
          <div className={styles.card_body}>
            <div className={styles.card}>{`Rank ${rank.value}`}</div>
            <IceWearableBonusTooltip bonus={rank.percentage} />
            <div className={styles.card}>
              {description.split(' ').at(-1).replace('/', ' of ')}
            </div>
          </div>
          <div className={styles.card_meta}>DG SUIT xxx</div>
          <div className={styles.card_title}>
            <p>{name.split('(ICE')[0].trim()}</p>
            <p>{`(ICE Rank ${rank.value})`}</p>
          </div>
          <div className={styles.button_area}>
            {rank.value === 0 ? (
              state.DGBalances.BALANCE_CHILD_DG <
              state.tokenAmounts.DG_MOVE_AMOUNT ? (
                <NeedMoreDGActivateModal />
              ) : (
                <ActivateWearableModal
                  tokenID={props.tokenID}
                  itemID={props.itemID}
                />
              )
            ) : (
              <span className="w-100 d-flex justify-content-between">
                {!isDelegated ? (
                  <ModalDelegate
                    tokenID={props.tokenID}
                    itemID={props.itemID}
                    imgSrc={image}
                    rank={rank.value}
                    bonus={attributes.at(-1).value}
                    description={description}
                  />
                ) : (
                  <ModalWithdrawDelegation
                    tokenID={props.tokenID}
                    delegateAddress={delegateAddress}
                  />
                )}
                <ModalWearable
                  tokenID={props.tokenID}
                  itemID={props.itemID}
                  imgSrc={image}
                  rank={rank.value}
                  percentage={rank.percentage}
                  bonus={attributes.at(-1).value}
                  description={description}
                  name={name.split('(ICE')[0].trim()}
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICEWearableCard;
