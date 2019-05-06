import { Empty, message } from 'antd';
import { NextFunctionComponent } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';
import { CategoryAPI } from '../../api';
import FlexContainer from '../../components/FlexContainer';
import PageHeader from '../../components/PageHeader';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../interfaces';

interface Props {
  products: Product[];
  err: string | null;
  categoryName: string;
}

const CategoryPage: NextFunctionComponent<Props> = ({
  products,
  err,
  categoryName
}) => {
  let data: React.ReactNode[] | React.ReactNode;

  React.useEffect(() => {
    if (err) {
      message.error(`${err}, Redirecting you to the menu...`, 3, () =>
        Router.replace('/app')
      );
    }
  }, []);

  /**
   * Check whether data is still being fetched
   */
  if (products.length && !err) {
    data = products.map(product => (
      <ProductCard key={product.id} {...product} />
    ));
  } else {
    data = <Empty description="No entries found" />;
  }

  return (
    <>
      <Head>
        <title>
          {categoryName === '' ? 'Category' : categoryName} • LuncherBox
        </title>
      </Head>
      <FlexContainer>
        <PageHeader
          title={
            <h1>
              <strong>{categoryName}</strong>
            </h1>
          }
          subTitle={
            <h3>
              <strong>({products.length})</strong>
            </h3>
          }
          onBack={() => {
            Router.back();
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            {data}
          </div>
        </PageHeader>
      </FlexContainer>
    </>
  );
};

CategoryPage.getInitialProps = async ({ query }) => {
  try {
    const { products, name: categoryName } = await CategoryAPI.getOne(
      Number(query.categoryId)
    );

    if (products && categoryName) {
      return {
        products,
        categoryName,
        err: null
      };
    }
  } catch (err) {
    return {
      products: [],
      categoryName: '',
      err: `${err}`
    };
  }

  return {
    products: [],
    categoryName: '',
    err: null
  };
};

export default CategoryPage;
