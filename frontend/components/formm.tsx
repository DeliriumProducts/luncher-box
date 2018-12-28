import React, { Component } from 'react';
import { Form, Icon, Input, InputNumber, Select, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Category, Product } from '../types';
import { UserContext } from '../context';

interface Props extends FormComponentProps {
  handleChange: (e: React.FormEvent<HTMLInputElement>) => void;
}

interface State {
  product: Product;
}

class EntityForm extends Component<Props, State> {
  static contextType = UserContext;

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
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
              prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="text"
              placeholder="Name"
              onChange={this.props.handleChange}
            />
          )}
        </Form.Item>
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
                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.25)' }} />
              }
              type="text"
              placeholder="Description"
              onChange={this.props.handleChange}
            />
          )}
        </Form.Item>{' '}
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
              onChange={this.props.handleChange}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('price', {
            rules: [
              {
                type: 'number',
                message: 'Invalid price'
              },
              {
                required: true,
                message: 'Price field cannot be empty'
              }
            ]
          })(
            <Input
              prefix={
                <Icon type="dollar" style={{ color: 'rgba(0,0,0,.25)' }} />
              }
              type="text"
              placeholder="Price"
              onChange={this.props.handleChange}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('categories', {
            rules: [
              {
                type: 'string',
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
              onChange={this.props.handleChange}
            >
              {this.context.categories}
            </Select>
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(EntityForm);
