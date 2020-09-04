import React from 'react';
import { Modal, Icon } from 'semantic-ui-react';
import ContractData from './ContractData';

class ModalFunds extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        trigger={
          <a href="#">
            <p className="admin-button2">{this.props.modalType}</p>
          </a>
        }
        closeIcon
      >
        <Modal.Content>
          <ContractData
            modalType={this.props.modalType}
            gameType={this.props.gameType}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalFunds;
