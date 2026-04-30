import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, DatePicker, Upload, Row, Col, message, Typography } from "antd";
import RoomService from "../../services/RoomService";
import ContractService from "../../services/ContractService";
import HouseForRentService from "../../services/HouseForRentService";
import CustomerService from "../../services/CustomerService";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
const { Option } = Select;
const { Title } = Typography;

const { TextArea } = Input;
const DetailContract = () => {
  const [form] = Form.useForm();
  const [roomList, setRoomList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [houseList, setHouseList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const token = localStorage.getItem("token");
  const { contractId } = useParams();
  const [oldImageUrls, setOldImageUrls] = useState([]);
  console.log("Check chạy và");
  const navigator = useNavigate();
  useEffect(() => {

    const fetchRooms = async () => {
      try {
        const res = await RoomService.getAllRooms(token);
        setRoomList(res);
      } catch (error) {
        message.error("Không thể lấy danh sách phòng!");
      }
    };
    fetchRooms();
  }, [token]);
  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await HouseForRentService.getAllHouseForRent(token);
        setHouseList(res);
      }
      catch (error) {
        message.error("Không thể lấy danh sách nhà cho thuê!");
      }
    }
    fetchHouse();
  }, [token]);
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await CustomerService.getAllCustomers(token);
        setCustomerList(res);
      } catch (error) {
        message.error("Không thể lấy danh sách khách hàng!");
      }
    };
    fetchCustomer();
  }, [token]);

  useEffect(() => {
    const fetchContractDetails = async () => {
      console.log("Check chạy hàm", contractId);

      try {
        if (contractId) {
          const response = await ContractService.detailContract(token, contractId);
          console.log("Detail contract:", response);

          form.setFieldsValue({
            dateStart: dayjs(response.dateStart, 'DD/MM/YYYY'),
            dateEnd: dayjs(response.dateEnd, 'DD/MM/YYYY'),
            nextDueDate: dayjs(response.nextDueDate, 'DD/MM/YYYY'),
            contractDeponsit: response.contractDeponsit,
            roomId: response.roomId,
            houseForRentId: response.houseForRentId,
            customerId: response.customerId,
            description: response.description,
            status: response.status
          });


          if (response.imageUrls && Array.isArray(response.imageUrls)) {
            setOldImageUrls(response.imageUrls || []);
            console.log("Check oldImageUrls", oldImageUrls);
            const formattedFileList = response.imageUrls.map((url, index) => ({
              uid: `-${index}`,
              name: `image-${index + 1}.jpg`,
              status: 'done',
              url: url,
            }));
            setFileList(formattedFileList);
          }
        }
      } catch (error) {
        message.error("Không thể lấy thông tin hợp đồng!");
      }
    }
    fetchContractDetails();
  }, [form, token]);

const returnBack = () => {
  navigator("/contract-management");
  form.resetFields();
  setFileList([]);
}



  return (
    <div style={{ maxWidth: 2000, margin: "0 auto", padding: 32, background: "#fff", borderRadius: 8 }}>
      <Title level={2} style={{ textAlign: "center" }}>Chi tiết hợp đồng</Title>
      <Form
        form={form}
        layout="vertical"
      >
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Ngày ký hợp đồng"
              name="dateStart"
              rules={[{ required: true, message: "Vui lòng chọn ngày ký hợp đồng" }]}
            >
              <DatePicker style={{ width: "100%", minWidth: 250 }} format="DD/MM/YYYY" placeholder="Chọn ngày ký hợp đồng" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Ngày hết hạn"
              name="dateEnd"
              rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
            >
              <DatePicker style={{ width: "100%", minWidth: 250 }} format="DD/MM/YYYY" placeholder="Chọn ngày hết hạn hợp đồng" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tiền đặt cọc"
              name="contractDeponsit"
              rules={[{ required: true, message: "Vui lòng nhập tiền đặt cọc" }]}
            >
              <InputNumber
                placeholder="Nhập tiền đặt cọc"
                style={{ width: "100%", minWidth: 250 }}
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                addonAfter="VNĐ"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Ngày thanh toán"
              name="nextDueDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày thanh toán" }]}
            >
              <DatePicker style={{ width: "100%", minWidth: 250 }} format="DD/MM/YYYY" placeholder="Chọn ngày thanh toán tiếp theo" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Phòng trọ thuê"
              name="roomId"
              rules={[{ required: true, message: "Vui lòng chọn phòng trọ" }]}
            >
              <Select placeholder="Chọn phòng trọ ký hợp đồng" style={{ width: "100%", minWidth: 250 }}>
                {roomList.map(room => (
                  <Option key={room.id} value={room.id}>{room.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nhà cho thuê"
              name="houseForRentId"
              rules={[{ required: true, message: "Vui lòng chọn nhà cho thuê" }]}
            >
              <Select placeholder="Chọn nhà cho thuê" style={{ width: "100%", minWidth: 250 }}>
                {houseList.map(houseList => (
                  <Option key={houseList.id} value={houseList.id}>{houseList.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Khách hàng thuê"
              name="customerId"
              rules={[{ required: true, message: "Vui lòng chọn khách hàng thuê" }]}
            >
              <Select placeholder="Chọn khách hàng" style={{ width: "100%", minWidth: 250 }}>
                {customerList.map(customerList => (
                  <Option key={customerList.id} value={customerList.id}>{customerList.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Ghi chú"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
            >
              <Input.TextArea
                placeholder="Nhập ghi chú"
                style={{ width: "100%", minWidth: 250 }}
                rows={1}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái" style={{ width: "100%", minWidth: 250 }}>
                <Option value="KICH_HOAT">Đang sử dụng</Option>
                {/* <Option value="NGUNG_SU_DUNG">Ngừng sử dụng</Option> */}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Ảnh hợp đồng"
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
        <Form.Item style={{ textAlign: "left" }}>
         
          <Button type="primary" danger  style={{ marginLeft: 16 }} onClick={returnBack}>
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DetailContract;

