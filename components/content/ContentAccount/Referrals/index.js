import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import Web3 from 'web3';
import Global from 'components/Constants';
import ABI_DG_TOKEN from 'components/ABI/ABIDGToken.json';
import Transactions from 'common/Transactions';
import { Icon } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import styles from './Referrals.module.scss';
import ModalBreakdown from 'components/modal/ModalBreakdown';

const coins = ['mana', 'dai', 'usdt', 'atri', 'eth'];

function ContentReferrals({ state, totalAmount }) {
  const [copied, setCopied] = useState(false);
	const [breakdown, setBreakdown] = useState({
		usdt: 0,
		eth: 0,
		dai: 0,
		mana: 0,
		atri: 0
	});

	useEffect(() => {
    const web3 = new Web3(window.ethereum);

    async function fetchData () {
      try {
        if (state.userAddress) {
          let amount; 
          const USDT_UNI = new web3.eth.Contract(
            ABI_DG_TOKEN,
            Global.ADDRESSES.ROOT_TOKEN_ADDRESS_USDT
          );
          amount = await USDT_UNI.methods.balanceOf(state.userAddress).call();
          const usdtAmount = web3.utils.fromWei(amount, 'mwei');
          
          const MANA_UNI = new web3.eth.Contract(
            ABI_DG_TOKEN,
            Global.ADDRESSES.ROOT_TOKEN_ADDRESS_MANA
          );
          amount = await MANA_UNI.methods.balanceOf(state.userAddress).call();
          const manaAmount = web3.utils.fromWei(amount, 'ether');

          const ATRI_UNI = new web3.eth.Contract(
            ABI_DG_TOKEN,
            Global.ADDRESSES.ROOT_TOKEN_ADDRESS_ATRI
          );
          amount = await ATRI_UNI.methods.balanceOf(state.userAddress).call();
          const atriAmount = web3.utils.fromWei(amount, 'wei');

          const DAI_UNI = new web3.eth.Contract(
            ABI_DG_TOKEN,
            Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DAI
          );
          amount = await DAI_UNI.methods.balanceOf(state.userAddress).call();
          const daiAmount = web3.utils.fromWei(amount, 'ether');

          amount = await new web3.eth.getBalance(state.userAddress);
          const ethAmount = web3.utils.fromWei(amount, 'ether');

					setBreakdown({
						eth: ethAmount,
						dai: daiAmount,
						atri: atriAmount,
						mana: manaAmount,
						usdt: usdtAmount
					});
        }
      } catch (error) {
        console.log('Get amount error', error);
      }
    };

    fetchData();
  }, [state.userAddress]);

  const onCopy = () => {
    navigator.clipboard.writeText(
      Global.CONSTANTS.BASE_URL + '/' + state.userInfo.id
    );
    setCopied(true);

    // track 'Affiliate Link' button click event
    analytics.track('Clicked AFFILIATE LINK button');
  };

  return (
    <Aux>
      <div className={cn('container', styles.referrals_container)}>
        <div className={cn('d-flex my-10', styles.referrals_header)}>
          <div className="d-flex flex-column">
            <h2 className={cn('mb-2', styles.referrals_header_title)}>
              Refer a friend and receive a %* of their wagers, forever
            </h2>
            <p className={styles.referrals_header_subtitle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Leo
              ridiculus potenti tellus turpis nibh in cras venenatis senectus.
              Porta enim ac ullamcorper mauris.
            </p>

            <span
              className={cn(
                'd-flex align-items-center px-4 py-2',
                styles.referrals_header_clipboard
              )}
            >
              <img
                src="/images/link_icon.png"
                className="me-2"
                alt="Referral Link"
              />
              <span clsasName="d-flex">
                <p className={styles.referral_link}>
                  https://decentral.games/{state.userInfo.id}
                </p>
                <p className={styles.sublink}>Your Unique Referral Link</p>
              </span>
              <Icon
                className={styles.affiliate_icon}
                onClick={onCopy}
                name={!copied ? 'copy' : 'check'}
              />
            </span>
          </div>

          <span className="d-md-flex d-none align-items-center">
            <img
              src="/images/gift.png"
              className={cn('ms-10', styles.gift_image)}
              alt="Gift"
            />
          </span>
        </div>
        <span className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Your referrals</h3>
					<ModalBreakdown totalAmount={totalAmount} breakdown={breakdown} />
        </span>

        <span className={styles.referrals_body}>
          {state.DGBalances.BALANCE_AFFILIATES.map(
            (affiliate, affiliateIndex) => {
              return (
                <div
                  className={cn(
                    'd-flex justify-content-between align-items-center mb-2',
                    styles.affiliate_row
                  )}
                  key={`table_row_${affiliateIndex}`}
                >
                  {!!affiliate['address'] && (
                    <>
                      <div className={styles.address}>
                        {affiliate['address']}
                      </div>
                      <div className="d-flex align-items-center">
                        <div className={cn('me-2', styles.total_price)}>
                          $
                          {coins.reduce((total, coin) => {
                            return (
                              Number(total) +
                              Number(affiliate[coin]) *
                                Number(state.DGPrices[coin])
                            );
                          }, 0).toFixed(2)}
                        </div>
                        <ModalBreakdown
                          breakdown={affiliate}
                          address={affiliate['address']}
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            }
          )}
        </span>
      </div>
    </Aux>
  );
}

export default ContentReferrals;
