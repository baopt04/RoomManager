import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, message, Upload, Modal } from "antd";
import { data, useNavigate, useParams } from "react-router-dom";
import RoomService from "../../services/RoomService";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import "./CreateRoom.css";
import HouseForRentService from "../../services/HouseForRentService";
import CustomerService from "../../services/CustomerService";
const UpdateRoom = () => {
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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
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
    const updateImage = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const updateRoom = async (values) => {
        Modal.confirm({
            title: 'Xác nhận cập nhật',
            content: 'Bạn có chắc chắn muốn cập nhật thông tin phòng trọ này không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                setLoading(true)
                try {
                    const formData = new FormData();
                    formData.append("name", values.name);
                    formData.append("price", values.price);
                    formData.append("acreage", values.acreage);
                    formData.append("peopleMax", values.peopleMax);
                    formData.append("status", values.status);
                    formData.append("type", values.type);
                    formData.append("houseForRentId", values.houseForRent);
                    if (values.customer) {
                        formData.append("customerId", values.customer);
                    }
                    formData.append("decription", values.decription);

                    const reaminOldUrl = fileList
                        .filter((file) => !file.originFileObj && file.url)
                        .map((file) => file.url);
                    const newFiles = fileList.filter((file) => !!file.originFileObj);
                    if (newFiles.length > 0) {
                        newFiles.forEach((file) => {
                            formData.append("images", file.originFileObj);
                        });
                        reaminOldUrl.forEach((url) => {
                            formData.append("imageUrls", url)
                        });

                    } else if (reaminOldUrl.length > 0) {
                        reaminOldUrl.forEach((url) => {
                            formData.append("imageUrls", url);
                        })
                    }
                    await RoomService.updateRoom(token, roomId, formData);
                    message.success("Cập nhật hợp đồng thành công!");
                    form.resetFields();
                    setFileList([]);
                    navigate('/room-management')
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.message) {
                        message.error(error.response.data.message);
                    }
                    else {
                        message.error("Cập nhật phòng trọ thất bại, vui lòng thử lại sau!");
                    }
                } finally {
                    setLoading(false)
                }
            }
        });
    }
    return (
        <div className="create-room-container">
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/room-management')}
                    style={{ paddingLeft: 0, fontWeight: 500 }}
                >
                    Quay lại
                </Button>
            </div>
            <h2 style={{ textAlign: 'center ', fontSize: isMobile ? '28px' : '30px', marginTop: 0 }}>Cập nhật phòng trọ</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={updateRoom}
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
                            <Select.Option value= "DUNG_KINH_DOANH">Dừng kinh doanh</Select.Option>
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
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('status') === 'DANG_CHO_THUE' ? (
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
                            ) : null
                        }
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
                            onChange={updateImage}
                            beforeUpload={() => false}
                            multiple
                            style={{ display: "flex", gap: 16 }}
                        >
                            {fileList.length < 8 && (
                                <Button icon={<UploadOutlined />} style={{ height: '100px' }}>Chọn ảnh</Button>
                            )}
                        </Upload>
                    </Form.Item>
                </div>
                <div className="form-submit">
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Cập nhật phòng trọ
                    </Button>
                </div>

            </Form>

        </div>
    )
}
export default UpdateRoom;