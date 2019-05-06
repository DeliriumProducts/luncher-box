import { Empty, message, PageHeader } from 'antd';
import { NextFunctionComponent } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { CategoryAPI } from '../../api';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../interfaces';

const StyledPageHeader = styled(PageHeader)`
  background-color: #fafafa;
  border-radius: 7px;
  flex: 1;

  @media (max-width: 480px) {
    border-radius: 0;
    margin: 0;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  border-radius: 7px;
  box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);

  margin-right: 10%;
  margin-left: 10%;

  @media (max-width: 480px) {
    border-radius: 0;
    margin: 0;
  }
`;

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
      <FlexContainer>{data}</FlexContainer>
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
