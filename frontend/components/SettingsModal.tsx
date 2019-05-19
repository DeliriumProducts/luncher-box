import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import PaperMenu from './PaperMenu';

const SettingsModal: React.FunctionComponent<ModalProps> = props => {
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [renderPdf, setRenderPdf] = React.useState(false);

  const generatePdf = async () => {
    setButtonLoading(true);
    setRenderPdf(true);
  };

  return (
    <Modal {...props} title="Settings">
      <Button type="primary" onClick={generatePdf} loading={buttonLoading}>
        Generate Paper Menu
      </Button>
      {renderPdf && (
        <PDFDownloadLink
          document={
            <PaperMenu
              setLoading={() => {
                setButtonLoading(false);
              }}
            />
          }
          fileName="somename.pdf"
        >
          {({ blob, url, loading, error }) => {
            if (loading) {
              return null;
            } else {
              return <Button type="link">Download now!</Button>;
            }
          }}
        </PDFDownloadLink>
      )}
    </Modal>
  );
};

export default SettingsModal;
