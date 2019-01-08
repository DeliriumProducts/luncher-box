import { Spin, Icon } from 'antd';

const Spinner = () => {
  <Spin indicator={<Icon style={{ color: '#fff' }} type="loading" spin />} />;
};

export default Spinner;
