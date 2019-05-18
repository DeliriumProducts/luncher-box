import { Button, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React from 'react';

const SettingsModal: React.FunctionComponent<ModalProps> = props => {
  return (
    <Modal {...props} title="Settings">
      <Button type="primary">Generate Paper Menu</Button>
    </Modal>
  );
};

export default SettingsModal;
