import { useEffect, useContext } from 'react';
import { GlobalContext } from '@/store';
import getConfig from 'next/config';
import { decode, encode } from './crypto';
import { SocketUrlsByAppEnv } from './environments';

const { publicRuntimeConfig } = getConfig();
const { APP_ENV } = publicRuntimeConfig;

const Socket = () => {
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus >= 4) {
      const webSocket = new WebSocket(SocketUrlsByAppEnv[APP_ENV] || 'wss://socket.decentral.games');

      webSocket.onopen = async () => {
        const web = encode(JSON.stringify({ WEBSITE: true }));
        webSocket.send(web); // generate website socket client
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
