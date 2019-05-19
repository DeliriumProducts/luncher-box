import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View
} from '@react-pdf/renderer';
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
  },
  text: {
    fontFamily: 'Oswald',
    color: '#212121'
  },
  image: {
    width: 10,
    height: 10
  }
});

interface Props {
  categories: Category[];
  products: Product[];
}

const ProductItem: React.FunctionComponent<Partial<Product>> = ({
  name,
  description,
  image
}) => {
  return (
    <View>
      <Text>{name}</Text>
      <Image
        style={styles.image}
        source={{
          uri: image!,
          method: 'GET',
          mode: 'cors',
          referrerPolicy: 'no-referrer-when-downgrade',
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: null
        }}
      />
    </View>
  );
};

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
            return <ProductItem key={p.id} {...p} />;
          })}
        </View>
      </Page>
    </Document>
  );
};

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

export default PaperMenu;
