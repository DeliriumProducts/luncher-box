import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
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
  console.log(categories, products);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PaperMenu;
