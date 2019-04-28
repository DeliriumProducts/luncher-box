import React from 'react';
import Head from 'next/head';
import withAuth from '../../components/withAuth';
import styled from 'styled-components';
import { Table, message, Tag, Input, Button, Icon } from 'antd';
import { NextFunctionComponent, NextContext } from 'next';
import { User } from '../../interfaces';
import { StaffAPI } from '../../api';
import { Role } from '../../types';
import { THEME_VARIABLES } from '../../config';

interface Props {
  staff: User[] | [];
  err: string | null;
}

const FlexContainer = styled.span`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #ffffff00;
  margin: auto;
  border-radius: 7px;

  .ant-table-wrapper {
    overflow-x: auto;
    border-radius: 7px;
    box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);
  }

  thead > tr > th {
    background-color: #f5f5f5;
  }
  .ant-table-row {
    background-color: #fff;
  }
`;

const StaffMembers: NextFunctionComponent<Props> = ({ err, staff }) => {
  const [searchText, setSearchText] = React.useState('');
  const searchInput = React.useRef<Input | null>();

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput.current = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={e => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon
        type="search"
        style={{
          color: filtered ? THEME_VARIABLES['@primary-color'] : undefined
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.current!.focus();
        }, 150);
      }
    }
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email')
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: Role) => {
        const colors = {
          Waiter: 'green',
          Cook: THEME_VARIABLES['@primary-color'],
          Admin: 'volcano'
        };

        return (
          <span>
            <Tag color={colors[role]} key={role}>
              {role.toUpperCase()}
            </Tag>
          </span>
        );
      }
    },
    {
      title: 'Verified',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: value => (value ? 'Yes' : 'No')
    }
  ];

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

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
        <Table pagination={false} dataSource={staff} columns={columns} />
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

export default withAuth(StaffMembers, ['Admin']);
