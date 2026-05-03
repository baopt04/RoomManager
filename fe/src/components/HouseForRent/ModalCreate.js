import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Radio, Select, InputNumber } from "antd";
import { message } from "antd";
import HostService from "../../services/HostService";
import HouseForRentService from "../../services/HouseForRentService";
const { Option } = Select;
const ModalCreate = ({ visible, onClose, onSuccess }) => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [houseData, setHouseData] = useState(null);
    const [hostData, setHostData] = useState([]);
    useEffect(() => {
        const fetchHostDate = async () => {
            try {
                const data = await HostService.getAllHosts(token);
                setHostData(data);
            } catch (error) {
                console.error("Error fetching host data:", error);
            }
        }
        if (visible) {
            fetchHostDate();
        }

    }, [visible, token]);
    const handleAddHouse = async (values) => {
        Modal.confirm({
            title: 'Xác nhận thêm nhà cho thuê',
            content: 'Bạn có chắc chắn muốn thêm nhà cho thuê mới này không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                setLoading(true);
                try {
                    const payload = {
                        ...values,
                        host: { id: values.host },
                    };
                    await HouseForRentService.createHouseForRent(token, payload);
                    message.success("Thêm nhà cho thuê thành công!");
                    if (onSuccess) onSuccess();
                    onClose();
                } catch (error) {
                    console.log("Error in catch:", error);
                    if (error.response && error.response.data) {
                        const messageError = error.response.data.message;
                        if (messageError.includes("Tên đã tồn tại")) {
                            message.error("Tên nhà đã tồn tại, vui lòng sử dụng tên khác.");
                        } else {
                            message.error(messageError || "Dữ liệu không hợp lệ!");
                        }
                    } else {
                        message.error("Không thể kết nối đến server, vui lòng kiểm tra lại.");
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
            title="Thêm nhà cho thuê"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
            styles={{
                content: {
                    borderRadius: "20px",
                    overflow: "hidden"
                }
            }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={houseData}
                onFinish={handleAddHouse}
            >
                <Form.Item
                    label="Tên nhà thuê"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên nhà thuê" },
                    // { pattern: /^[\p{L}\d\s]+$/u, message: "Tên nhà thuê chỉ được chứa chữ cái, số và khoảng trắng" },
                    { max: 100, message: "Tên nhà thuê không được vượt quá 100 ký tự" },
                    { min: 2, message: "Tên nhà thuê phải có ít nhất 2 ký tự" }
                    ]}
                >
                    <Input placeholder="Nhập tên nhà thuê" />
                </Form.Item>
                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ" },
                    { pattern: /^[\p{L}\d\s,.-]+$/u, message: "Địa chỉ chỉ được chứa chữ cái, số, dấu phẩy, dấu chấm và dấu gạch ngang" },
                    { max: 200, message: "Địa chỉ không được vượt quá 200 ký tự" },
                    { min: 2, message: "Địa chỉ phải có ít nhất 2 ký tự" }
                    ]}
                >
                    <Input placeholder="Nhập địa chỉ" />
                </Form.Item>

                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[{ required: true, message: "Vui lòng nhập giá" },
                    { type: 'number', min: 0, message: "Giá phải là một số dương" },
                    {
                        validator: (_, value) => {
                            if (value > 1000000000) {
                                return Promise.reject("Giá không được vượt quá 1 tỷ");
                            }
                            return Promise.resolve();
                        }
                    }

                    ]}
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
                    label="Chọn chủ nhà"
                    name="host"
                    rules={[{ required: true, message: "Vui lòng chọn chủ nhà" }]}
                >
                    <Select
                        placeholder="Chọn chủ nhà"
                        allowClear
                    >
                        {hostData.map((host) => (
                            <Option key={host.id} value={host.id}>
                                {host.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Ghi chú"
                    name="discription"
                    rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
                >
                    <Input.TextArea placeholder="Nhập ghi chú" rows={4} />
                </Form.Item>
                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Option value="DANG_THUE">Đang thuê</Option>
                    </Select>

                </Form.Item>
                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm nhà cho thuê
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default ModalCreate;
