import { Empty, message } from 'antd';
import { NextFunctionComponent } from 'next';
import Head from 'next/head';
import React from 'react';
import { CategoryAPI } from '../../api';
import CategoryCard from '../../components/CategoryCard';
import FlexContainer from '../../components/FlexContainer';
import PageHeader from '../../components/PageHeader';
import { Category } from '../../interfaces';

interface Props {
  categories: Category[];
  err: string | null;
}

const Home: NextFunctionComponent<Props> = ({ err, categories }) => {
  let data: React.ReactNode[] | React.ReactNode;

  /**
   * Show only on cDM
   */
  React.useEffect(() => {
    if (err) {
      message.error(`${err}`, 3);
    }
  }, []);

  if (categories.length && !err) {
    data = categories.map(category => (
      <CategoryCard key={category.id} {...category} />
    ));
  } else {
    data = <Empty description="No entries found" />;
  }

  return (
    <>
      <Head>
        <title>Menu • LuncherBox</title>
      </Head>
      <FlexContainer>
        <PageHeader
          title={
            <h1>
              <strong>Categories</strong>
            </h1>
          }
          subTitle={
            <h3>
              <strong>({categories.length})</strong>
            </h3>
          }
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

Home.getInitialProps = async () => {
  try {
    const categories = await CategoryAPI.getAll();

    if (categories) {
      return {
        categories,
        err: null
      };
    }
  } catch (err) {
    return {
      categories: [],
      err: `Network Error, Please try again later!`
    };
  }

  return {
    categories: [],
    err: null
  };
};

export default Home;
