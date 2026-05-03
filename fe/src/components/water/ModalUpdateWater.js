import React, { useState, useEffect } from "react";
import { Modal, Form, InputNumber, Button, Select, message } from "antd";
import WaterService from "../../services/WaterService";
import RoomService from "../../services/RoomService";
const ModalUpdateWater = ({ visible, onClose, id, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [room, setRoom] = useState([]);
    const [waterData, setDataWater] = useState([])
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

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await WaterService.detailWater(token, id);
                setDataWater(response);
                form.setFieldsValue({
                    room: response.room.id,
                    numberFirst: response.numberFirst,
                    numberLast: response.numberLast,
                    unitPrice: response.unitPrice,
                    status: response.status,

                })
            } catch (error) {
                console.log("Không thể kết nối tới service!");
            }
        }
        fetchDetail();
    }, [token, form, id])

    const updateRoom = (values) => {
        Modal.confirm({
            title: 'Xác nhận cập nhật chỉ số nước',
            content: 'Bạn có chắc chắn muốn lưu các thay đổi cho chỉ số nước này không?',
            okText: 'Cập nhật',
            cancelText: 'Hủy',
            onOk: async () => {
                setLoading(true);
                try {
                    const payload = {
                        ...values,
                        room: { id: values.room },
                    };
                    await WaterService.updateWater(token, id, payload);
                    message.success("Cập nhật thành công!");
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
        onClose();
    }
    return (
        <Modal
            title="Cập nhât nước của phòng trọ"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={updateRoom}

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
                        <Select.Option value="DA_THANH_TOAN">Đã thanh toán</Select.Option>
                        <Select.Option value="CHUA_THANH_TOAN">Chưa thanh toán</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalUpdateWater;
