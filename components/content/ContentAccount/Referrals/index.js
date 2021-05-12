import React, { useState } from 'react';
import cn from 'classnames';
import Global from 'components/Constants';
import { Icon } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import styles from './Referrals.module.scss';

function ContentReferrals({ state, totalAmount }) {
  const coins = ['mana', 'dai', 'usdt', 'atri', 'eth'];
  const [copied, setCopied] = useState(false);

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

          <span className="d-flex">
            <img
              src="/images/gift.png"
              className={cn('ms-10', styles.gift_image)}
              alt="Gift"
            />
          </span>
        </div>
        <span className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Your referrals</h3>
          <button
            disabled={!totalAmount}
            className={cn('btn btn-primary', styles.claim_button)}
            onClick={() => metaTransaction()}
          >
            Deposit Unclaimed Total (${Number(totalAmount).toFixed(2)})
          </button>
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
                        <div className={styles.total_price}>
                          $
                          {coins.reduce((total, coin) => {
                            return (
                              Number(total) +
                              (
                                Number(affiliate[coin]) / 1000000000000000000
                              ).toFixed(3)
                            );
                          }, 0)}
                        </div>
                        <button
                          className={cn('btn btn-dark', styles.breakdown)}
                        >
                          See Breakdown
                        </button>
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
