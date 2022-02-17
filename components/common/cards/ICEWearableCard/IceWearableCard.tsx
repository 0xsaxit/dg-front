import React, { FC, ReactElement, useContext, useState, useRef } from 'react';
import AutosizeInput from 'react-input-autosize';
import { GlobalContext } from '@/store';
import IceP2EEnabledTooltip from 'components/tooltips/IceP2EEnabledTooltip';
import IceNeedToActivateTooltip from 'components/tooltips/IceNeedToActivateTooltip';
import IceWearableBonusTooltip from 'components/tooltips/IceWearableBonusTooltip';
import IceCheckedInTooltip from 'components/tooltips/IceCheckedInTooltip';
import ModalDelegate from '@/components/modal/ModalDelegate';
import ModalWithdrawDelegation from 'components/modal/ModalWithdrawDelegation';
import ActivateWearableModal from 'components/modal/ActivateWearableModal';
import NeedMoreDGActivateModal from 'components/modal/NeedMoreDGActivateModal';
import ModalWearable from 'components/modal/ModalWearable';
import ModalIceDelegationBreakDown from 'components/modal/ModalIceDelegationBreakDown';
import Fetch from 'common/Fetch';
import styles from './IceWearable.module.scss';
import Aux from '../../../_Aux';

export interface IceWearableCardType {
  item: any;
  delegation?: any;
  className?: string;
}

const IceWearableCard: FC<IceWearableCardType> = ({ item, delegation, className = '' }: IceWearableCardType): ReactElement => {
  // get user's wallet address from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const [showBreakDown, setShowingBreakDown] = useState(-1);
  const [nickName, setNickName] = useState(item.delegationStatus.delegatedToNickname ? item.delegationStatus.delegatedToNickname : item.delegationStatus.delegatedTo || '');
  const [pastNickName, savePastNickName] = useState(null);
  const [isEditingNickName, saveIsEditingNickName] = useState(false);

  const buttonDelegate = 'Delegate';
  const buttonUndelegate = 'Undelegate';
  const { name, description, rank, image, imageUpgrade, tokenId, checkInStatus, contractAddress, isActivated, itemId } = item;
  const bonus = '+' + item.bonus + '%';
  const delegateAddress = item.delegationStatus.delegatedTo || '';
  const delegationStatus = item.delegationStatus.isQueuedForUndelegationByDelegatee || item.delegationStatus.isQueuedForUndelegationByOwner;
  const nickNameInputRef = useRef<AutosizeInput>(null);

  async function saveUpdatedNickName(): Promise<void> {
    saveIsEditingNickName(false);

    if (!nickName) {
      setNickName(pastNickName);
    } else if (nickName !== pastNickName) {
      await Fetch.EDIT_DELEGATION_NICKNAME(nickName, delegateAddress);
      savePastNickName(nickName);
    }
  }

  function handleEditNickNameClick(): void {
    if (!isEditingNickName) {
      saveIsEditingNickName(true);
      savePastNickName(nickName);
      setNickName('');

      setTimeout(() => {
        nickNameInputRef.current.input.focus();
      }, 200);
    }
  }

  // helper functions
  function imageAndDescription(): ReactElement {
    return (
      <Aux>
        <div className={styles.wear_box_purple}>
          {!isActivated ? <IceNeedToActivateTooltip /> : checkInStatus ? <IceCheckedInTooltip /> : <IceP2EEnabledTooltip />}
          <img src={image} />
        </div>

        <div className={styles.card_body}>
          {delegateAddress ? (
            <div className={styles.delegated}>
              {isEditingNickName ? (
                <AutosizeInput
                  ref={nickNameInputRef}
                  name="nick-name"
                  value={nickName}
                  onChange={e => {
                    setNickName(e.target.value);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      saveUpdatedNickName();
                    }
                  }}
                  onBlur={() => {
                    saveUpdatedNickName();
                  }}
                  disabled={!isEditingNickName}
                />
              ) : (
                <h1 onClick={() => setShowingBreakDown(1)}>Delegated To {nickName.length > 8 ? nickName.substr(0, 8) + '...' : nickName}</h1>
              )}

              <img
                className={styles.edit}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1643126922/edit_p53oml.png"
                alt="edit"
                onClick={() => {
                  handleEditNickNameClick();
                }}
              />
            </div>
          ) : null}
          <div className={styles.card}>{`Rank ${rank}`}</div>
          <IceWearableBonusTooltip bonus={bonus} />
          <div className={styles.card}>{description.split(' ').at(-1).replace('/', ' of ')}</div>
        </div>

        <div className={styles.card_title}>
          <p>{name.split('(ICE')[0].trim()}</p>
          <p>{`(ICE Rank ${rank})`}</p>
        </div>
      </Aux>
    );
  }

  return (
    <section className={`ice-wearable-card component ${className}`}>
      <div className={styles.card_container}>
        <div className={styles.wearable_modal}>
          <div className={styles.wear_box}>
            {imageAndDescription()}

            <div className={styles.button_area}>
              {!isActivated ? (
                state.DGBalances.BALANCE_CHILD_DG_LIGHT < state.tokenAmounts.DG_MOVE_AMOUNT ? (
                  <NeedMoreDGActivateModal />
                ) : (
                  <ActivateWearableModal tokenId={tokenId} itemId={itemId} contractAddress={contractAddress} />
                )
              ) : (
                <span className={rank !== 5 ? 'w-100 d-flex justify-content-between' : 'w-100 d-flex justify-content-center'}>
                  {delegateAddress === '' ? (
                    <ModalDelegate
                      tokenId={tokenId}
                      contractAddress={contractAddress}
                      imgSrc={image}
                      rank={rank}
                      bonus={bonus}
                      description={description}
                      buttonName={buttonDelegate}
                    />
                  ) : (
                    <ModalWithdrawDelegation
                      checkInStatus={checkInStatus}
                      delegationStatus={delegationStatus}
                      tokenId={tokenId}
                      contractAddress={contractAddress}
                      tokenOwner={state.userAddress}
                      delegateAddress={delegateAddress}
                      rank={rank}
                      buttonName={buttonUndelegate}
                    />
                  )}
                  {rank < 5 && (
                    <ModalWearable
                      tokenId={tokenId}
                      contractAddress={contractAddress}
                      itemId={itemId}
                      imgSrc={image}
                      imgUpgradeSrc={imageUpgrade}
                      rank={rank}
                      bonus={bonus}
                      description={description}
                      name={name.split('(ICE')[0].trim()}
                      delegateAddress={delegateAddress}
                    />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBreakDown !== -1 && delegation ? (
        <ModalIceDelegationBreakDown
          playerAddress={delegation ? delegation.address : ''}
          delegationBreakdown={delegation ? delegation.breakdown : []}
          setShowingBreakDown={setShowingBreakDown}
        />
      ) : null}
    </section>
  );
};

export default IceWearableCard;
