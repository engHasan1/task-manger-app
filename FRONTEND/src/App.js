import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    UnorderedListOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AddTask from './components/Tasks/AddTask';
import TaskList from './components/Tasks/TaskList';

const { Header, Sider, Content } = Layout;

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [taskListKey, setTaskListKey] = useState(0);
    const [taskFilter, setTaskFilter] = useState('all');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
            }
        }
    }, []);
    //yeni kod
    useEffect(() => {
        if (user) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [user]);

    const handleLogin = (userData) => {
        console.log('Logging in user:', userData);
        setUser(userData);
        setIsLoggedIn(true);
    };

    const handleRegister = () => {
        setShowRegister(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsLoggedIn(false);
    };

    const handleFilterChange = (filter) => {
        setTaskFilter(filter);
        setTaskListKey(prevKey => prevKey + 1); // لإعادة تحميل TaskList
    };

    const refreshTasks = () => {
        // استدعاء دالة لتحديث قائمة المهام
        setTaskListKey(prevKey => prevKey + 1); // إعادة تحميل TaskList
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {isLoggedIn ? (
                <>
                    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                        <div style={{ padding: '16px', color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <UserOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                                {!collapsed && user && <span>{user.username}</span>}
                            </div>
                            {!collapsed && user && <div style={{ fontSize: '12px' }}>{user.email}</div>}
                        </div>
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={['all']}
                            items={[
                                {
                                    key: 'all',
                                    icon: <UnorderedListOutlined />,
                                    label: 'All Tasks',
                                    onClick: () => handleFilterChange('all')
                                },
                                {
                                    key: 'scheduled',
                                    icon: <ClockCircleOutlined />,
                                    label: 'Scheduled',
                                    onClick: () => handleFilterChange('scheduled')
                                },
                                {
                                    key: 'in_progress',
                                    icon: <ClockCircleOutlined />,
                                    label: 'In Progress',
                                    onClick: () => handleFilterChange('in_progress')
                                },
                                {
                                    key: 'completed',
                                    icon: <CheckCircleOutlined />,
                                    label: 'Completed',
                                    onClick: () => handleFilterChange('completed')
                                },
                                {
                                    key: 'logout',
                                    icon: <LogoutOutlined />,
                                    label: 'Logout',
                                    onClick: handleLogout
                                },
                            ]}
                        />
                    </Sider>
                    <Layout>
                        <Header style={{ padding: 0, background: colorBgContainer }}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </Header>
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                minHeight: 280,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                                overflow: 'auto'
                            }}
                        >
                            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Task Management System</h1>
                            <AddTask onTaskAdded={refreshTasks} />
                            <TaskList key={taskListKey} filter={taskFilter} />
                        </Content>
                    </Layout>
                </>
            ) : (
                <Content
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh'
                    }}
                >
                    {showRegister ? (
                        <Register
                            onRegister={() => setShowRegister(false)}
                            onShowLogin={() => setShowRegister(false)}
                        />
                    ) : (
                        <Login
                            onLogin={handleLogin}
                            onShowRegister={() => setShowRegister(true)}
                        />
                    )}
                </Content>
            )}
        </Layout>
    );
}

export default App;