import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../../store';
import Fetch from '../../../../common/Fetch';
import GetRank from '../../../../common/GetIceWearableRank'
import IceP2EEnabledTooltip from 'components/tooltips/IceP2EEnabledTooltip';
import IceNeedToActivateTooltip from 'components/tooltips/IceNeedToActivateTooltip';
import IceWearableBonusTooltip from 'components/tooltips/IceWearableBonusTooltip';
import ModalDelegate from 'components/modal/ModalDelegate';
import ModalWithdrawDelegation from 'components/modal/ModalWithdrawDelegation';
import ActivateWearableModal from 'components/modal/ActivateWearableModal';
import NeedMoreDGActivateModal from 'components/modal/NeedMoreDGActivateModal';
import ModalWearable from 'components/modal/ModalWearable';
import styles from './ICEWearableCard.module.scss';
import Aux from '../../../_Aux';

const ICEWearableCard = props => {
  // get user's wallet address from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [delegateAddress, setDelegateAddress] = useState('');

  const buttonDelegate = 'Delegate';
  const buttonUndelegate = 'Withdraw Delegation';
  const { name, description, image, attributes } = props.data;
  const rank = GetRank(parseInt(attributes.at(-1).value));

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // fetch user's incoming/outgoing delegate mapping data. Refreshes upon delegation/undelegation
  useEffect(() => {
    if (state.userStatus >= 4) {
      (async function () {
        setDelegateAddress('');
        const delegationInfo = await Fetch.DELEGATE_INFO(state.userAddress);

        delegationInfo.outgoingDelegations.forEach((item, i) => {
          if (item) {
            const delegateAddress = item.delegateAddress;
            const tokenId = item.tokenId;

            if (tokenId === props.tokenID) {
              setDelegateAddress(delegateAddress);
            }
          }
        });
      })();
    }
  }, [state.refreshDelegateInfo]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function imageAndDescription() {
    return (
      <Aux>
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

        {/* <div className={styles.card_meta}>{name.split('(ICE')[0].trim()}</div> */}

        <div className={styles.card_title}>
          <p>{name.split('(ICE')[0].trim()}</p>
          <p>{`(ICE Rank ${rank.value})`}</p>
        </div>
      </Aux>
    );
  }

  return (
    <div className={styles.card_container}>
      <div className={styles.wearable_modal}>
        <div className={styles.wear_box}>
          {imageAndDescription()}

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
                {delegateAddress === '' ? (
                  <ModalDelegate
                    tokenID={props.tokenID}
                    itemID={props.itemID}
                    imgSrc={image}
                    rank={rank.value}
                    bonus={attributes.at(-1).value}
                    description={description}
                    buttonName={buttonDelegate}
                  />
                ) : (
                  <ModalWithdrawDelegation
                    tokenID={props.tokenID}
                    ownerAddress={state.userAddress}
                    delegateAddress={delegateAddress}
                    buttonName={buttonUndelegate}
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
