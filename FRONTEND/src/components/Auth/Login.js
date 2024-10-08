import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import { login, API_URL } from '../../services/api';

const Login = ({ onLogin, onShowRegister }) => {
    const [form] = Form.useForm();
    const [email, setEmail] = useState('');
    // yeniiiii
    const handleSubmit = async (values) => {
        try {
            console.log('Sending login request to:', `${API_URL}/auth/login`);
            console.log('Attempting login with:', values);
            const response = await login(values.email, values.password);
            console.log('Raw login response:', response);
            if (response && response.token && response.user) {
                console.log('Login successful, setting data');
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                onLogin(response.user);
                message.success('Login successful');
            } else {
                console.error('Invalid response structure:', response);
                throw new Error('Invalid response structure');
            }
        } catch (err) {
            console.error('Login error:', err);
            console.error('Error details:', err.response ? err.response.data : err.message);
            console.error('Error stack:', err.stack);
            if (err.message === 'Network Error') {
                message.error('Error connecting to the server. Please check your internet connection and try again.');
            } else if (err.response && err.response.status === 401) {
                message.error('Incorrect email or password');
            } else {
                message.error(err.message || 'Login failed');
            }
        }
    };

    return (
        <Form
            form={form}
            name="login"
            initialValues={{ remember: true }}
            style={{ maxWidth: 360 }}
            onFinish={handleSubmit}
        >
            <h2>Login</h2>
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                ]}
            >
                <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
                <Flex justify="space-between" align="center">
                    <Button type="link" onClick={onShowRegister}>Create a new account</Button>
                </Flex>
            </Form.Item>

            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Login
                </Button>
            </Form.Item>
        </Form>
    );
};


export default Login;