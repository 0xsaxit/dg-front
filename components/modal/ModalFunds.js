import { useState, useEffect } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import DepositFunds from './DepositFunds';
import WithdrawFunds from './WithdrawFunds';

const ModalFunds = (props) => {
  // define local variables
  const [gameTypeInt, setGameTypeInt] = useState(0);
  const [modalState, setModalState] = useState(false);

  useEffect(() => {
    if (props.gameType == 'Slots') {
      setGameTypeInt(1);
    } else if (props.gameType == 'Roulette') {
      setGameTypeInt(2);
    } else if (props.gameType == 'Backgammon') {
      setGameTypeInt(3);
    } else if (props.gameType == 'Blackjack') {
      setGameTypeInt(4);
    }
  }, []);

  function showModal(toggle) {
    setModalState(toggle);
  }

  return (
    <Modal
      open={modalState}
      trigger={
        <Button
          color="blue"
          className="balances-play-button"
          onClick={() => showModal(true)}
        >
          {props.modalType}
        </Button>
      }
      closeIcon
      onClose={() => showModal(false)}
    >
      <Modal.Content>
        {props.modalType === 'deposit' ? (
          <DepositFunds gameTypeInt={gameTypeInt} showModal={showModal} />
        ) : (
          <WithdrawFunds gameTypeInt={gameTypeInt} showModal={showModal} />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default ModalFunds;
