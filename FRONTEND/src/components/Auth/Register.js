import React from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Flex, message } from 'antd';
import { register } from '../../services/api';

const Register = ({ onShowLogin }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            if (values.password.length < 8) {
                message.error('Password must be at least 8 characters');
                return;
            }
            const response = await register(values.username, values.email, values.password);
            if (response.data) {
                message.success('Account created successfully. Please login.');
                onShowLogin(); // This will redirect the user to the login page after successful account creation
            }
        } catch (err) {
            message.error(err.response?.data?.message || 'An error occurred while creating the account');
        }
    };

    return (
        <Form
            form={form}
            name="register"
            initialValues={{ remember: true }}
            style={{ maxWidth: 360 }}
            onFinish={handleSubmit}
        >
            <h2>Create a new account</h2>
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please enter your username!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                ]}
            >
                <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    { required: true, message: 'Please enter your password!' },
                    { min: 8, message: 'Password must be at least 8 characters' }
                ]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
                <Flex justify="space-between" align="center">
                    <Button type="link" onClick={onShowLogin}>Already have an account</Button>
                </Flex>
            </Form.Item>

            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Create account
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Register;