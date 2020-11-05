import { Modal, Button, Menu, Icon } from 'semantic-ui-react';

const ModalVideoLanding = () => {
  return (
    <Modal
      trigger={
        <span className="landing-demo-span">
          <Icon
            style={{ marginLeft: '-9px', marginBottom: '-27px', color: 'white', fontSize: '16px' }}
            name="play circle outline"
          />
          <Menu.Item className="right-menu-text">
            DEMO
          </Menu.Item>
        </span>
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
          allow="autoplay"
        ></iframe>
      </Modal.Content>
    </Modal>
  );
};

export default ModalVideoLanding;