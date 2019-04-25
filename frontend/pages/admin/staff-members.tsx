import React from 'react';
import Head from 'next/head';
import withAuth from '../../components/withAuth';
import styled from 'styled-components';
import { Table, message } from 'antd';
import { NextFunctionComponent, NextContext } from 'next';
import { User } from '../../interfaces';
import { StaffAPI } from '../../api';

interface Props {
  staff: User[] | [];
  err: string | null;
}

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #fafafa;
  width: 70%;
  margin: auto;
  padding: 2rem;
  border-radius: 7px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }

  box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);
`;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role'
  },
  {
    title: 'Verified',
    dataIndex: 'isVerified',
    key: 'isVerified',
    render: value => (value ? 'Yes' : 'No')
  }
];

const StaffMembers: NextFunctionComponent<Props> = ({ err, staff }) => {
  /**
   * Show only on cDM
   */
  React.useEffect(() => {
    if (err) {
      message.error(`${err}`, 3);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Staff Members • LuncherBox</title>
      </Head>
      <FlexContainer>
        <Table dataSource={staff} columns={columns} />
      </FlexContainer>
    </>
  );
};

StaffMembers.getInitialProps = async ({ req, res }: NextContext) => {
  try {
    let staff: User[] = [];

    /**
     * Check wheter authentication is happening server-side or client-side based on received context
     */
    if (req && res) {
      if (req.headers.cookie) {
        staff = await StaffAPI.getAll({}, req.headers.cookie);
      }
    } else {
      staff = await StaffAPI.getAll();
    }

    console.log(staff);

    staff = staff.map(s => ({
      ...s,
      key: s.id
    }));

    if (staff) {
      return {
        staff,
        err: null
      };
    }
  } catch (err) {
    return {
      staff: [],
      err: `Network Error, Please try again later!`
    };
  }

  return {
    staff: [],
    err: null
  };
};

export default withAuth(StaffMembers);
