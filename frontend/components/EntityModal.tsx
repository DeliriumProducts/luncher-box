import { Form, Icon, Input, Modal, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { AdminContext } from '../context';
import { EntityTypes, ActionTypes, EntityInstance } from '../types';
import { Product, Category } from '../interfaces';

interface Props extends FormComponentProps {
  visible: boolean;
  entity?: EntityInstance;
  entityType: EntityTypes;
  actionType: ActionTypes;
  loading: boolean;
  onCancel: () => void;
  onCreate: () => void;
}

const EntityModal = Form.create()(
  class extends React.Component<Props> {
    static contextType = AdminContext;
    context!: React.ContextType<typeof AdminContext>;

    capitalizeFirstLetter = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

    render() {
      const {
        visible,
        onCancel,
        onCreate,
        form,
        entityType,
        loading,
        entity
      } = this.props;

      const { getFieldDecorator } = form;

      const actionType = this.capitalizeFirstLetter(this.props.actionType);

      return (
        <Modal
          visible={visible}
          title={`${actionType} a ${entityType}`}
          okText={`${actionType}`}
          okButtonProps={{ loading }}
          onCancel={onCancel}
          onOk={onCreate}
          centered
          destroyOnClose
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
                ],
                initialValue: entity && entity.name
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
            {entityType === 'product' && (
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
                  ],
                  initialValue: entity && (entity as Product).description
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
                ],
                initialValue: entity && entity.image
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
            {entityType === 'product' && (
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
                  ],
                  initialValue: entity && (entity as Product).price
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
            {entityType === 'product' && (
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
                  ],
                  initialValue:
                    entity &&
                    (entity as Product).categories &&
                    (entity as Product).categories.map(category => category.id)
                })(
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Please select a category"
                  >
                    {this.context.entities.categories &&
                      this.context.entities.categories.map(
                        (category: Category) => (
                          <Select.Option
                            value={category.id}
                            key={category.id.toString()}
                          >
                            {category.name}
                          </Select.Option>
                        )
                      )}
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
