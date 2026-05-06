import React, { useState, useEffect } from "react";
import { Modal, Tabs, Table, Button } from "antd";
import WaterService from "../../services/WaterService";
import ElectricityService from "../../services/ElectricityService";
import RoomService from "../../services/RoomService";
import StatisticalService from "../../services/StatisticalService";
import CustomerService from "../../services/CustomerService";
const { TabPane } = Tabs;
const ModalSearchStatistical = ({ visible, onClose, roomId }) => {
    const [listDataWater, setListDataWater] = useState([]);
    const [listDataElectricity, setListDataElectricity] = useState([]);
    const [listDataRoom, setListDataRoom] = useState([]);
    const [listDataService, setListDataService] = useState([]);
    const [dataCustomer, setDataCustomer] = useState([]);
    const token = localStorage.getItem("token");



    const tabColumnsWaterAndEletricity = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1
        },
        { title: "Tháng", dataIndex: "month", key: "month" },
        { title: "Năm", dataIndex: "year", key: "yearv" },
        { title: "Số điện đầu", dataIndex: "numberFirst", key: "numberFirst"  ,
            render : (numberFirst) => numberFirst ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
            }).format(numberFirst) : "Chưa có dữ liệu"
        },
        { title: "Số điện cuối", dataIndex: "numberLast", key: "numberLast"  
            , render : (numberLast) => numberLast.toLocaleString("vi-VN") + " đ"
        },
        { title: "Đơn giá", dataIndex: "unitPrice", key: "unitPrice" ,
            render : (unitPrice) => unitPrice ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND" 
            }).format(unitPrice) : "Chưa có dữ liệu"
         },
        { title: "Tổng tiền", dataIndex: "totalPrice", key: "totalPrice"  ,
            render: (totalPrice) => totalPrice ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
            }).format(totalPrice) : "Chưa có dữ liệu"
        },
        { title: "Trạng thái", dataIndex: "status", key: "status" , 
            render: (status) => status ? 
            <span style={{ color: "green" }}>Đã thanh toán</span> :
            <span style={{ color: "red" }}>Chưa thanh toán</span>
         },
    ];
    const tabColumnsRoom = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1
        },
        { title: "Ngày bắt đầu", dataIndex: "startDate", key: "startDate" },
        { title: "Ngày kết thúc", dataIndex: "endDate", key: "endDate" },
        { title: "Giá phòng ", dataIndex: "price", key: "price"  ,
            render: (price) => price ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
            }).format(price) : "Chưa có dữ liệu"
        },
        {
            title: "Khách hàng", dataIndex: "customer", key: "customer",
            render: (customer) => {
                const customerName = dataCustomer.find((item) => item.id === customer)?.name;
                return customerName || "Chưa có khách thuê";
            }
        },
        { title: "Trạng thái", dataIndex: "status", key: "status" , 
            render: (status) => status ? (
                <span style={{ color: "green" }}>Đã thanh toán</span>
            ) : (
                <span style={{ color: "red" }}>Chưa thanh toán</span>
            )
         },
        {
            title: "Thanh toán", dataIndex: "isPaid", key: "isPaid",
            render: (isPaid) => isPaid ? (
                <span style={{ color: "green" }}>Đã thanh toán</span>
            ) : (
                <span style={{ color: "red" }}>Chưa thanh toán</span>
            )
        },
    ];
    const tabColumnsService = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1
        },
        { title: "Tên dịch vụ", dataIndex: "serviceName", key: "serviceName" },
        { title: "Giá tiền", dataIndex: "servicePrice", key: "servicePrice" ,
            render: (servicePrice) => servicePrice ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
            }).format(servicePrice) : "Chưa có dữ liệu"
         },
    ]

    const historyWater = async (id) => {
        try {
            const response = await WaterService.historyWater(token, id);
            setListDataWater(response);
            

        } catch (error) {
            console.error("Error fetching water history:", error);
        }
    }

    const historyElectricity = async (id) => {
        try {
            const response = await ElectricityService.historyElectricity(token, id);
            setListDataElectricity(response);
            

        } catch (error) {
            console.error("Error fetching water history:", error);
        }
    }
    const historyRoom = async (id) => {
        try {
            const response = await RoomService.findAllRoomHistory(token, id);
            setListDataRoom(response);
            
        } catch (error) {
            console.error("Error fetching room history:", error);
        }
    }
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await CustomerService.getAllCustomers(token);
                
                setDataCustomer(response);
            } catch (error) {
                console.error("Failed to fetch customer data:", error);
            }
        };
        fetchCustomer();
    }, [token])

    useEffect(() => {
        
        if (visible && roomId) {
            searchHistoryRoom(roomId);

        }
    }, [visible, roomId]);

    const searchHistoryRoom = async (id) => {
        try {
            const response = await StatisticalService.searchHistoryRoom(token, id);
            const waterId = response[0]?.waterId;
            const electricityId = response[0]?.electricityId;
            const roomId = response[0]?.roomId;
           const serviceData = response.map((item , id) => ({
            key : id + 1 ,
            serviceId : item.serviceId,
            serviceName : item.serviceName,
            servicePrice : item.servicePrice
           }));
           setListDataService(serviceData);
            if (waterId) {
                historyWater(waterId);
            } if (electricityId) {
                historyElectricity(electricityId);
            }
            if (roomId) {
                historyRoom(roomId);
            }
           

        } catch (error) {
            console.error("Error fetching room history:", error);
        }
    };



    return (
        <Modal
            title="Chi tiết thống kê"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={900}
        >
            <Tabs defaultActiveKey="1">
                <TabPane tab="Phòng trọ" key="1">
                    <Table columns={tabColumnsRoom} dataSource={listDataRoom} pagination={false} />
                </TabPane>
                <TabPane tab="Điện phòng trọ " key="2">
                    <Table columns={tabColumnsWaterAndEletricity} dataSource={listDataElectricity} pagination={false} />
                </TabPane>
                <TabPane tab="Nước phòng trọ" key="3">
                    <Table columns={tabColumnsWaterAndEletricity} dataSource={listDataWater} pagination={false} />
                </TabPane>
                <TabPane tab="Dịch vụ phòng trọ" key="4">
                    <Table columns={tabColumnsService} dataSource={listDataService} pagination={false} />
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default ModalSearchStatistical;

