import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Radio, Select, InputNumber } from "antd";
import { message } from "antd";
import Services from "../../services/Services";
const { Option } = Select;
const ModalCreateService = ({ visible, onClose, onSuccess }) => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [houseData, setHouseData] = useState(null);


    const handleAddService = (values) => {
        Modal.confirm({
            title: 'Xác nhận thêm dịch vụ mới',
            content: 'Bạn có chắc chắn muốn tạo dịch vụ mới này không?',
            okText: 'Thêm mới',
            cancelText: 'Hủy',
            onOk: async () => {
                setLoading(true);
                try {
                    await Services.createService(token, values);
                    message.success("Thêm dịch vụ thành công!");
                    form.resetFields();
                    if (onSuccess) {
                        await onSuccess();
                    }
                    onClose();
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.message) {
                        message.error(error.response.data.message);
                    } else {
                        message.error("Đã xảy ra lỗi không xác định từ server!");
                    }
                } finally {
                    setLoading(false);
                }
            }
        });
    };
    const handleCancel = () => {
        form.resetFields();
        onClose();
    }
    return (
        <Modal
            title="Thêm dịch vụ "
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={houseData}
                onFinish={handleAddService}
            >
                <Form.Item
                    label="Tên dịch vụ"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
                >
                    <Input placeholder="Nhập tên dịch vụ" />
                </Form.Item>
                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Nhập giá"
                        formatter={(value) =>
                            value?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫'
                        }
                        parser={(value) =>
                            value?.replace(/\₫\s?|(,*)/g, '')
                        }
                        min={0}
                    />
                </Form.Item>
                <Form.Item
                    label="Đơn vị tính"
                    name="unitOfMeasure"
                    rules={[{ required: true, message: "Vui lòng chọn đơn vị tính " }]}
                >
                    <Select placeholder="Chọn đơn vị tính ">
                        <Option value="THÁNG">Tháng</Option>
                        <Option value="NĂM">Năm</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Ghi chú"
                    name="discription"
                    rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
                >
                    <Input.TextArea placeholder="Nhập ghi chú" rows={4} />
                </Form.Item>

                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm dịch vụ
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default ModalCreateService;