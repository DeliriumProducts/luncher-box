import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { CategoryAPI, ProductAPI } from '../api';
import { Category, Product } from '../interfaces';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

interface Props {
  setLoading: () => void;
}

// Create Document Component
const PaperMenu: React.FunctionComponent<Props> = ({ setLoading }) => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    const allCategories = await CategoryAPI.getAll();
    const allProducts = await ProductAPI.getAll();

    setCategories(allCategories);
    setProducts(allProducts);
  };

  return (
    <Document onRender={setLoading}>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {categories.map(c => {
            return <Text>{c.name}</Text>;
          })}
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PaperMenu;
