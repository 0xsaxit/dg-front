import { Modal, Button } from 'semantic-ui-react';

import styles from './ModalVideo.module.scss';

const ModalVideo = () => {
  return (
    <Modal
      trigger={<Button className={styles.demo_button}>DEMO</Button>}
      basic
      size="small"
    >
      <Modal.Content>
        <iframe
          className={styles.mobile_demo_video}
          src="https://www.youtube.com/embed/1NxYpUsxhC0"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </Modal.Content>
    </Modal>
  );
};

export default ModalVideo;
