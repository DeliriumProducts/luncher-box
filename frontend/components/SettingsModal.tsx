import { Button, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import { CategoryAPI, ProductAPI } from '../api';
import { Category, Product } from '../interfaces';
import PaperMenuModal from './PaperMenuModal';

const SettingsModal: React.FunctionComponent<ModalProps> = props => {
  const [paperMenuModalVisible, setPaperMenuModalVisible] = React.useState(
    false
  );

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    const allCategories = await CategoryAPI.getAll();
    const allProducts = await ProductAPI.getAll();

    console.log(allCategories);

    setCategories(allCategories);
    setProducts(allProducts);
    setLoading(false);
  };

  return (
    <>
      <Modal {...props} title="Settings" centered>
        <Button
          type="primary"
          onClick={() => {
            setPaperMenuModalVisible(true);
          }}
        >
          Generate Paper Menu
        </Button>
      </Modal>
      {!loading && (
        <PaperMenuModal
          categories={categories}
          products={products}
          visible={paperMenuModalVisible}
          onCancel={() => {
            setPaperMenuModalVisible(false);
          }}
          onOk={() => {
            setPaperMenuModalVisible(false);
          }}
        />
      )}
    </>
  );
};

export default SettingsModal;
