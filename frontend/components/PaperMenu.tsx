import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
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
  categories: Category[];
  products: Product[];
}

// Create Document Component
const PaperMenu: React.FunctionComponent<Props> = ({
  categories,
  products
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {categories.map(c => {
            return <Text key={c.id}>{c.name}</Text>;
          })}
        </View>
        <View style={styles.section}>
          {products.map(p => {
            return <Text key={p.id}>{p.name}</Text>;
          })}
        </View>
      </Page>
    </Document>
  );
};

export default PaperMenu;
