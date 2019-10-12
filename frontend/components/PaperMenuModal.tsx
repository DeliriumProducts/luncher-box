import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Button, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import styled from 'styled-components';
import { Category, Product } from '../interfaces';
import PaperMenu from './PaperMenu';

interface Props {
  categories: Category[];
  products: Product[];
}

const PaperMenuModal: React.FunctionComponent<ModalProps & Props> = ({
  categories,
  products,
  ...modalProps
}) => {
  return (
    <Modal {...modalProps} title="Exporting Paper Menu" centered>
      <Container>
        <PDFDownloadLink
          document={<PaperMenu categories={categories} products={products} />}
          fileName={`${new Date().toLocaleDateString()}.pdf`}
        >
          {({ blob, url, loading, error }) => {
            if (loading) {
              return null;
            } else {
              return <Button type="link">Download now!</Button>;
            }
          }}
        </PDFDownloadLink>
        <br />
        <PDFViewer height={600}>
          <PaperMenu categories={categories} products={products} />
        </PDFViewer>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default PaperMenuModal;
