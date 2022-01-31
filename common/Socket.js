import { useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import { decode, encode } from './crypto';

const Socket = () => {
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus >= 4) {
      const webSocket = new WebSocket('wss://socket.decentral.games/');

      webSocket.onopen = async () => {
        webSocket.send(encode('WEBSITE')); // generate website socket client
      };

      webSocket.onmessage = async (message) => {
        const json = JSON.parse(decode(message.data));

        if (json.minMintVerifyStep || json.minMintVerifyStep === 0) { // app config
          dispatch({
            type: 'app_config',
            data: json,
          });
        }
      };
    }
  }, [state.userStatus]);

  return null;
}

export default Socket;