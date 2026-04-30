import React, { useState, useEffect } from "react";
import { Modal, Form, InputNumber, Button, Select, message, Input, } from "antd";
import RoomService from "../../services/RoomService";
import MaintencanceService from "../../services/MaintencanceService";
const ModalCreateMain = ({ visible, onClose, onSuccess }) => {
    const [form] = Form.useForm();
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

    const addMain = (values) => {
        Modal.confirm({
            title: 'Xác nhận thêm phiếu bảo trì',
            content: 'Bạn có chắc chắn muốn tạo phiếu bảo trì mới này không?',
            okText: 'Tạo phiếu',
            cancelText: 'Hủy',
            onOk: async () => {
                setLoading(true);
                try {
                    const payload = {
                        ...values,
                        room: { id: values.room },
                    };
                    await MaintencanceService.createMainTen(token, payload);
                    message.success("Thêm phiếu bảo trì thành công!");
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
    }
    return (
        <Modal
            title="Thêm bảo trì phòng trọ"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={addMain}
            >
                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                    <Select placeholder="Chọn trạng thái" allowClear>
                        <Select.Option value="TAO_PHIEU">Tạo phiếu</Select.Option>
                        <Select.Option value="DANG_SUA_CHUA">Chưa hoàn thành</Select.Option>
                        <Select.Option value="HOAN_THANH">Đã hoàn thành</Select.Option>
                    </Select>
                </Form.Item>

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
                    label="Tên dịch vụ"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
                >
                    <Input
                        style={{ width: "100%" }}
                        placeholder="Nhập tên dịch vụ"
                    />
                </Form.Item>
                <Form.Item
                    label="Ngày tiếp nhận"
                    name="dataRequest"
                    rules={[
                        { required: true, message: "Vui lòng chọn ngày tiếp nhận" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const dataComplete = getFieldValue("dataComplete");
                                if (dataComplete && value > dataComplete) {
                                    return Promise.reject(
                                        new Error("Ngày tiếp nhận không được lớn hơn ngày hoàn thành")
                                    );
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input type="date"
                        style={{ width: "100%" }}

                    />
                </Form.Item>
                <Form.Item
                    shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
                    noStyle >
                    {({ getFieldValue }) =>
                        getFieldValue("status") !== "TAO_PHIEU" && (
                            <Form.Item
                                label="Ngày hoàn thành"
                                name="dataComplete"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const status = getFieldValue("status");
                                            if (status === "HOAN_THANH" && !value) {
                                                return Promise.reject(
                                                    new Error("Vui lòng nhập ngày hoàn thành khi trạng thái là 'Hoàn thành'")
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <Input type="date" style={{ width: "100%" }} />
                            </Form.Item>
                        )
                    }
                </Form.Item>
                <Form.Item
                    label="Đơn giá"
                    name="expense"
                    rules={[{ required: true, message: "Vui lòng nhập đơn giá" }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
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
                    label="Ghi chú"
                    name="description"
                    rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
                >
                    <Input
                        style={{ width: "100%" }}
                        placeholder="Vui lòng nhập ghi chú"
                    />
                </Form.Item>

                <Form.Item style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm dịch vụ
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateMain;