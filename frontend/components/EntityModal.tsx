import { Modal, Form, Input, Radio, Icon, Select } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { UserContext } from '../context';
import { EntityTypes } from '../types';

interface Props extends FormComponentProps {
  visible: boolean;
  type: EntityTypes;
  loading: boolean;
  onCancel: () => void;
  onCreate: () => void;
}

const EntityModal = Form.create()(
  class extends React.Component<Props> {
    static contextType = UserContext;
    context!: React.ContextType<typeof UserContext>;

    render() {
      const { visible, onCancel, onCreate, form, type } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={`Create a new ${type}`}
          okText="Create"
          okButtonProps={{ loading: this.props.loading }}
          onCancel={onCancel}
          onOk={onCreate}
          centered
        >
          <Form layout="vertical">
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [
                  {
                    type: 'string',
                    message: 'Invalid name'
                  },
                  {
                    required: true,
                    message: 'Name field cannot be empty'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="text"
                  placeholder="Name"
                />
              )}
            </Form.Item>
            {type === 'product' && (
              <Form.Item>
                {getFieldDecorator('description', {
                  rules: [
                    {
                      type: 'string',
                      message: 'Invalid description'
                    },
                    {
                      required: true,
                      message: 'Description field cannot be empty'
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon
                        type="info-circle"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    type="text"
                    placeholder="Description"
                  />
                )}
              </Form.Item>
            )}
            <Form.Item>
              {getFieldDecorator('image', {
                rules: [
                  {
                    type: 'url',
                    message: 'Invalid url'
                  },
                  {
                    required: true,
                    message: 'Image field cannot be empty'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="picture" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="text"
                  placeholder="Image"
                />
              )}
            </Form.Item>
            {type === 'product' && (
              <Form.Item>
                {getFieldDecorator('price', {
                  rules: [
                    {
                      type: 'number',
                      message: 'Invalid price',
                      transform: value => Number(value)
                    },
                    {
                      required: true,
                      message: 'Price field cannot be empty'
                    }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon
                        type="dollar"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    type="number"
                    placeholder="Price"
                  />
                )}
              </Form.Item>
            )}
            {type === 'product' && (
              <Form.Item>
                {getFieldDecorator('categories', {
                  rules: [
                    {
                      type: 'array',
                      message: 'Invalid categories'
                    },
                    {
                      required: true,
                      message: 'Categories field cannot be empty'
                    }
                  ]
                })(
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Please select a category"
                  >
                    {this.context.categories &&
                      this.context.categories.map(category => {
                        return (
                          <Select.Option key={category.id.toString()}>
                            {category.name}
                          </Select.Option>
                        );
                      })}
                  </Select>
                )}
              </Form.Item>
            )}
          </Form>
        </Modal>
      );
    }
  }
);
export default EntityModal;
