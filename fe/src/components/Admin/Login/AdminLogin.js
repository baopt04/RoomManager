import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Row, Col, Checkbox } from "antd";
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import LoginService from "../../../services/LoginService";
import { useNavigate } from "react-router-dom";
import logo from "../../../layouts/Client/media/tien_duc_land_logo_2.png";

const { Title, Text } = Typography;

const AdminLogin = () => {
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
                navigate('/statistical');
            }, 800);
        } catch (error) {
            console.error("Login failed:", error);
            message.error(error.response?.data?.message || "Sai tài khoản hoặc mật khẩu quản trị!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#fff",
            overflow: "hidden",
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
            <Row style={{ minHeight: "100vh" }}>
                <Col xs={0} lg={12} xl={14} style={{ position: "relative" }}>
                    <div style={{
                        position: "absolute",
                        top: 0, left: 0, width: "100%", height: "100%",
                        backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }} />
                    <div style={{
                        position: "absolute",
                        top: 0, left: 0, width: "100%", height: "100%",
                        background: "linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)",
                        zIndex: 1
                    }} />

                    <div style={{
                        position: "absolute",
                        bottom: "80px", left: "80px",
                        zIndex: 2, color: "#fff", maxWidth: "500px"
                    }}>
                        <Title style={{ color: "#fff", fontSize: "48px", fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                            Hệ Thống <br />Quản Trị Bất Động Sản
                        </Title>
                        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: "18px", display: "block", marginTop: "24px" }}>
                            Nền tảng quản lý vận hành chuyên nghiệp dành cho Tiến Đức Land.
                            Tối ưu hóa quy trình, nâng tầm dịch vụ.
                        </Text>
                    </div>
                </Col>

                <Col xs={24} lg={12} xl={10} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px"
                }}>
                    <div style={{ width: "100%", maxWidth: "420px" }}>
                        <div style={{ marginBottom: "48px", textAlign: "center" }}>
                            <img
                                src={logo}
                                alt="Logo"
                                style={{
                                    height: "100px",
                                    marginBottom: "32px",
                                    cursor: "pointer",
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}
                                onClick={() => navigate('/')}
                            />
                            <Title level={1} style={{ margin: 0, fontWeight: 700, fontSize: "36px", letterSpacing: "-1.5px" }}>
                                Chào mừng trở lại
                            </Title>
                            <Text style={{ color: "#86868b", fontSize: "16px", marginTop: "8px", display: "block" }}>
                                Vui lòng đăng nhập vào tài khoản quản trị viên
                            </Text>
                        </div>

                        <Form layout="vertical" onFinish={onFinish} size="large">
                            <Form.Item
                                label={<Text strong style={{ fontSize: "13px", color: "#1d1d1f" }}>EMAIL QUẢN TRỊ</Text>}
                                name="email"
                                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: "#d2d2d7", marginRight: "8px" }} />}
                                    placeholder="admin@tienducland.vn"
                                    style={{
                                        borderRadius: "12px",
                                        height: "56px",
                                        background: "#f5f5f7",
                                        border: "none",
                                        fontSize: "16px"
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<Text strong style={{ fontSize: "12px", color: "#1d1d1f" }}>MẬT KHẨU</Text>}
                                name="password"
                                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                                style={{ marginBottom: "8px" }}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: "#d2d2d7", marginRight: "8px" }} />}
                                    placeholder="••••••••"
                                    style={{
                                        borderRadius: "12px",
                                        height: "56px",
                                        background: "#f5f5f7",
                                        border: "none",
                                        fontSize: "16px"
                                    }}
                                />
                            </Form.Item>

                            <div style={{ textAlign: "left", marginBottom: "24px" }}>
                                <Button type="link" size="small" style={{ padding: 0, color: "#0071e3", fontSize: "13px", fontWeight: 500 }}>
                                    Quên mật khẩu?
                                </Button>
                            </div>

                            <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: "32px" }}>
                                <Checkbox style={{ color: "#515154" }}>Duy trì đăng nhập trên thiết bị này</Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={loading}
                                    style={{
                                        height: "56px",
                                        borderRadius: "12px",
                                        background: "#000",
                                        border: "none",
                                        fontSize: "17px",
                                        fontWeight: 600,
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>

                        {/* Footer */}
                        <div style={{ textAlign: "center", marginTop: "32px" }}>
                            <Button
                                type="link"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate('/')}
                                style={{ color: "#86868b", fontSize: "14px" }}
                            >
                                Quay lại trang khách hàng
                            </Button>
                        </div>

                        <div style={{ marginTop: "60px", borderTop: "1px solid #f2f2f2", paddingTop: "24px" }}>
                            <Text style={{ color: "#d2d2d7", fontSize: "12px", display: "block" }}>
                                © 2024 TIẾN ĐỨC LAND PORTAL. <br />
                                TRUY CẬP NỘI BỘ CHỈ DÀNH CHO NHÂN VIÊN.
                            </Text>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AdminLogin;
