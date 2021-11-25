import React from 'react';
import { Button } from 'semantic-ui-react';
import Web3 from 'web3';

const ButtonSwitchNetwork = () => {
  const networkInfo = {
    id: 1,
    name: 'Mainnet',
  };
  
  async function switchToMainNet() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: Web3.utils.toHex(networkInfo.id),
          }
        ],
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Button
      className="account-button"
      target="_blank"
      onClick={() => switchToMainNet()}
    >
      Switch to Mainnet
    </Button>
  )
}

export default ButtonSwitchNetwork;