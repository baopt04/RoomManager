import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Radio, Select, InputNumber } from "antd";
import { message } from "antd";
import CustomerService from "../../services/CustomerService";
const { Option } = Select;
const ModalUpdateCustomer = ({ visible, onClose, id, onSuccess }) => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {

                const response = await CustomerService.detailCustomer(token, id);
                const formatDateOfBirth = response.dateOfBirth ? new Date(response.dateOfBirth).toISOString().split("T")[0] : null;

                const values = {
                    ...response,
                    dateOfBirth: formatDateOfBirth
                }
                form.setFieldsValue(values);
            } catch (error) {
                

            }
        }
        fetchCustomer()
    }, [token, id])
    const UpdateCustomer = (values) => {
        Modal.confirm({
            title: "Xác nhận cập nhật khách hàng",
            content: "Bạn có chắc chắn muốn cập nhật thông tin khách hàng này không?",
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                setLoading(true);
                try {
                    await CustomerService.updateCustomer(token, id, values);
                    message.success("Cập nhật khách hàng thành công!");
                    if (onSuccess) {
                        await onSuccess();
                    }
                    onClose();
                } catch (error) {
                    if (error.response) {
                        const data = error.response.data;
                        if (typeof data.message === "string") {
                            message.error(data.message);
                        } else if (typeof data === "object") {
                            Object.values(data).forEach((msg) => {
                                message.error(msg);
                            });
                        }
                    } else {
                        message.error("Không thể kết nối đến server, vui lòng kiểm tra lại.");
                    }
                    setLoading(false);
                }
            },
        });
    };
    const handleCancel = () => {
        form.resetFields();
        onClose();
    }
    return (
        <Modal
            title="Cập nhật khách hàng"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={UpdateCustomer}
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
                        <Radio value={true}>Nam</Radio>
                        <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                    className="form-item"
                >
                    <Radio.Group>
                        <Radio value='DANG_HOAT_DONG'>Đang hoạt động</Radio>
                        <Radio value='NGUNG_HOAT_DONG'>Ngưng hoạt động</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Cập nhật khách hàng
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )   
}
export default ModalUpdateCustomer;

