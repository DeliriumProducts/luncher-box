import React from 'react';
import Head from 'next/head';
import withAuth from '../../components/withAuth';
import styled from 'styled-components';
import {
  Table,
  message,
  Tag,
  Input,
  Button,
  Icon,
  Popconfirm,
  Popover,
  Radio
} from 'antd';
import { NextFunctionComponent, NextContext } from 'next';
import { User } from '../../interfaces';
import { StaffAPI } from '../../api';
import { Role } from '../../types';
import { THEME_VARIABLES } from '../../config';
import ActionButton from '../../components/ActionButton';
import RadioGroup from 'antd/lib/radio/group';
import { RadioChangeEvent } from 'antd/lib/radio';

interface Props {
  staff: User[] | [];
  err: string | null;
  user?: User | null;
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
    & * {
      font-weight: 500;
    }
  }

  .row-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    & > * {
      margin: 5px;
    }

    .maikamu {
      background: green;
      font-size: 24px;
      color: #52c41a;
    }
  }
`;

const StaffMembers: NextFunctionComponent<Props> = ({ err, staff, user }) => {
  const [staffList, setStaffList] = React.useState(staff);
  const [selectedStaffRole, setSelectedStaffRole] = React.useState('Waiter');
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
          onPressEnter={e => handleSearch(confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(confirm)}
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
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      align: 'center',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email')
    },
    {
      title: 'Role',
      align: 'center',
      dataIndex: 'role',
      key: 'role',
      render: (role: Role) => {
        const colors = {
          Waiter: 'green',
          Cook: 'purple',
          Admin: 'magenta'
        };

        return (
          <>
            <Tag color={colors[role]} key={role}>
              {role.toUpperCase()}
            </Tag>
          </>
        );
      }
    },
    {
      title: 'Verified',
      align: 'center',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: value =>
        value ? (
          <Icon
            type="check-circle"
            theme="twoTone"
            twoToneColor="#52c41a"
            style={{ fontSize: 20 }}
          />
        ) : (
          <Icon
            type="close-circle"
            theme="twoTone"
            twoToneColor="#eb2f96"
            style={{ fontSize: 20 }}
          />
        )
    },
    {
      align: 'center',
      title: 'Actions',
      key: 'actions',
      dataIndex: 'id',
      render: (staffId: Partial<User>) => (
        <span className="row-actions">
          <Popover
            title="Available roles"
            trigger="click"
            content={
              <RadioGroup
                style={{ display: 'flex', flexDirection: 'column' }}
                onChange={handleRoleChange}
                value={selectedStaffRole}
              >
                <Radio value={'Waiter'}>Waiter</Radio>
                <Radio value={'Cook'}>Cook</Radio>
                <Radio value={'Admin'}>Admin</Radio>
              </RadioGroup>
            }
          >
            <ActionButton
              icon="edit"
              onClick={() => handleRoleChangeClick(staffId)}
              disabled={staffId === user!.id}
            >
              Change role
            </ActionButton>
          </Popover>
          <Popconfirm
            title={`Are you sure?`}
            okText="Yes"
            onConfirm={() => handleFireClick(staffId)}
          >
            <ActionButton disabled={staffId === user!.id} icon="fire">
              Fire
            </ActionButton>
          </Popconfirm>
        </span>
      )
    }
  ];

  const handleRoleChange = async (e: RadioChangeEvent) => {
    const role = e.target.value;
    setSelectedStaffRole(role);
  };

  const handleRoleChangeClick = async (staffId: Partial<User>) => {
    const selectedStaffIndex = staffList.findIndex(s => s.id === staffId);
    const { role } = staffList[selectedStaffIndex];

    setSelectedStaffRole(role);
  };

  const handleFireClick = async (staffId: Partial<User>) => {
    try {
      await StaffAPI.delete(staffId);

      setStaffList(prevStaffList =>
        prevStaffList.filter(s => s.id !== staffId)
      );

      message.success(`Successfully fired a staff member 🎉`);
    } catch (error) {
      message.error(`${err}`, 3);
    }
  };

  const handleSearch = confirm => {
    confirm();
  };

  const handleReset = clearFilters => {
    clearFilters();
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
        <Table pagination={false} dataSource={staffList} columns={columns} />
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
