import { useContext } from 'react';
import { GlobalContext } from '../../../../store';
import IceP2EEnabledTooltip from 'components/tooltips/IceP2EEnabledTooltip';
import IceNeedToActivateTooltip from 'components/tooltips/IceNeedToActivateTooltip';
import IceWearableBonusTooltip from 'components/tooltips/IceWearableBonusTooltip';
import ModalDelegate from 'components/modal/ModalDelegate';
import ActivateWearableModal from 'components/modal/ActivateWearableModal';
import NeedMoreDGActivateModal from 'components/modal/NeedMoreDGActivateModal';
import ModalWearable from 'components/modal/ModalWearable';
import styles from './ICEWearableCard.module.scss';

const getRank = bonus => {
  if (bonus === 0) {
    return { value: 0, percentage: '0%' };
  } else if (1 <= bonus <= 7) {
    return { value: 1, percentage: '+1 - 7%' };
  } else if (8 <= bonus <= 15) {
    return { value: 2, percentage: '+8 - 15%' };
  } else if (16 <= bonus <= 24) {
    return { value: 3, percentage: '+16 - 24%' };
  } else if (25 <= bonus <= 34) {
    return { value: 4, percentage: '+25 - 34%' };
  } else if (35 <= bonus <= 45) {
    return { value: 5, percentage: '+35 - 45%' };
  }
};

const ICEWearableCard = ({ data }) => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  const { name, description, image, attributes } = data;
  const rank = getRank(parseInt(attributes.at(-1).value));

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
          <div className={styles.card_meta}>DG SUIT</div>
          <div className={styles.card_title}>
            <p>{name.split('(ICE')[0].trim()}</p>
            <p>{`(ICE Rank ${rank.value})`}</p>
          </div>
          <div className={styles.button_area}>
            {rank.value === 0 ? (
              state.DGBalances.BALANCE_CHILD_DG < 0.5 ? (
                <NeedMoreDGActivateModal />
              ) : (
                <ActivateWearableModal />
              )
            ) : (
              <span className="w-100 d-flex justify-content-between">
                <ModalDelegate
                  imgSrc={image}
                  rank={rank.value}
                  bonus={attributes.at(-1).value}
                  description={description}
                />
                <ModalWearable
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
