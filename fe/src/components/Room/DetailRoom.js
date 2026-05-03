import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, message, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import RoomService from "../../services/RoomService";
import "./CreateRoom.css";
import HouseForRentService from "../../services/HouseForRentService";
import CustomerService from "../../services/CustomerService";
const DetailRoom = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const [houseForRentData, setHouseForRentData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [roomData, setRoomData] = useState([]);
    const { roomId } = useParams();
    const [fileList, setFileList] = useState([]);
    const [listImage, setListImage] = useState([]);
    useEffect(() => {
        const fetchHouseForRent = async () => {
            try {
                const response = await HouseForRentService.getAllHouseForRent(token);
                setHouseForRentData(response);
            } catch (error) {
                console.error("Failed to fetch house for rent data:", error);
            }
        }
        fetchHouseForRent();
    }, [token]);
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await CustomerService.getAllCustomers(token);
                setCustomerData(response);
            } catch (error) {
                console.error("Failed to fetch customer data:", error);
            }
        };
        fetchCustomer();
    }, [token]);

    useEffect(() => {
        const fetchHouseDetail = async () => {
            try {
                const responsee = await RoomService.detailRoom(token, roomId)
                form.setFieldsValue({
                    name: responsee.name,
                    price: responsee.price,
                    acreage: responsee.acreage,
                    peopleMax: responsee.peopleMax,
                    decription: responsee.decription,
                    type: responsee.type,
                    status: responsee.status,
                    houseForRent: responsee.houseForRentId,
                    customer: responsee.customerId,

                })
                const image = await RoomService.detailImage(token, roomId);
                const convertedImages = image.map((img, index) => ({
                    uid: img.id || `-${index}`,
                    name: `Ảnh ${index + 1}`,
                    status: 'done',
                    url: img.name
                }));

                setFileList(convertedImages);
            } catch (error) {
                console.log("Error load update");
            }
        }
        fetchHouseDetail();

    }, [token, roomId, form])


    return (
        <div className="create-room-container">
            <div style={{ marginBottom: 16 }}>
                <Button type="text" onClick={() => navigate('/admin/rooms')} style={{ paddingLeft: 0, fontWeight: 500 }}>
                    Quay lại
                </Button>
            </div>
            <h2 style={{ textAlign: 'center ', fontSize: '30px' }}>Chi tiết phòng trọ</h2>
            <Form
                form={form}
                layout="vertical"
                style={{ maxWidth: "auto", margin: "0 auto" }}
            >
                <div className="form-row">
                    <Form.Item
                        label="Tên phòng trọ"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên phòng trọ" }]}
                        className="form-item">
                        <Input placeholder="Nhập tên phòng trọ" />
                    </Form.Item>
                    <Form.Item label="Giá phòng trọ"
                        name="price"
                        rules={[{ required: true, message: "Vui lòng nhập giá phòng trọ" }]}
                        className="form-item">
                        <InputNumber placeholder="Nhập giá phòng trọ"
                            style={{ width: '100%' }}
                            formatter={(value) =>
                                value?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫'
                            }
                            parser={(value) =>
                                value?.replace(/\₫\s?|(,*)/g, '')
                            }
                            min={0}
                        />
                    </Form.Item>

                </div>

                <div className="form-row">
                    <Form.Item
                        label="Diện tích phòng trọ"
                        name="acreage"
                        rules={[{ required: true, message: "Vui lòng nhập diện tích phòng trọ" }]}
                        className="form-item">
                        <Input placeholder="Nhập diện tích  phòng trọ" />
                    </Form.Item>
                    <Form.Item label="Số lượng người ở"
                        name="peopleMax"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng người ở" }]}
                        className="form-item">
                        <InputNumber placeholder="Nhập số lượng người ở"
                            style={{ width: '100%' }} />
                    </Form.Item>


                </div>

                <div className="form-row">
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                        className="form-item">
                        <Select placeholder="Chọn trạng thái" allowClear>
                            <Select.Option value="DANG_CHO_THUE">Đang cho thuê</Select.Option>
                            <Select.Option value="TRONG">Trống</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Loại phòng"
                        name="type"
                        rules={[{ required: true, message: "Vui lòng nhập loại phòng trọ" }]}
                        className="form-item">
                        <Input placeholder="Nhập loại  phòng trọ" />
                    </Form.Item>
                </div>
                <div className="form-row">
                    <Form.Item
                        label="Nhà cho thuê"
                        name="houseForRent"
                        rules={[{ required: true, message: "Vui lòng chọn nhà cho thuê" }]}
                        className="form-item">
                        <Select placeholder="Chọn nhà cho thuê" allowClear>
                            {houseForRentData.map((house) => (
                                <Select.Option key={house.id} value={house.id}>
                                    {house.name}
                                </Select.Option>
                            ))}

                        </Select>
                    </Form.Item>
                    <Form.Item label="Người đại diện thuê"
                        name="customer"
                        rules={[{ required: true, message: "Vui lòng chọn người đại diện thuê" }]}
                        className="form-item">
                        <Select placeholder="Chọn người đại diện thuê" allowClear>
                            {customerData.map((customer) => (
                                <Select.Option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>


                </div>
                <div className="form-row">

                    <Form.Item label="Mô tả phòng trọ"
                        name="decription"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                        className="form-item"
                        style={{ lineHeight: '1' }}>
                        <Input.TextArea placeholder="Nhập mô tả phòng trọ" rows={4} />
                    </Form.Item>


                </div>
                <div className="form-row">

                    <Form.Item
                        label="Ảnh phòng trọ"
                        name="images"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            beforeUpload={() => false}
                            multiple
                            style={{ display: "flex", gap: 16 }}
                        >

                        </Upload>
                    </Form.Item>
                </div>
                <div className="form-submit">

                    <Button type="primary" onClick={() => navigate(`/admin/rooms/${roomId}/edit`)}>
                        Sửa
                    </Button>
                    <Button style={{ marginLeft: "10px" }} onClick={() => navigate('/admin/rooms')}>
                        Về danh sách
                    </Button>
                </div>

            </Form>

        </div>
    )
}
export default DetailRoom;
