import { useState, useEffect } from 'react';
import { Modal, Button } from 'semantic-ui-react';
// import DepositFunds from './DepositFunds';
// import WithdrawFunds from './WithdrawFunds';
import ContentModal from './ContentModal';

const ModalFunds = (props) => {
  // define local variables
  const [gameTypeInt, setGameTypeInt] = useState(0);
  const [modalState, setModalState] = useState(false);
  const [gameSelect, setGameSelect] = useState('mana');

  useEffect(() => {
    if (props.gameType == 'slots') {
      setGameTypeInt(1);
    } else if (props.gameType == 'roulette') {
      setGameTypeInt(2);
    } else if (props.gameType == 'backgammon') {
      setGameTypeInt(3);
    } else if (props.gameType == 'blackjack') {
      setGameTypeInt(4);
    }
  }, []);

  function showModal(toggle) {
    setModalState(toggle);
  }

  function handleChange(value) {
    var gameSelect = '';
    if (value === 'play') {
      gameSelect = 'play';
    } else if (value === 'mana') {
      gameSelect = 'mana';
    } else {
      gameSelect = 'dai';
    }
    setGameSelect(gameSelect);
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
          <ContentModal
            gameTypeInt={gameTypeInt}
            showModal={showModal}
            gameSelect={gameSelect}
            handleChange={handleChange}
            type={'deposit'}
          />
        ) : (
          <ContentModal
            gameTypeInt={gameTypeInt}
            showModal={showModal}
            gameSelect={gameSelect}
            handleChange={handleChange}
            type={'withdraw'}
          />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default ModalFunds;
