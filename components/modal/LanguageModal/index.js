import { useState, useContext } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { Popup, Button } from 'semantic-ui-react';
import Flag from 'assets/svg/flag.svg';
import styles from './LanguageModal.module.scss';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { GlobalContext } from '../../../store';

const LanguageModal = () => {
  const [state, dispatch] = useContext(GlobalContext);
  const [lang, setLang] = useState(3);

  const countryItems = [
    {
      imgUrl:
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1630503835/united_states_gs7sdr.png',
      language: 'English',
    },
    {
      imgUrl:
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

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLanguage = index => {    
    console.log(index);
    const language = ['en', 'sp', 'ko', 'ru', 'ch'];
    changeLanguage(language[index]);
    dispatch({
      type: 'set_selectedLang',
      data: index,
    });
  };

  return (
    <div className={styles.language_container}>
      <Popup
        className={cn('border-0 h-100', styles.language_popup)}
        pinned
        on="click"
        position="bottom right"
        width="160px"
        trigger={
          <div className={styles.button_wrapper}>
            <Button className={styles.language_button}>
              <span className={styles.content_wrappper}>
                <img src={countryItems[state.selectedLang].imgUrl} alt="Translate icon" />
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
                <span
                  className={cn('d-flex m-0', styles.account_dropdown_item)}
                  onClick={() => handleLanguage(index)}
                >
                  <img src={item.imgUrl} alt="Languages items" />
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
