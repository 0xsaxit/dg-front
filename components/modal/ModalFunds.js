import { useState, useEffect } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import ContentModal from '../content/ContentModal';

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
    setGameSelect(value);
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
        <ContentModal
          gameTypeInt={gameTypeInt}
          showModal={showModal}
          gameSelect={gameSelect}
          handleChange={handleChange}
          type={props.modalType}
        />
      </Modal.Content>
    </Modal>
  );
};

export default ModalFunds;
