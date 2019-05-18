import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import { Category, Product } from '../interfaces';
import PaperMenu from './PaperMenu';

const SettingsModal: React.FunctionComponent<ModalProps> = props => {
  const [renderPdf, setRenderPdf] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);

  const generatePdf = async () => {
    setButtonLoading(true);

    // const allCategories = await CategoryAPI.getAll();
    // const allProducts = await ProductAPI.getAll();

    // setCategories(allCategories);
    // setProducts(allProducts);

    setRenderPdf(true);
    setButtonLoading(false);
  };

  return (
    <Modal {...props} title="Settings">
      <Button type="primary" onClick={generatePdf} loading={buttonLoading}>
        Generate Paper Menu
      </Button>
      {renderPdf && (
        <PDFDownloadLink
          document={<PaperMenu categories={categories} products={products} />}
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
