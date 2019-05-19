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
  const [loading, setLoading] = React.useState(false);

  const fetchEntities = async () => {
    setLoading(true);

    const allCategories = await CategoryAPI.getAll();
    const allProducts = await ProductAPI.getAll();

    setCategories(allCategories);
    setProducts(allProducts);
    setLoading(false);
    setPaperMenuModalVisible(true);
  };

  return (
    <>
      <Modal {...props} title="Settings" centered>
        <Button type="primary" onClick={fetchEntities} loading={loading}>
          Generate Paper Menu
        </Button>
      </Modal>
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
    </>
  );
};

export default SettingsModal;
