import { Modal, Button } from 'semantic-ui-react';

const ModalVideo = () => {
  return (
    <Modal
      trigger={
        <Button
          color="blue"
          className="demo-button"
          style={{ marginRight: '18px' }}
        >
          {' '}
          DEMO{' '}
        </Button>
      }
      basic
      size="small"
    >
      <Modal.Content>
        <iframe
          className="mobile-demo-video"
          src="https://www.youtube.com/embed/FOAxJrfyDIA"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </Modal.Content>
    </Modal>
  );
};

export default ModalVideo;
