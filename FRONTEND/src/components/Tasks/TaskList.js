import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, message, Modal, Input } from 'antd';
import { getTasks, updateTaskStatus, deleteTask, updateTask } from '../../services/api';

const TaskList = ({ filter }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [filter]);

    const fetchTasks = async () => {
        try {
            const response = await getTasks();
            console.log('Fetched tasks:', response.data);
            let filteredTasks = response.data;
            if (filter !== 'all') {
                filteredTasks = response.data.filter(task => task.status === filter);
            }
            setTasks(filteredTasks);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, currentStatus) => {
        let newStatus;
        if (currentStatus === 'scheduled') {
            newStatus = 'in_progress';
        } else if (currentStatus === 'in_progress') {
            newStatus = 'completed';
        } else {
            newStatus = 'scheduled';
        }

        try {
            await updateTaskStatus(taskId, newStatus);
            message.success('Task status updated successfully');
            fetchTasks(); // إعادة تحميل المهام بعد التحديث
        } catch (error) {
            console.error('Error updating task status:', error);
            message.error('Failed to update task status');
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await deleteTask(taskId);
            message.success('Task deleted successfully');
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            message.error('Failed to delete task');
        }
    };

    const showEditModal = (task) => {
        setEditingTask(task);
        setNewTitle(task.title);
        setNewDescription(task.description);
        setEditModalVisible(true);
    };

    const handleEdit = async () => {
        try {
            await updateTask(editingTask._id, { title: newTitle, description: newDescription });
            message.success('Task updated successfully');
            setEditModalVisible(false);
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
            message.error('Failed to update task');
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = status === 'completed' ? 'green' : status === 'in_progress' ? 'geekblue' : 'volcano';
                return (
                    <Tag color={color}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button onClick={() => handleStatusChange(record._id, record.status)}>
                    Change Status
                </Button>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button onClick={() => handleStatusChange(record._id, record.status)}>
                        Change Status
                    </Button>
                    <Button onClick={() => showEditModal(record)} style={{ marginLeft: 8 }}>
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(record._id)} style={{ marginLeft: 8 }}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Task List</h2>
            <Table
                columns={columns}
                dataSource={tasks}
                rowKey="_id"
                loading={loading}
                scroll={{ x: 'max-content' }}
                responsive={['md']}
            />
            <Modal
                title="Edit Task"
                visible={editModalVisible}
                onOk={handleEdit}
                onCancel={() => setEditModalVisible(false)}
            >
                <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="New task title"
                    style={{ marginBottom: '10px' }}
                />
                <Input.TextArea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="New task description"
                    rows={4}
                />
            </Modal>
        </div>
    );
};

export default TaskList;