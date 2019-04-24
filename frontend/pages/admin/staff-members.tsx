import React from 'react';
import Head from 'next/head';
import withAuth from '../../components/withAuth';

const StaffMembers: React.FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>Staff Members • LuncherBox</title>
      </Head>
    </>
  );
};

export default withAuth(StaffMembers);
