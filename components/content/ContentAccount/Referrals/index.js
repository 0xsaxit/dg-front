import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import Global from 'components/Constants';
import { Icon, Segment } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import styles from './Referrals.module.scss';
import ModalBreakdown from 'components/modal/ModalBreakdown';

const coins = ['mana', 'dai', 'usdt', 'atri', 'eth'];

function ContentReferrals({ state }) {
  const [copied, setCopied] = useState(false);
  const [isToastShow, setIsToastShow] = useState(false);
  const breakdown = {};

  let totalAmount = 0;
  coins.map(coin => {
    let totalAmountByCoin = 0;
    state.DGBalances.BALANCE_AFFILIATES.map((affiliate) => {
      totalAmount += Number(state.DGPrices[coin] * affiliate[coin]).toFixed(3);
      totalAmountByCoin += Number(state.DGPrices[coin] * (affiliate[coin] || 0));
    });
    breakdown[coin] = totalAmountByCoin.toFixed(3);
  });



  const onCopy = () => {
    navigator.clipboard.writeText(
      Global.CONSTANTS.BASE_URL + '/' + state.userInfo.id
    );
    setCopied(true);
    setIsToastShow(true);

    setTimeout(() => {
      setIsToastShow(false);
    }, 3000);

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
              <span className="d-flex flex-column">
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
          <h3 className="mb-0">
            {!!state.DGBalances.BALANCE_AFFILIATES.length
              ? 'Your referrals'
              : 'No Referrals Yet'}
          </h3>
          <ModalBreakdown totalAmount={totalAmount} breakdown={breakdown} />
        </span>

        <div className={styles.referrals_body}>
          <Segment className={styles.segment} loading={!!state.DGBalances.BALANCE_AFFILIATES.length && !state.DGBalances.BALANCE_AFFILIATES[0]['address']} >
            {state.DGBalances.BALANCE_AFFILIATES.map(
              (affiliate, affiliateIndex) => {

                return (
                  !!affiliate['address'] ? (
                    <div
                      className={cn(
                        'd-flex justify-content-between align-items-center mb-2',
                        styles.affiliate_row
                      )}
                      key={`table_row_${affiliateIndex}`}
                    >
                      <>
                        <div className={styles.address}>
                          {affiliate['address']}
                        </div>
                        <div className="d-flex align-items-center">
                          <div className={cn('me-2', styles.total_price)}>
                            $
                            {coins
                              .reduce((total, coin) => {
                                return (
                                  Number(total) +
                                  Number(affiliate[coin]) *
                                    Number(state.DGPrices[coin])
                                );
                              }, 0)
                              .toFixed(3)}
                          </div>
                          <ModalBreakdown
                            breakdown={affiliate}
                            address={affiliate['address']}
                          />
                        </div>
                      </>
                    </div>
                  ): <></>
                );
              }
            )}
          </Segment>
          <div className={cn(styles.toast, isToastShow ? '' : styles.hidden)}>
            Unique Referral Link Copied!
          </div>
        </div>
      </div>
    </Aux>
  );
}

export default ContentReferrals;
