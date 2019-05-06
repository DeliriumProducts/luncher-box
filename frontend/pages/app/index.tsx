import { Empty, message, PageHeader } from 'antd';
import { NextFunctionComponent } from 'next';
import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import { CategoryAPI } from '../../api';
import CategoryCard from '../../components/CategoryCard';
import { Category } from '../../interfaces';

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
        <StyledPageHeader
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
        </StyledPageHeader>
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
