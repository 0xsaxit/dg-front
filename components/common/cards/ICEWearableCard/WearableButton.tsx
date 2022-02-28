import React, { FC, ReactElement, useContext, useState } from 'react';
import { GlobalContext } from '@/store';
import ModalDelegate from '@/components/modal/ModalDelegate';
import ModalWithdrawDelegation from 'components/modal/ModalWithdrawDelegation';
import ActivateWearableModal from 'components/modal/ActivateWearableModal';
import NeedMoreDGActivateModal from 'components/modal/NeedMoreDGActivateModal';
import ModalWearable from 'components/modal/ModalWearable';
import styles from './IceWearable.module.scss';

export interface WearableButtonType {
  item: any;
  delegation?: any;
  className?: string;
}

const WearableButton: FC<WearableButtonType> = ({ item, delegation, className = '' }: WearableButtonType): ReactElement => {
  // get user's wallet address from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  const buttonDelegate = 'Delegate';
  const buttonUndelegate = 'Undelegate';
  const { name, description, rank, image, imageUpgrade, tokenId, checkInStatus, contractAddress, isActivated, itemId } = item;
  const bonus = '+' + item.bonus + '%';
  const delegateAddress = item.delegationStatus.delegatedTo || '';
  const delegationStatus = item.delegationStatus.isQueuedForUndelegationByDelegatee || item.delegationStatus.isQueuedForUndelegationByOwner;

  return (
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
						<ModalDelegate tokenId={tokenId} contractAddress={contractAddress} imgSrc={image} rank={rank} bonus={bonus} description={description} buttonName={buttonDelegate} />
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
  );
};

export default WearableButton;
