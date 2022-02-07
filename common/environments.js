const useLocalhostApis = true;
const useLocalhostSockets = true;

export const ApiUrlsByAppEnv = {
  localhost: useLocalhostApis ? 'http://localhost:5000' : 'https://api.decentral.games',
  testing: 'https://api.testing.decentral.games',
  development: 'https://api.dev.decentral.games',
  staging: 'https://api.staging.decentral.games',
  production: 'https://api.decentral.games'
};

export const SocketUrlsByAppEnv = {
  localhost: useLocalhostSockets ? 'ws://localhost:8080' : 'wss://socket.decentral.games',
  testing: 'wss://socket.testing.decentral.games',
  development: 'wss://socket.dev.decentral.games',
  staging: 'wss://socket.staging.decentral.games',
  production: 'wss://socket.decentral.games'
};
