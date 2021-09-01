import Link from 'next/link';
import { Popup, Button } from 'semantic-ui-react';
import Flag from 'assets/svg/flag.svg';

import styles from './LanguageModal.module.scss';

const countryItems = [
  {
    imgUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1630503835/united_states_gs7sdr.png',
    language: 'English',
  },
  {
    imgurl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1630503836/Ellipse_1_yseyhx.png',
    language: 'Spanish',
  },
  {
    imgUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1630503835/Ellipse_1_1_cw2vcm.png',
    language: 'Korean',
  },
  {
    imgUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1630503838/Ellipse_1_3_jysnoe.png',
    language: 'Russian',
  },
  {
    imgUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1630503835/Ellipse_1_2_baqvio.png',
    language: 'Chinese',
  },
];

const LanguageModal = () => {
  return (
    <div className={styles.language_container}>
      <Popup
        className={styles.language_popup}
        pinned
        on="click"
        position="bottom right"
        width="160px"
        trigger={
          <div className={styles.button_wrapper}>
            <Button className={styles.language_button}>
              <span className={styles.content_wrappper}>
                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630503835/united_states_gs7sdr.png" />
                <Flag />
              </span>
            </Button>
          </div>
        }
      >
        <div className={styles.popup_container}>
          {countryItems.map((item, index) => {
            return (
              <Link className="d-flex" key={index} href="#">
                <span className={styles.account_dropdown_item}>
                  <img src={item.imgUrl}></img>
                  <p> {item.language} </p>
                </span>
              </Link>
            );
          })}
        </div>
      </Popup>
    </div>
  );
};

export default LanguageModal;
