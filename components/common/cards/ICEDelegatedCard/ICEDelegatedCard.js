import { useContext } from 'react';
import { GlobalContext } from '../../../../store';
import GetRank from '../../../../common/GetIceWearableRank'
import IceP2EEnabledTooltip from 'components/tooltips/IceP2EEnabledTooltip';
import IceNeedToActivateTooltip from 'components/tooltips/IceNeedToActivateTooltip';
import IceWearableBonusTooltip from 'components/tooltips/IceWearableBonusTooltip';
import ModalWithdrawDelegation from 'components/modal/ModalWithdrawDelegation';
import styles from './ICEDelegatedCard.module.scss';
import Aux from '../../../_Aux';

const ICEWearableCard = props => {
  // get user's wallet address from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const buttonUndelegate = 'Withdraw Delegation';
  const { name, description, image, attributes } = props.data;
  const rank = GetRank(parseInt(attributes.at(-1).value));

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

        <div className={styles.card_meta}>Delegated To You</div>

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
            <span className="w-100 d-flex justify-content-between">
              <ModalWithdrawDelegation
                tokenID={props.tokenID}
                ownerAddress={props.ownerAddress}
                delegateAddress={state.userAddress}
                buttonName={buttonUndelegate}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICEWearableCard;
