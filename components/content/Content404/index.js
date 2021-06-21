import { Button } from 'semantic-ui-react';
import styles from './Content404.module.scss';

const Content404 = () => {
  return (
    <div className={styles.not_found}>
      <p className={styles.not_found_header_text}> 404 </p>
      <p className={styles.not_found_middle_text}> Page not found </p>
      <p> The requested page could not be found. </p>

      <Button className="not-found-button" href="/">
        BACK TO HOME
      </Button>
    </div>
  );
};

export default Content404;
