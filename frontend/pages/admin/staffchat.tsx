import {
  Button,
  Calendar,
  Dropdown,
  Icon,
  Menu,
  Pagination,
  Radio,
  Slider,
  Steps,
  Switch,
  Timeline,
  Transfer
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import RadioGroup from 'antd/lib/radio/group';
import { Component } from 'react';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';

const StaffChat = () => {
  const size = 'large';
  return (
    <FullHeightContainer>
      <div
        style={{
          backgroundColor: '#fafafa',
          height: '100%',
          width: '100%',
          borderRadius: '5%',
          padding: 100
        }}
      >
        <Radio.Group value={size}>
          <Radio.Button value="large">Large</Radio.Button>
          <Radio.Button value="default">Default</Radio.Button>
          <Radio.Button value="small">Small</Radio.Button>
        </Radio.Group>
        <br />
        <br />
        <Button type="primary" size={size}>
          Primary
        </Button>
        <Button size={size}>Normal</Button>
        <Button type="dashed" size={size}>
          Dashed
        </Button>
        <Button type="danger" size={size}>
          Danger
        </Button>
        <br />
        <Button type="primary" shape="circle" icon="download" size={size} />
        <Button type="primary" shape="round" icon="download" size={size}>
          Download
        </Button>
        <Button type="primary" icon="download" size={size}>
          Download
        </Button>
        <br />
        <Button.Group size={size}>
          <Button type="primary">
            <Icon type="left" />
            Backward
          </Button>
          <Button type="primary">
            Forward
            <Icon type="right" />
          </Button>
        </Button.Group>
        <Slider defaultValue={69} tooltipVisible />
        <Pagination defaultCurrent={5} total={50} />
        <RadioGroup value={1}>
          <Radio value={1}>A</Radio>
          <Radio value={2}>B</Radio>
          <Radio value={3}>C</Radio>
          <Radio value={4}>D</Radio>
        </RadioGroup>
        <Switch defaultChecked />
        <TextArea rows={5} />
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://www.alipay.com/"
                >
                  1st menu item
                </a>
              </Menu.Item>
              <Menu.Item>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://www.taobao.com/"
                >
                  2nd menu item
                </a>
              </Menu.Item>
              <Menu.Item>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://www.tmall.com/"
                >
                  3rd menu item
                </a>
              </Menu.Item>
            </Menu>
          }
        >
          <a className="ant-dropdown-link" href="#">
            Hover me <Icon type="down" />
          </a>
        </Dropdown>
        <Autism />
        <Timeline mode="alternate">
          <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
          <Timeline.Item color="green">
            Solve initial network problems 2015-09-01
          </Timeline.Item>
          <Timeline.Item
            dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
          >
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </Timeline.Item>
          <Timeline.Item color="red">
            Network problems being solved 2015-09-01
          </Timeline.Item>
          <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
          <Timeline.Item
            dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}
          >
            Technical testing 2015-09-01
          </Timeline.Item>
        </Timeline>
        <Steps current={1}>
          <Steps.Step title="Finished" description="This is a description." />
          <Steps.Step
            title="In Progress"
            description="This is a description."
          />
          <Steps.Step title="Waiting" description="This is a description." />
        </Steps>
        <Calendar />,
      </div>
    </FullHeightContainer>
  );
};

class Autism extends Component {
  state = {
    mockData: [],
    targetKeys: []
  };

  componentDidMount() {
    this.getMock();
  }

  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
  };

  filterOption = (inputValue, option) =>
    option.description.indexOf(inputValue) > -1;

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  handleSearch = (dir, value) => {};

  render() {
    return (
      <Transfer
        dataSource={this.state.mockData}
        showSearch
        filterOption={this.filterOption}
        targetKeys={this.state.targetKeys}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        render={item => item.title}
      />
    );
  }
}

export default withAuth(StaffChat);
