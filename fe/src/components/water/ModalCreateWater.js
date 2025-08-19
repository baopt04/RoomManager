import React, { useState, useEffect } from "react";
import { Modal, Form, InputNumber, Button, Select, message } from "antd";
import WaterService from "../../services/WaterService";
import RoomService from "../../services/RoomService";
const ModalCreateWater = ({ visible, onClose }) => {
    const [form] = Form.useForm(); // Tạo form instance
    const [loading, setLoading] = useState(false);
    const [room, setRoom] = useState([]);
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
        fetchRoom();
    }, [token]);

    const addRoom = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                room: { id: values.room },
            };
            await WaterService.createWater(token, payload);
            message.success("Thêm nước thành công!");
            window.location.reload();
            form.resetFields(); 
            onClose(); 
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response);
                const messageError = error.response.data?.message;
                if (messageError) {
                    message.error(messageError); 
                } else {
                    message.error("Đã xảy ra lỗi không xác định từ server!");
                }
            } else {
                console.error("Error:", error);
                message.error("Không thể kết nối đến server, vui lòng thử lại!");
            }
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        form.resetFields();
        onClose(); 
    }
    return (
        <Modal
            title="Thêm nước của phòng trọ"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form} // Liên kết form với instance
                layout="vertical"
                onFinish={addRoom} // Xử lý khi submit form
                
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
                    label="Đơn vị tính"
                    name="unitPrice"
                    rules={[{ required: true, message: "Vui lòng nhập đơn vị tính" }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Nhập đơn vị tính"
                        min={0}
                    />
                </Form.Item>
                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                    <Select placeholder="Chọn trạng thái" allowClear>
                        {/* <Select.Option value="DA_THANH_TOAN">Đã thanh toán</Select.Option> */}
                        <Select.Option value="CHUA_THANH_TOAN">Chưa thanh toán</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm nước
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateWater;