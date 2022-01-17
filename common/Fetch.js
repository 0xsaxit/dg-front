import call from 'common/API';
import getConfig from 'next/config';
import { MenuMenu } from 'semantic-ui-react';
import { ApiUrlsByAppEnv } from './environments';

// This imports NODE_ENV from next.config.js
const { publicRuntimeConfig } = getConfig();
const { APP_ENV } = publicRuntimeConfig;

// APP_ENV must be set in the .env.{environment} files
export const API_BASE_URL =
  ApiUrlsByAppEnv[APP_ENV] || 'https://api.decentral.games';

console.log('APP_ENV (NODE_ENV): ', APP_ENV);
console.log('API_BASE_URL: ', API_BASE_URL);

const Fetch = {
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // GET API calls (no wallet address necessary)
  APP_CONFIG: () => {
    return call(`${API_BASE_URL}/admin/getAppConfig`, 'GET');
  },

  TREASURY_STATS_NUMBERS: period => {
    return call(
      `${API_BASE_URL}/admin/getTreasuryBalanceHistory/${period}`,
      'GET',
      false
    );
  },

  EVENTS: () => {
    return call(`${API_BASE_URL}/players/getEvents`, 'GET', false);
  },

  GAME_RECORDS: () => {
    return call(`${API_BASE_URL}/admin/getTotalRecords`, 'GET');
  },

  // PLAYER_DATA: () => {
  //   return call(`${API_BASE_URL}/admin/getCryptoRecords`, 'GET');
  // },

  USERS_LIST: () => {
    return call(`${API_BASE_URL}/admin/getUsersList`, 'GET');
  },

  MINT_TOKEN: (itemId, collectionAddr) => {
    return call(
      `${API_BASE_URL}/ice/mintToken/${itemId}/${collectionAddr}`,
      'GET'
    );
  },

  DG_GOVERNANCE_SUPPLY_GECKO: () => {
    return call(
      `https://api.coingecko.com/api/v3/coins/decentral-games-governance`,
      'GET',
      false
    );
  },

  UPGRADE_TOKEN: (tokenId, collectionAddr) => {
    return call(
      `${API_BASE_URL}/ice/upgradeToken/${tokenId}/${collectionAddr}`,
      'GET'
    );
  },

  GET_METADATA_FROM_TOKEN_URI: (contractAddr, tokenId) => {
    return call(
      `${API_BASE_URL}/ice/getMetadata/${contractAddr}/${tokenId}`,
      'GET'
    );
  },

  CLAIM_REWARDS: () => {
    return call(`${API_BASE_URL}/ice/claimRewards`, 'GET');
  },

  CLAIM_REWARDS_AMOUNT: () => {
    return call(`${API_BASE_URL}/ice/getUnclaimedRewardsAmount`, 'GET');
  },

  GET_REWARDS_CONFIG: () => {
    return call(`${API_BASE_URL}/ice/getRewardsConfig`, 'GET');
  },

  // GET_TOKEN_MAPPINGS: () => {
  //   return call(`${API_BASE_URL}/ice/getRewardsConfig`, 'GET');
  // },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // GET API calls (wallet address necessary)
  PLAYER_INFO: address => {
    return call(`${API_BASE_URL}/admin/getUser?address=${address}`, 'GET');
  },

  POKER_DATA: address => {
    return call(
      `${API_BASE_URL}/admin/getPokerHandHistory?address=${address}`,
      'GET'
    );
  },

  ICE_AMOUNTS: address => {
    return call(
      `${API_BASE_URL}/ice/getUnclaimedRewardsAmount?address=${address}`,
      'GET'
    );
  },

  UPDATE_FREE_PLAYER_BALANCE: (amount, address) => {
    return call(
      `${API_BASE_URL}/admin/updateUserBalances?freePlayAmountChange=${amount}&user=${address}`,
      'GET'
    );
  },

  UPDATE_ICE_CHIP_BALANCE: (amount, address) => {
    return call(
      `${API_BASE_URL}/admin/updateUserBalances?iceChipsAmountChange=${amount}&user=${address}`,
      'GET'
    );
  },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // GET API calls (wallet address optional)
  DELEGATE_INFO: address => {
    return call(`${API_BASE_URL}/ice/delegateInfo?address=${address}`, 'GET');
  },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // POST API calls (no wallet address necessary)
  USER_STATUS: () => {
    return call(`${API_BASE_URL}/order/webLogin`, 'POST', true);
  },

  REGISTER: affiliate => {
    return call(`${API_BASE_URL}/order/webRegister`, 'POST', true, {
      affiliate,
    });
  },

  DELEGATE_NFT: (delegateAddress, tokenId, contractAddress) => {
    return call(`${API_BASE_URL}/ice/delegateToken`, 'POST', true, {
      delegateAddress,
      tokenId,
      contractAddress,
    });
  },

  UNDELEGATE_NFT: (tokenOwner, delegateAddress, tokenId, contractAddress) => {
    return call(`${API_BASE_URL}/ice/undelegateToken`, 'POST', true, {
      tokenOwner,
      delegateAddress,
      tokenId,
      contractAddress,
    });
  },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // POST API calls (wallet address necessary)
  UPDATE_TOKEN_ARRAY: (address, index) => {
    return call(`${API_BASE_URL}/order/updateTokenArray`, 'POST', true, {
      index,
    });
  },

  TOP_UP_USER: address => {
    return call(`${API_BASE_URL}/order/topup`, 'POST', true, { address });
  },

  HISTORY_DATA: address => {
    return call(`${API_BASE_URL}/order/getHistory`, 'POST', true, {
      limit: 99999, // call all of the data
      page: 1,
    });
  },

  PLAY_DATA: address => {
    return call(`${API_BASE_URL}/order/getPlayInfo`, 'POST', true, {
      limit: 99999, // call all of the data
      page: 1,
    });
  },

  POST_HISTORY: (address, amount, type, state, txHash, step) => {
    return call(`${API_BASE_URL}/order/updateHistory`, 'POST', true, {
      amount,
      type,
      state,
      txHash,
      step,
    });
  },

  GET_WEARABLE_INVENTORY: address => {
    return call(
      `${API_BASE_URL}/ice/getWearableInventory?address=${address}`,
      'GET',
      true
    );
  },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // third-party API calls
  NFTS_1: address => {
    return call(
      `https://api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=0xbf53c33235cbfc22cef5a61a83484b86342679c5&order_direction=desc&offset=0&limit=10`,
      'GET',
      false
    );
  },

  NFTS_2: address => {
    return call(
      `https://api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=0x7038e9d2c6f5f84469a84cf9bc5f4909bb6ac5e0&order_direction=desc&offset=0&limit=10`,
      'GET',
      false
    );
  },

  AVATAR_IMAGE: address => {
    return call(
      `https://peer.decentraland.org/lambdas/profile/${address}`,
      'GET',
      false
    );
  },

  PROPOSALS: () => {
    return call(
      `https://hub.snapshot.page/api/decentralgames.eth/proposals`,
      'GET',
      false
    );
  },

  MANA_PRICE: () => {
    return call(
      `https://api.coingecko.com/api/v3/coins/decentraland`,
      'GET',
      false
    );
  },

  ETH_PRICE: () => {
    return call(
      `https://api.coingecko.com/api/v3/coins/ethereum`,
      'GET',
      false
    );
  },

  ICE_PRICE: () => {
    return call(
      `https://api.coingecko.com/api/v3/coins/decentral-games-ice`,
      'GET',
      false
    );
  },

  OLD_DG_PRICE: () => {
    return call(
      `https://api.coingecko.com/api/v3/simple/price?ids=decentral-games-old&vs_currencies=usd`,
      'GET',
      false
    );
  },

  ATRI_PRICE: () => {
    return call(`https://api.coingecko.com/api/v3/coins/atari`, 'GET', false);
  },

  DG_SUPPLY_GECKO: () => {
    return call(
      `https://api.coingecko.com/api/v3/coins/decentral-games`,
      'GET',
      false
    );
  },

  // ICE_PRICE: () => {
  //   return call(`https://api.coingecko.com/api/v3/coins/ice`, 'GET', false);
  // },

  LAND_PRICE: () => {
    return call(
      `https://nonfungible.com/api/v4/market/summary/decentraland?daily=true&filter=[{"id":"nftTicker","value":"LAND"},{"id":"saleType","value":""}]`,
      'GET',
      false
    );
  },

  POAPS: address => {
    return call(`https://api.poap.xyz/actions/scan/${address}`, 'GET', false);
  },

  DELEGATION_BREAKDOWN: (time, address) => {
    if (address) {
      return call(`https://api.decentral.games/ice/getDelegationBreakdown/${time}?address=${address}`, 'GET');
    } else {
      return call(`https://api.decentral.games/ice/getDelegationBreakdown/${time}`, 'GET');
    }
  },

  GAMEPLAY_REPORTS: (address) => {
    if (address) {
      return call(`https://api.decentral.games/ice/getGameplayReports/?address=${address}`, 'GET');
    } else {
      return call(`https://api.decentral.games/ice/getGameplayReports`, 'GET');
    }
  },

  GET_FRONTPAGE_STATS: () =>  {
    return call(`${API_BASE_URL}/admin/getFrontPageStats`, 'GET', false);
  }
};

export default Fetch;
