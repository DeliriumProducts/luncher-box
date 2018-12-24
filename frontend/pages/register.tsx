import { Form, Icon, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { HandleRegister } from '../types';
import CenteredDiv from '../components/CenteredDiv';
import axios from 'axios';

const FormItem = Form.Item;

const Container = styled.div`
  background-color: rgb(245, 245, 245);
  padding: 30px;
  box-shadow: 0 0 10px 5px #ebebeb;
  border-radius: 10px;

  #info {
    text-align: center;
  }

  .register-form {
    max-width: 300px;
  }

  .register-form-button {
    width: 100%;
  }
`;

interface Props extends FormComponentProps {
  handleregister: HandleRegister;
}

type State = {
  loading: boolean;
};

class RegisterForm extends React.Component<Props, State> {
  state = {
    loading: false
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { email, password, name } = values;
        const data = {
          email,
          password,
          name
        };
        const response = await axios.post(
          'http://localhost:8000/auth/register',
          data,
          {
            withCredentials: true
          }
        );
        console.log(response);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;
    return (
      <CenteredDiv>
        <Container>
          <Form onSubmit={this.handleSubmit} className="register-form">
            <p id="info">Register to Create, Update or Delete products</p>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [
                  {
                    type: 'text',
                    message: 'The input is not valid Name!'
                  },
                  {
                    required: true,
                    message: 'Please type your name!'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="text"
                  placeholder="Name"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid Email!'
                  },
                  {
                    required: true,
                    message: 'Please type your Email!'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="email"
                  placeholder="Email"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please type your Password!' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
                loading={loading}
              >
                Register
              </Button>
              Already registered?{' '}
              <Link href="login">
                <a>login now!</a>
              </Link>
            </FormItem>
          </Form>
        </Container>
      </CenteredDiv>
    );
  }
}

export default Form.create()(RegisterForm);
