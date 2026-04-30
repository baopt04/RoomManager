import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Spin, Button, Space, Divider, message, Breadcrumb, Modal, Form, Input, DatePicker, Image } from 'antd';
import { EnvironmentOutlined, DollarOutlined, ColumnWidthOutlined, TeamOutlined, PhoneOutlined, ArrowLeftOutlined, CheckCircleFilled, HomeOutlined } from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRoomDetail } from '../../../services/customer/HomeService';
import { createRoomViewing } from '../../../services/customer/RoomViewing';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const RoomDetailClient = () => {
  const { slugAndId } = useParams();
  const id = slugAndId?.substring(slugAndId.length - 36);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = async (values) => {
    Modal.confirm({
      title: 'Xác nhận thông tin',
      content: (
        <div>
          <p><strong>Họ tên:</strong> {values.name}</p>
          <p><strong>Số điện thoại:</strong> {values.phone}</p>
          <p><strong>Ngày xem:</strong> {values.viewDate ? dayjs(values.viewDate).format('DD/MM/YYYY HH:mm') : 'N/A'}</p>
          <p><strong>Ghi chú:</strong> {values.note || 'Không có'}</p>
          <p style={{ marginTop: '16px', color: '#86868b' }}>Bạn có chắc chắn muốn gửi yêu cầu xem phòng này không?</p>
        </div>
      ),
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      centered: true,
      onOk: async () => {
        setSubmitting(true);
        try {
          const payload = {
            name: values.name,
            phone: values.phone,
            idRoom: room.id,
            viewDate: values.viewDate ? dayjs(values.viewDate).format('DD-MM-YYYY HH:mm:ss') : null,
            note: values.note || ""
          };

          await createRoomViewing(payload);

          message.success('Gửi yêu cầu thành công! Chủ nhà sẽ liên hệ với bạn trong thời gian sớm nhất.');
          form.resetFields();
          setIsModalVisible(false);
        } catch (error) {
          console.error("Failed to create room viewing:", error);
          message.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
        } finally {
          setSubmitting(false);
        }
      }
    });
  };

  // Helper images in case there are none or not enough from API
  const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200"
  ];

  const formatCurrency = (amount) => {
    if (!amount) return "Liên hệ";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount).replace("₫", "VNĐ");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchRoomData = async () => {
      setLoading(true);
      try {
        const roomData = await getRoomDetail(id);
        setRoom(roomData);

        if (roomData.images && roomData.images.length > 0) {
          setImages(roomData.images);
        } else {
          setImages(DEFAULT_IMAGES);
        }

      } catch (error) {
        console.error("Failed to load room data:", error);
        message.error("Không thể tải thông tin phòng!");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoomData();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '150px 0', background: '#f5f5f7', minHeight: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!room) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', background: '#f5f5f7', minHeight: '80vh' }}>
        <Title level={3}>Không tìm thấy thông tin phòng</Title>
        <Button onClick={() => navigate('/')}>Về trang chủ</Button>
      </div>
    );
  }

  const displayImages = [...images];
  while (displayImages.length < 5) {
    displayImages.push(DEFAULT_IMAGES[displayImages.length % DEFAULT_IMAGES.length]);
  }

  return (
    <div style={{ background: '#f5f5f7', paddingBottom: '80px', minHeight: '100vh' }}>

      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '16px 0', position: 'sticky', top: 60, zIndex: 90 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
          <Breadcrumb
            separator=">"
            style={{ fontSize: '15px', fontWeight: 500 }}
            items={[
              { title: <Link to="/" style={{ color: '#86868b' }}>Trang chủ</Link> },
              { title: <span style={{ color: '#86868b' }}>{room.houseForRent?.nameHouse || room.houseForRent?.name || "Khu vực"}</span> },
              { title: <span style={{ color: '#1d1d1f' }}>Chi tiết {room.name || `Phòng ${room.code || slugAndId}`}</span> }
            ]}
          />
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>

        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <Image.PreviewGroup>
            <Row gutter={[12, 12]} style={{
              height: window.innerWidth > 768 ? '500px' : '300px',
              borderRadius: '24px',
              overflow: 'hidden'
            }}>
              <Col xs={24} md={12} style={{ height: '100%' }}>
                <div style={{ height: '100%', overflow: 'hidden', borderRadius: '12px' }}>
                  <Image
                    src={displayImages[0]}
                    alt="Main"
                    wrapperStyle={{ width: '100%', height: '100%' }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              </Col>

              <Col xs={0} md={12} style={{ height: '100%' }}>
                <Row gutter={[12, 12]} style={{ height: '100%' }}>
                  {displayImages.slice(1, 5).map((img, idx) => (
                    <Col span={12} key={idx} style={{ height: 'calc(50% - 6px)' }}>
                      <div style={{
                        height: '100%',
                        overflow: 'hidden',
                        borderRadius: '12px',
                        position: 'relative'
                      }}>
                        <Image
                          src={img}
                          alt={`Room ${idx + 2}`}
                          wrapperStyle={{ width: '100%', height: '100%' }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            transition: 'transform 0.5s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        {idx === 3 && displayImages.length > 5 && (
                          <div
                            style={{
                              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                              background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 600,
                              pointerEvents: 'none', borderRadius: '12px'
                            }}
                          >
                            +{displayImages.length - 4} ảnh
                          </div>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>

              {/* Hidden Images for PreviewGroup (to enable scrolling through all) */}
              <div style={{ display: 'none' }}>
                {displayImages.slice(5).map((img, idx) => (
                  <Image key={idx + 5} src={img} />
                ))}
              </div>
            </Row>
          </Image.PreviewGroup>

          <Button
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '24px',
              borderRadius: '12px',
              fontWeight: 600,
              padding: '10px 20px',
              height: 'auto',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #1d1d1f',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={() => {
              const firstImage = document.querySelector('.ant-image-img');
              if (firstImage) firstImage.click();
            }}
          >
            <CheckCircleFilled style={{ fontSize: '16px' }} />
            Xem tất cả {images.length || 5} ảnh
          </Button>
        </div>

        <Row gutter={[40, 40]}>

          <Col xs={24} lg={16}>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '32px', letterSpacing: '-0.5px' }}>
                  {room.name || `Phòng ${room.code || slugAndId}`}
                </Title>
              </div>

              <Text style={{ fontSize: '16px', color: '#515154', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
                <EnvironmentOutlined /> Tầng {room.floor || "Không xác định"} · Gần cửa sổ thoáng mát
              </Text>

              <Divider style={{ margin: '16px 0' }} />

              <Row gutter={[16, 16]} style={{ margin: '24px 0' }}>
                <Col span={8}>
                  <Space direction="vertical" size={2}>
                    <Text type="secondary" style={{ fontSize: '13px' }}><ColumnWidthOutlined /> Diện tích</Text>
                    <Text strong style={{ fontSize: '16px' }}>{room.acreage} m²</Text>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space direction="vertical" size={2}>
                    <Text type="secondary" style={{ fontSize: '13px' }}><TeamOutlined /> Sức chứa</Text>
                    <Text strong style={{ fontSize: '16px' }}>Tối đa {room.peopleMax} người</Text>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space direction="vertical" size={2}>
                    <Text type="secondary" style={{ fontSize: '13px' }}><HomeOutlined /> Trạng thái</Text>
                    <Text strong style={{ fontSize: '16px', color: '#0071e3' }}>Có phòng trống</Text>
                  </Space>
                </Col>
              </Row>

              <Divider style={{ margin: '16px 0' }} />

              <Title level={4} style={{ marginTop: '24px', marginBottom: '16px', fontWeight: 600 }}>Thông tin chi tiết</Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.7', color: '#1d1d1f' }}>
                Phòng trọ cao cấp, thiết kế hiện đại, đầy đủ tiện ích phù hợp cho sinh viên và người đi làm.
                Không gian sinh hoạt rộng rãi {room.acreage} m², có cửa sổ đón nắng và gió tự nhiên, giúp phòng luôn thông thoáng.
              </Paragraph>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.7', color: '#1d1d1f' }}>
                • Giờ giấc tự do, không chung chủ<br />
                • Vệ sinh khép kín sạch sẽ<br />
                • Hệ thống an ninh camera 24/24<br />
                • Xe để ở tầng trệt rộng rãi an toàn
              </Paragraph>

              <Title level={4} style={{ marginTop: '40px', marginBottom: '16px', fontWeight: 600 }}>Nội thất bao gồm</Title>
              <Row gutter={[16, 16]}>
                {['Máy lạnh Inverter', 'Giường & Nệm', 'Tủ quần áo', 'Tủ lạnh', 'Kệ bếp', 'Nước nóng lạnh'].map((item, idx) => (
                  <Col span={12} key={idx}>
                    <Text style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircleFilled style={{ color: '#000' }} /> {item}
                    </Text>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <div style={{ position: 'sticky', top: '150px' }}>
              <Card
                style={{
                  borderRadius: '24px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                  overflow: 'hidden'
                }}
                bodyStyle={{ padding: '32px' }}
              >
                <Text style={{ fontSize: '24px', fontWeight: 700, color: '#1d1d1f', display: 'block', marginBottom: '8px' }}>
                  {formatCurrency(room.price)}
                  <span style={{ fontSize: '16px', fontWeight: 400, color: '#86868b' }}> / tháng</span>
                </Text>

                <Divider style={{ margin: '24px 0' }} />

                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Chi phí phụ khác</Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <Text style={{ color: '#1d1d1f' }}>Điện</Text>
                      <Text strong>{formatCurrency(room.electricUnitPrice)}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#1d1d1f' }}>Nước</Text>
                      <Text strong>100.000 VNĐ/Phòng</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#1d1d1f' }}>Dịch vụ chung</Text>
                      <Text strong>200.000 VNĐ/Phòng</Text>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    block
                    style={{
                      height: '52px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: 600,
                      background: '#1d1d1f',
                      borderColor: '#1d1d1f'
                    }}
                    icon={<PhoneOutlined />}
                    onClick={() => setIsModalVisible(true)}
                  >
                    Liên hệ ngay để xem phòng
                  </Button>

                  <div style={{ textAlign: 'center' }}>
                    <Text style={{ fontSize: '13px', color: '#86868b' }}>Bạn sẽ không bị tính phí khi ấn nút liên hệ. Bộ phận hỗ trợ sẽ tư vấn chi tiết cho bạn.</Text>
                  </div>
                </Space>
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      <Modal
        title={<Title level={4} style={{ margin: 0 }}>Đăng ký xem phòng</Title>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        styles={{ body: { padding: '24px 0 0 0' } }}
      >
        <div style={{ background: '#f5f5f7', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          <Text strong style={{ display: 'block', fontSize: '15px', color: '#1d1d1f' }}>Thông tin chủ nhà</Text>
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <Text>Người đại diện:</Text>
            <Text strong>{room.host?.name || room.houseForRent?.host?.name || "Ban quản lý"}</Text>
          </div>
          <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <Text>Số điện thoại:</Text>
            <Text strong style={{ color: '#0071e3' }}>
              <a href={`tel:${room.host?.phoneNumber || room.houseForRent?.host?.phoneNumber || "19001234"}`}>
                {room.host?.phoneNumber || room.houseForRent?.host?.phoneNumber || "0364.862.148"}
              </a>
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginTop: '8px' }}>
            Bạn có thể gọi trực tiếp hoặc điền thông tin bên dưới để chủ nhà gọi lại cho bạn.
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleContactSubmit}>
          <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}>
            <Input size="large" placeholder="Nhập tên của bạn" />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
            <Input size="large" placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item label="Ngày xem" name="viewDate" rules={[{ required: true, message: 'Vui lòng chọn ngày và giờ xem phòng!' }]}>
            <DatePicker
              showTime
              size="large"
              style={{ width: '100%' }}
              placeholder="Chọn ngày và giờ"
              format="DD-MM-YYYY HH:mm"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
          <Form.Item label="Phòng cần xem" name="roomCode" initialValue={room.name || `Phòng ${room.code || slugAndId}`}>
            <Input size="large" disabled />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} placeholder="Ví dụ: Xem 10h ngày hôm nay" />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            block
            loading={submitting}
            style={{ background: '#1d1d1f', borderColor: '#1d1d1f', height: '48px', borderRadius: '12px' }}
          >
            Gửi yêu cầu
          </Button>
        </Form>
      </Modal>

    </div>
  );
};

export default RoomDetailClient;
