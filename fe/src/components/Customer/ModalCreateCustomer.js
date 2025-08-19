import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Radio, Select, InputNumber } from "antd";
import { message } from "antd";
import CustomerService from "../../services/CustomerService";
const { Option } = Select; // Import Option from Select
const ModalCreateCustomer = ({ visible, onClose, houseId }) => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const addCustomer = async (values) => {
        setLoading(true);
        try {
            await CustomerService.createCustomer(token, values);
            message.success("Thêm khách hàng thành công!");
            window.location.reload();
            onClose();
        } catch (error) {
            if (error.response) {
                const data = error.response.data;

                if (typeof data.message === "string") {
                    message.error(data.message);
                }
                else if (typeof data === "object") {
                    Object.values(data).forEach((msg) => {
                        message.error(msg);
                    });
                }

            } else {
                message.error("Không thể kết nối đến server, vui lòng kiểm tra lại.");
            }
            setLoading(false);
        };
    };
    const handleCancel = () => {
        form.resetFields();
        onClose();
    }
    return (
        <Modal
            title="Thêm khách hàng"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={addCustomer}
            >
                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên" },
                    { pattern: /^[\p{L}\s]+$/u, message: "Họ và tên chỉ chứa chữ cái và khoảng trắng" },
                    { max: 50, message: "Họ và tên không được vượt quá 50 ký tự" },
                    { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự" }
                    ]}
                >
                    <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="numberPhone"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại" },
                        { pattern: /^0[0-9]{9}$/, message: "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số" }
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    label="Ngày sinh"
                    name="dateOfBirth"
                    rules={[{ required: true, message: "Vui lòng chọn ngày sinh" },
                    {
                        validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            const today = new Date();
                            const dob = new Date(value);
                            const age = today.getFullYear() - dob.getFullYear();
                            const m = today.getMonth() - dob.getMonth();
                            const d = today.getDate() - dob.getDate();
                            if (
                                age < 15 ||
                                (age === 15 && (m < 0 || (m === 0 && d < 0)))
                            ) {
                                return Promise.reject("Khách hàng phải trên 15 tuổi");
                            }
                            return Promise.resolve();
                        }
                    },

                    ]}
                >
                    <Input type="date" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                    { max: 150, message: "Email không được vượt quá 100 ký tự" }
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                    label="Số căn cước"
                    name="cccd"
                    rules={[{ required: true, message: "Vui lòng nhập số căn cước" },
                    { pattern: /^[0-9]{12}$/, message: "Số căn cước phải là 12 chữ số" },
                    { max: 12, message: "Số căn cước không được vượt quá 12 ký tự" }
                    ]}
                >
                    <Input placeholder="Nhập số căn cước" />
                </Form.Item>
                <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                    className="form-item"
                >
                    <Radio.Group>
                        <Radio value={1}>Nam</Radio>
                        <Radio value={0}>Nữ</Radio>
                    </Radio.Group>
                </Form.Item>
               

                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm khách hàng
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default ModalCreateCustomer;