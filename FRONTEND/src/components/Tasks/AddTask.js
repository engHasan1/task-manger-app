import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { addTask } from '../../services/api';

const { Option } = Select;

const AddTask = ({ onTaskAdded }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const taskData = {
                title: values.title,
                description: values.description,
                status: values.status
            };
            const response = await addTask(taskData);
            console.log('Task added:', response);
            message.success('Task added successfully');
            form.resetFields();
            if (onTaskAdded) onTaskAdded();
        } catch (error) {
            console.error('Error adding task:', error.response?.data || error.message);
            message.error(error.response?.data?.message || 'Failed to add task');
        }
    };

    return (
        <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ maxWidth: '600px', margin: '0 auto 20px' }}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the task title!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="status" label="Status" initialValue="scheduled">
                <Select>
                    <Select.Option value="scheduled">Scheduled</Select.Option>
                    <Select.Option value="in_progress">In Progress</Select.Option>
                    <Select.Option value="completed">Completed</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Add Task
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddTask;