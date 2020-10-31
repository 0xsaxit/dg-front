import { Modal, Button, Menu, Icon } from 'semantic-ui-react';

const ModalVideoLanding = () => {
  return (
    <Modal
      trigger={
        <span style={{ display: 'flex', flexDirection: 'column', marginTop: '25px', marginRight: '-45px', cursor: 'pointer' }}>
          <Icon
            style={{ marginLeft: '-9px', marginBottom: '-27px', color: 'white', fontSize: '16px' }}
            name="play circle outline"
          />
          <Menu.Item className="right-menu-text">
            WATCH DEMO
          </Menu.Item>
        </span>
      }
      basic
      size="small"
    >
      <Modal.Content>
        <iframe
          className="mobile-demo-video"
          src="https://www.youtube.com/embed/a1DoWiNW0oU?&autoplay=1&loop=1&playlist=a1DoWiNW0oU"
          frameborder="0"
          allowfullscreen
          allow="autoplay"
        ></iframe>
      </Modal.Content>
    </Modal>
  );
};

export default ModalVideoLanding;