import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import Title from "antd/es/typography/Title";
import AdminService from "../../services/AdminService";


const ModalLockerAdmin = ({ visible, onclose, id, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const lockerAdmin = async (values) => {
        Modal.confirm({
            title: 'Khóa thành viên quản trị',
            content: 'Bạn có chắc chắn muốn khóa thành viên quản trị không?',
            okText: 'Khóa',
            cancelText: 'Hủy',
            okType: "danger",
            onOk: async () => {
                try {
                    const lockerAdmin = {
                        ...values,
                        unlocker: "locker"
                    }
                    await AdminService.lockerAdmin(token, id, lockerAdmin);
                    cancelModal();
                    setLoading(true);
                    message.success("Khóa thành viên quản trị thành công")
                    if (onSuccess) {
                        await onSuccess();
                    }
                } catch (error) {
                    message.error("Lỗi")
                    setLoading(false);
                }
            }
        })
    }
    const cancelModal = () => {
        onclose();
        form.resetFields();
    }
    return (
        <Modal
            visible={visible}
            footer={null}
            onCancel={cancelModal}>
            <div style={{ textAlign: 'center' }}>
                <Title
                    level={2}
                    style={{
                        margin: 0,
                        color: '#2d3748',
                        fontWeight: '700',
                        fontSize: '28px',
                        marginBottom: '30px',
                        marginTop: '20px'
                    }}>
                    Khóa tài khoản thành viên quản trị

                </Title>

            </div>
            <Form
                form={form}
                layout='vertical'
                autoComplete='off'
                size='large'
                onFinish={lockerAdmin}
            >
                <Form.Item
                    label={
                        <span style={{
                            color: "#2d3748",
                            fontWeight: "600",
                            fontSize: "14px"
                        }}>
                            👤 Lý do khóa
                        </span>
                    }
                    name="description"
                    rules={[
                        { required: true, message: "Vui lòng nhập lý do khóa!" },
                        { min: 10, message: "Nhập lý do trên 10 ký tự!" }
                    ]}
                    style={{ marginBottom: "18px" }}
                >
                    <Input
                        placeholder="Nhập lý do khóa"
                        style={{
                            borderRadius: "10px",
                            border: "2px solid #e2e8f0",
                            padding: "10px 14px",
                            fontSize: "15px",
                            transition: "all 0.3s ease"
                        }}
                    />
                </Form.Item>
                <Form.Item style={{ marginBottom: "20px" }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={{
                            height: "48px",
                            background: loading
                                ? "#86efac"
                                : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "600",
                            boxShadow: "0 8px 20px rgba(34, 197, 94, 0.4)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.background = "linear-gradient(135deg, #16a34a 0%, #15803d 100%)";
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 12px 25px rgba(34, 197, 94, 0.5)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.background = "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)";
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 8px 20px rgba(34, 197, 94, 0.4)";
                            }
                        }}
                    >
                        {loading ? "🔄 Đang khóa..." : "✨ Khóa tài khoản"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )

}
export default ModalLockerAdmin;

