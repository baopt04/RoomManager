import React, { useState, useEffect } from "react";
import { Modal, Form, InputNumber, Button, Select, message, Space } from "antd";
import WaterService from "../../services/WaterService";
import RoomService from "../../services/RoomService";

const ModalCreateWater = ({ visible, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [room, setRoom] = useState([]);
    const [canEditPrice, setCanEditPrice] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await RoomService.getAllRooms(token);
                setRoom(response);
            } catch (error) {
                console.error("Không thể kết nối đến service", error);
            }
        };
        if (visible) {
            fetchRoom();
        }
    }, [token, visible]);

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({ 
                unitPrice: 7000,
                status: "CHUA_THANH_TOAN"
            });
            setCanEditPrice(false);
        } else {
            form.resetFields();
        }
    }, [visible, form]);

    const addRoom = (values) => {
        Modal.confirm({
            title: 'Xác nhận thêm chỉ số nước',
            content: 'Bạn có chắc chắn muốn thêm mới chỉ số nước này không?',
            okText: 'Thêm mới',
            cancelText: 'Hủy',
            onOk: async () => {
                setLoading(true);
                try {
                    const payload = {
                        ...values,
                        room: { id: values.room },
                    };
                    await WaterService.createWater(token, payload);
                    message.success("Thêm nước thành công!");
                    form.resetFields();
                    if (onSuccess) {
                        await onSuccess();
                    }
                    onClose();
                } catch (error) {
                    if (error.response) {
                        const messageError = error.response.data?.message;
                        message.error(messageError || "Đã xảy ra lỗi từ server!");
                    } else {
                        message.error("Không thể kết nối đến server!");
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
    };

    return (
        <Modal
            title="Thêm nước của phòng trọ"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={addRoom}
            >
                <Form.Item
                    label="Tên phòng trọ"
                    name="room"
                    rules={[{ required: true, message: "Vui lòng nhập tên nhà thuê" }]}
                >
                    <Select placeholder="Chọn phòng trọ" allowClear>
                        {room.map((roomId) => (
                            <Select.Option key={roomId.id} value={roomId.id}>
                                {roomId.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Số nước đầu tiên"
                    name="numberFirst"
                    rules={[{ required: true, message: "Vui lòng nhập số nước" }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Nhập số nước"
                        min={0}
                    />
                </Form.Item>
                <Form.Item
                    label="Số nước tiếp"
                    name="numberLast"
                    rules={[{ required: true, message: "Vui lòng nhập số nước tiếp" }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Nhập số nước tiếp"
                        min={0}
                    />
                </Form.Item>
                <Form.Item
                    label="Đơn vị tính (VNĐ/m³ - Mặc định: 7,000)"
                    name="unitPrice"
                    rules={[{ required: true, message: "Vui lòng nhập đơn vị tính" }]}
                    extra="Giá tiền mặc định cho mỗi số nước là 7,000 VNĐ"
                >
                    <Space.Compact style={{ width: '100%' }}>
                        <InputNumber
                            style={{ width: "calc(100% - 100px)" }}
                            placeholder="Mặc định: 7,000"
                            min={0}
                            disabled={!canEditPrice}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                        <Button 
                            type={canEditPrice ? "primary" : "default"}
                            onClick={() => setCanEditPrice(!canEditPrice)}
                            style={{ width: '100px' }}
                        >
                            {canEditPrice ? "Thay đổi" : "Mở khóa"}
                        </Button>
                    </Space.Compact>
                </Form.Item>
                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                    <Select placeholder="Chọn trạng thái" allowClear>
                        <Select.Option value="CHUA_THANH_TOAN">Chưa thanh toán</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit" loading={loading} size="large">
                        Thêm nước
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateWater;
