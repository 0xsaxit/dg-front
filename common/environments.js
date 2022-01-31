const useLocalhostApis = false;
const useLocalhostSockets = false;

export const ApiUrlsByAppEnv = {
    localhost: useLocalhostApis ? 'http://localhost:5000' : 'https://api.decentral.games',
    testing:'https://api.testing.decentral.games',
    development: 'https://api.dev.decentral.games',
    staging: 'https://api.staging.decentral.games',
    production: 'https://api.decentral.games'
};

export const SocketUrlsByAppEnv = {
    localhost: useLocalhostSockets ? 'wss://localhost:5000' : 'wss://socket.decentral.games',
    testing:'wss://testing.socket.decentral.games',
    development: 'wss://dev.docket.decentral.games',
    staging: 'wss://staging.socket.decentral.games',
    production: 'wss://socket.decentral.games'
};