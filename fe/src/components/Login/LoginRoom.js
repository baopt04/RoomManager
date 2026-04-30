import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import LoginService from "../../services/LoginService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const LoginRoom = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await LoginService.loginRoom(values);
            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('userName', response.name);
            localStorage.setItem('email', response.email);
            message.success("Đăng nhập thành công!");
            setTimeout(() => {
                navigate('/statistical')
            }, 1000);
            if (onLogin) onLogin(values);
        } catch (error) {
            if (error.response?.data?.message) {
                message.error(error.response.data.message)
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Card
                style={{
                    width: 400,
                    background: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                }}
                bodyStyle={{ padding: "40px 32px 32px" }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            background: "#1677ff",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px auto",
                        }}
                    >
                        <HomeOutlined style={{ fontSize: 22, color: "white" }} />
                    </div>

                    <Title
                        level={3}
                        style={{
                            margin: 0,
                            color: "#1a1a2e",
                            fontWeight: "600",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        Hostel Manager
                    </Title>
                    <Text
                        style={{
                            color: "#6b7280",
                            fontSize: "13px",
                            marginTop: "4px",
                            display: "block",
                        }}
                    >
                        Đăng nhập vào hệ thống quản lý
                    </Text>
                </div>

                {/* Form */}
                <Form
                    name="login_form"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Form.Item
                        label={
                            <span style={{
                                color: "#374151",
                                fontWeight: "500",
                                fontSize: "13px",
                            }}>
                                Email / Tên đăng nhập
                            </span>
                        }
                        name="email"
                        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                        style={{ marginBottom: "16px" }}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: "#9ca3af" }} />}
                            placeholder="Nhập email hoặc tên đăng nhập"
                            style={{
                                borderRadius: "8px",
                                height: "42px",
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <span style={{
                                color: "#374151",
                                fontWeight: "500",
                                fontSize: "13px",
                            }}>
                                Mật khẩu
                            </span>
                        }
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        style={{ marginBottom: "24px" }}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
                            placeholder="Nhập mật khẩu của bạn"
                            style={{
                                borderRadius: "8px",
                                height: "42px",
                            }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                height: "42px",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                            }}
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </Form.Item>
                </Form>

                {/* Footer */}
                <div style={{
                    textAlign: "center",
                    marginTop: "24px",
                    paddingTop: "16px",
                    borderTop: "1px solid #e5e7eb",
                }}>
                    <Text style={{ color: "#9ca3af", fontSize: "12px" }}>
                        © 2025 Hostel Management System
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default LoginRoom;