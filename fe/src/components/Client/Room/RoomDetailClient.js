import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Button, Divider, message, Breadcrumb, Modal, Form, Input, DatePicker, Image, Skeleton, Rate, Avatar, Tag, Space } from 'antd';
import {
  EnvironmentOutlined, PhoneOutlined, CheckCircleFilled,
  HomeOutlined, WifiOutlined, CoffeeOutlined, SafetyOutlined,
  ThunderboltOutlined, ExpandOutlined, AppstoreOutlined, HeartOutlined,
  ClockCircleOutlined, UserOutlined, MessageOutlined, VideoCameraOutlined,
  CarOutlined, FireOutlined, ArrowUpOutlined, RestOutlined, EditOutlined,
  ClearOutlined, CustomerServiceOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getRoomDetail } from '../../../services/customer/HomeService';
import { createRoomViewing } from '../../../services/customer/RoomViewing';
import dayjs from 'dayjs';
import { useClientBreakpoints } from '../hooks/useClientBreakpoints';
import avata3 from '../../../assets/back-3.jpg';
const { Title, Text, Paragraph } = Typography;
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200"
];

const RoomDetailClient = () => {
  const { slugAndId } = useParams();
  const { t, tName } = useLanguage();
  const rd = (key) => t(`home.roomDetail.${key}`);
  const id = slugAndId?.substring(slugAndId.length - 36);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const { isPhone } = useClientBreakpoints();

  const handleContactSubmit = async (values) => {
    Modal.confirm({
      title: rd('modal.confirmTitle'),
      content: (
        <div>
          <p><strong>{rd('modal.confirmName')}</strong> {values.name}</p>
          <p><strong>{rd('modal.confirmPhone')}</strong> {values.phone}</p>
          <p><strong>{rd('modal.confirmDate')}</strong> {values.viewDate ? dayjs(values.viewDate).format('DD/MM/YYYY HH:mm') : 'N/A'}</p>
          <p><strong>{rd('modal.confirmNote')}</strong> {values.note || rd('modal.confirmNone')}</p>
          <p style={{ marginTop: '16px', color: '#86868b' }}>{rd('modal.confirmDesc')}</p>
        </div>
      ),
      okText: rd('modal.confirmOk'),
      cancelText: rd('modal.confirmCancel'),
      centered: true,
      onOk: async () => {
        setSubmitting(true);
        try {
          await createRoomViewing({
            name: values.name, phone: values.phone, idRoom: room.id,
            viewDate: values.viewDate ? dayjs(values.viewDate).format('DD-MM-YYYY HH:mm:ss') : null,
            note: values.note || ""
          });
          message.success(rd('modal.success'));
          form.resetFields();
          setIsModalVisible(false);
        } catch (error) {
          message.error(error.response?.data?.message || rd('modal.error'));
        } finally { setSubmitting(false); }
      }
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Liên hệ";
    const m = amount / 1000000;
    return `${m % 1 === 0 ? m : m.toFixed(1)} triệu/tháng`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchRoomData = async () => {
      setLoading(true);
      try {
        const roomData = await getRoomDetail(id);
        setRoom(roomData);
        setImages(roomData.images?.length > 0 ? roomData.images : DEFAULT_IMAGES);
      } catch (error) {
        message.error("Không thể tải thông tin phòng!");
      } finally { setLoading(false); }
    };
    if (id) fetchRoomData();
  }, [id]);

  const displayImages = room ? [...images] : [...DEFAULT_IMAGES];
  if (room) { while (displayImages.length < 5) displayImages.push(DEFAULT_IMAGES[displayImages.length % DEFAULT_IMAGES.length]); }

  if (loading) return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <Skeleton.Button active style={{ width: '100%', height: '400px', borderRadius: '16px' }} />
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}><Skeleton active paragraph={{ rows: 8 }} /></Col>
        <Col xs={24} lg={8}><Skeleton.Button active style={{ width: '100%', height: '300px', borderRadius: '16px' }} /></Col>
      </Row>
    </div>
  );

  if (!room) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <Title level={3}>{rd('notFound')}</Title>
      <Button size="large" onClick={() => navigate('/')}>{rd('backHome')}</Button>
    </div>
  );

  const amenities = [
    { icon: <ThunderboltOutlined />, name: "Máy lạnh" },
    { icon: <HomeOutlined />, name: "Giường" },
    { icon: <AppstoreOutlined />, name: "Tủ quần áo" },
    { icon: <EditOutlined />, name: "Bàn làm việc" },
    { icon: <CoffeeOutlined />, name: "Kệ bếp" },
    { icon: <SafetyOutlined />, name: "Tủ lạnh" },
    { icon: <ClearOutlined />, name: "Máy giặt" },
    { icon: <RestOutlined />, name: "Nhà vệ sinh riêng" },
    { icon: <WifiOutlined />, name: "Wifi" },
    { icon: <ClockCircleOutlined />, name: "Giờ giấc tự do" },
    { icon: <UserOutlined />, name: "Không chung chủ" },
    { icon: <VideoCameraOutlined />, name: "Camera an ninh" },
    { icon: <FireOutlined />, name: "Bình chữa cháy" },
    { icon: <ArrowUpOutlined />, name: "Thang máy" },
    { icon: <CarOutlined />, name: "Bãi xe" },
    { icon: <CustomerServiceOutlined />, name: "Khu để xe" },
  ];

  const reviews = [
    {
      name: "Minh Tuấn",
      date: "Đã thuê tháng 03/2024",
      rating: 5,
      comment: "Phòng đẹp, sạch sẽ, đúng như hình. Chủ nhà cực kỳ dễ thương, hỗ trợ nhiệt tình.",
      avatar: "https://i.pravatar.cc/150?u=mt"
    },
    {
      name: "Thanh Mai",
      date: "Đã thuê tháng 02/2024",
      rating: 5,
      comment: "Vị trí thuận tiện, khu vực an ninh. Mình rất hài lòng khi thuê phòng ở đây.",
      avatar: "https://i.pravatar.cc/150?u=tm"
    }
  ];

  return (
    <div style={{ background: '#fff', paddingBottom: '80px', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isPhone ? '0 16px' : '0 24px' }}>
          <Breadcrumb separator=">" style={{ fontSize: '13px' }} items={[
            { title: <Link to="/" style={{ color: '#888' }}>Trang chủ</Link> },
            { title: <Link to="/rooms" style={{ color: '#888' }}>Tìm phòng</Link> },
            { title: <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{tName(room.name) || `Phòng ${room.code}`}</span> }
          ]} />
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isPhone ? '0 16px 80px' : '0 24px' }}>
        <Row gutter={[32, 32]}>
          {/* LEFT COLUMN */}
          <Col xs={24} lg={16}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Gallery Section */}
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <Image.PreviewGroup>
                  <div style={{ borderRadius: '16px', overflow: 'hidden', height: isPhone ? '280px' : '480px', position: 'relative' }}>
                    <Image
                      src={displayImages[selectedImg]}
                      alt="Main"
                      wrapperStyle={{ width: '100%', height: '100%' }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Heart Favorite Icon */}
                    <div style={{
                      position: 'absolute', top: 20, right: 20, zIndex: 10,
                      width: 44, height: 44, background: '#fff', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer'
                    }}>
                      <HeartOutlined style={{ fontSize: 20, color: '#1d1d1f' }} />
                    </div>
                    {/* Image Counter */}
                    <div style={{
                      position: 'absolute', bottom: 20, left: 20, zIndex: 10,
                      background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '4px 12px',
                      borderRadius: '12px', fontSize: '13px', fontWeight: 500
                    }}>
                      {selectedImg + 1} / {displayImages.length}
                    </div>
                  </div>
                  <div style={{ display: 'none' }}>{displayImages.map((img, i) => <Image key={i} src={img} />)}</div>
                </Image.PreviewGroup>

                {/* Thumbnails */}
                <div style={{ display: 'flex', gap: 12, marginTop: 12, overflowX: 'auto', paddingBottom: 8 }}>
                  {displayImages.slice(0, 10).map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImg(idx)}
                      style={{
                        width: isPhone ? 70 : 100, height: isPhone ? 52 : 75, borderRadius: 8, overflow: 'hidden',
                        cursor: 'pointer', flexShrink: 0,
                        border: selectedImg === idx ? '3px solid #27ae60' : 'none',
                        transition: 'all 0.2s ease',
                        opacity: selectedImg === idx ? 1 : 0.7
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Title and Price Section */}
              <div style={{ marginBottom: 32 }}>
                <Title level={1} style={{ margin: '0 0 8px', fontWeight: 700, fontSize: isPhone ? '24px' : '36px', color: '#1d1d1f' }}>
                  {tName(room.name) || `Phòng full nội thất, cửa sổ lớn`}
                </Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#86868b', fontSize: 16, marginBottom: 16 }}>
                  <EnvironmentOutlined style={{ color: '#86868b' }} />
                  <span>{tName(room.houseForRent?.address) || 'Tây Hồ - Hà Nội'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ color: '#27ae60', fontSize: 28, fontWeight: 700 }}>{formatCurrency(room.price)}</span>
                </div>

                {/* Quick Info Grid */}
                <Row gutter={[24, 16]} style={{ marginTop: 24 }}>
                  <Col span={8} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ExpandOutlined style={{ fontSize: 20, color: '#86868b' }} />
                    <Text style={{ color: '#1d1d1f', fontSize: 15 }}>{room.acreage}m²</Text>
                  </Col>
                  <Col span={8} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AppstoreOutlined style={{ fontSize: 20, color: '#86868b' }} />
                    <Text style={{ color: '#1d1d1f', fontSize: 15 }}>Full nội thất</Text>
                  </Col>
                  <Col span={8} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ClockCircleOutlined style={{ fontSize: 20, color: '#86868b' }} />
                    <Text style={{ color: '#1d1d1f', fontSize: 15 }}>Giờ tự do</Text>
                  </Col>
                </Row>
              </div>

              <Divider style={{ margin: '32px 0' }} />

              {/* Amenities Section */}
              <div style={{ marginBottom: 40 }}>
                <Title level={4} style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#1d1d1f' }}>Tiện ích</Title>
                <Row gutter={[16, 24]}>
                  {amenities.map((item, idx) => (
                    <Col xs={12} sm={8} md={6} key={idx}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 20, color: '#27ae60', display: 'flex' }}>{item.icon}</span>
                        <Text style={{ fontSize: 14, color: '#424245' }}>{item.name}</Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              <Divider style={{ margin: '32px 0' }} />

              {/* Description Section */}
              <div style={{ marginBottom: 48 }}>
                <Title level={4} style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1d1d1f' }}>Mô tả chi tiết</Title>
                <Paragraph style={{ fontSize: 15, lineHeight: 1.6, color: '#424245', marginBottom: 24 }}>
                  Phòng rộng rãi, thoáng mát với cửa sổ lớn đón nắng tự nhiên. Full nội thất chỉ cần xách vali vào ở ngay.
                </Paragraph>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    "Khu vực an ninh, yên tĩnh",
                    "Gần chợ, siêu thị, tiện di chuyển",
                    "Giờ giấc tự do, không chung chủ",
                    "Phù hợp cho nhân viên văn phòng, sinh viên"
                  ].map((text, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircleFilled style={{ color: '#27ae60', fontSize: 16 }} />
                      <Text style={{ fontSize: 15, color: '#424245' }}>{text}</Text>
                    </div>
                  ))}
                </div>
              </div>

              <Divider style={{ margin: '40px 0' }} />

              {/* Review Section */}
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <Title level={4} style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1d1d1f' }}>Đánh giá từ người thuê trước</Title>
                  <Button type="link" style={{ color: '#27ae60', fontWeight: 600 }}>Xem tất cả (12)</Button>
                </div>

                <Row gutter={[24, 24]} align="middle">
                  <Col xs={24} md={6}>
                    <div style={{ textAlign: 'center', padding: '24px', background: '#f9f9fb', borderRadius: '16px' }}>
                      <Title level={2} style={{ margin: '0 0 8px', fontWeight: 700, color: '#1d1d1f' }}>4.8 <span style={{ fontSize: 16, fontWeight: 400, color: '#86868b' }}>/ 5</span></Title>
                      <Rate disabled defaultValue={5} style={{ fontSize: 14, color: '#fadb14' }} />
                      <div style={{ marginTop: 8, color: '#86868b', fontSize: 13 }}>(12 đánh giá)</div>
                    </div>
                  </Col>
                  <Col xs={24} md={18}>
                    <Row gutter={[24, 24]}>
                      {reviews.map((rev, i) => (
                        <Col xs={24} key={i}>
                          <div style={{ background: '#fff', border: '1px solid #f0f0f2', borderRadius: '16px', padding: 20 }}>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                              <Avatar src={rev.avatar} size={48} />
                              <div>
                                <Text strong style={{ display: 'block', fontSize: 15 }}>{rev.name}</Text>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <Text style={{ fontSize: 12, color: '#86868b' }}>{rev.date}</Text>
                                  <Rate disabled defaultValue={rev.rating} style={{ fontSize: 10 }} />
                                </div>
                              </div>
                            </div>
                            <Paragraph style={{ margin: 0, color: '#424245', fontSize: 14 }}>{rev.comment}</Paragraph>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </div>

              {/* Safety Tip Banner */}
              <div style={{
                background: '#f0faf4', border: '1px solid #d4edda',
                borderRadius: '16px', padding: '20px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: isPhone ? 'wrap' : 'nowrap', gap: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 48, height: 48, background: '#fff', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(39,174,96,0.1)'
                  }}>
                    <SafetyOutlined style={{ fontSize: 24, color: '#27ae60' }} />
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 16, display: 'block', color: '#1d1d1f' }}>Lưu ý an toàn khi thuê phòng</Text>
                    <Text style={{ fontSize: 14, color: '#424245' }}>Không chuyển khoản đặt cọc khi chưa xem phòng trực tiếp. Hãy liên hệ và gặp trực tiếp chủ phòng để đảm bảo an toàn.</Text>
                  </div>
                </div>
                <Button style={{ borderRadius: '12px', height: 44, fontWeight: 600, border: '1px solid #27ae60', color: '#27ae60' }}>
                  Xem thêm kinh nghiệm thuê phòng
                </Button>
              </div>
            </motion.div>
          </Col>

          {/* RIGHT SIDEBAR */}
          <Col xs={24} lg={8}>
            <div style={{ position: 'sticky', top: 32 }}>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                {/* Contact Card */}
                <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 12px 32px rgba(0,0,0,0.06)', marginBottom: 24 }} bodyStyle={{ padding: 24 }}>
                  <Title level={4} style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Thông tin liên hệ</Title>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
                    <Avatar size={64} src={avata3} style={{ border: '2px solid #27ae60' }} />
                    <div>
                      <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 2 }}>Bảo Thanh</Text>
                      <Text style={{ fontSize: 14, color: '#86868b', display: 'block', marginBottom: 4 }}>Chủ nhà</Text>
                      <Tag color="success" style={{ borderRadius: '10px', border: 'none', fontSize: 11, padding: '0 8px' }}>● Đang hoạt động</Tag>
                    </div>
                  </div>
                  <Button
                    type="primary" block
                    style={{ background: '#006d31', border: 'none', borderRadius: '12px', height: 48, fontWeight: 600, fontSize: 15, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    onClick={() => setIsModalVisible(true)}
                  >
                    <MessageOutlined /> Đặt lịch xem phòng
                  </Button>
                  <Button
                    block
                    style={{ borderRadius: '12px', height: 48, fontWeight: 600, fontSize: 15, border: '1px solid #006d31', color: '#006d31', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <PhoneOutlined /> Gọi ngay
                  </Button>
                  <Text style={{ display: 'block', textAlign: 'center', fontSize: 12, color: '#86868b', marginTop: 16, lineHeight: 1.5 }}>
                    Khi liên hệ, hãy nói bạn thấy tin trên Tiến Đức Land nhé!
                  </Text>
                </Card>

                {/* Highlights Table */}
                <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 12px 32px rgba(0,0,0,0.06)', marginBottom: 24 }} bodyStyle={{ padding: 24 }}>
                  <Title level={4} style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Thông tin nổi bật</Title>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { icon: <ClockCircleOutlined />, label: 'Ngày đăng', value: '15/05/2024' },
                      // { icon: <ThunderboltOutlined />, label: 'Mã tin', value: room.code || 'TX12345' },
                      { icon: <HomeOutlined />, label: 'Loại phòng', value: room.type },
                      { icon: <ClockCircleOutlined />, label: 'Tình trạng', value: 'Còn trống' },
                      { icon: <SafetyOutlined />, label: 'Đặt cọc', value: '1 tháng' },
                      { icon: <AppstoreOutlined />, label: 'Thanh toán', value: 'Tháng' },
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: '#86868b', fontSize: 14 }}>{item.icon}</span>
                          <Text style={{ color: '#86868b', fontSize: 14 }}>{item.label}</Text>
                        </div>
                        <Text strong style={{ fontSize: 14, color: '#1d1d1f' }}>{item.value}</Text>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Location with Map Preview */}
                <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: 24 }}>
                  <Title level={4} style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Vị trí</Title>
                  <Paragraph style={{ color: '#424245', fontSize: 14, marginBottom: 16 }}>
                    {tName(room.houseForRent?.address) || 'Tây Hồ - Hà Nội'}
                  </Paragraph>
                  <div style={{
                    width: '100%', height: 160, borderRadius: '16px', background: '#f2f2f7',
                    overflow: 'hidden', position: 'relative', marginBottom: 16
                  }}>
                    <img src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+27ae60(106.67,10.82)/106.67,10.82,14/400x200@2x?access_token=pk.eyJ1IjoiYmFvcHRwaCIsImEiOiJjbDFsZzN6ZHAwMGZzM2JxbXN4Z3B4Z3B4In0.XXXX" alt="Map Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      <EnvironmentOutlined style={{ fontSize: 32, color: '#27ae60' }} />
                    </div>
                  </div>
                  <Button block style={{ borderRadius: '12px', height: 44, fontWeight: 600, border: '1px solid #d2d2d7', color: '#1d1d1f' }}>
                    Xem trên bản đồ lớn
                  </Button>
                </Card>
              </motion.div>
            </div>
          </Col>
        </Row>
      </div>

      {/* MODAL - Contact Form */}
      <Modal
        title={<Title level={4} style={{ margin: 0 }}>{rd('modal.title')}</Title>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null} centered
        styles={{ body: { padding: '24px' } }}
        width={500}
      >
        <div style={{ background: '#f5f5f7', padding: 16, borderRadius: '12px', marginBottom: 24 }}>
          <Text strong style={{ display: 'block', fontSize: 15, color: '#1d1d1f' }}>{rd('modal.hostInfo')}</Text>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <Text>{rd('modal.representative')}</Text>
            <Text strong>{room.host?.name || room.houseForRent?.host?.name || rd('modal.management')}</Text>
          </div>
          <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Text>{rd('modal.phone')}</Text>
            <Text strong style={{ color: '#0071e3' }}>
              <a href={`tel:${room.host?.phoneNumber || room.houseForRent?.host?.phoneNumber || "0364862148"}`}>
                {room.host?.phoneNumber || room.houseForRent?.host?.phoneNumber || "0364.862.148"}
              </a>
            </Text>
          </div>
        </div>
        <Form form={form} layout="vertical" onFinish={handleContactSubmit}>
          <Form.Item label="Họ tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input size="large" placeholder="Nhập họ tên của bạn" />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}>
            <Input size="large" placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item label="Ngày xem phòng" name="viewDate" rules={[{ required: true, message: 'Chọn ngày xem!' }]}>
            <DatePicker showTime size="large" style={{ width: '100%' }} format="DD-MM-YYYY HH:mm" disabledDate={(c) => c && c < dayjs().startOf('day')} />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} placeholder="Ví dụ: Tôi muốn xem phòng vào buổi chiều" />
          </Form.Item>
          <Button type="primary" size="large" htmlType="submit" block loading={submitting} style={{ background: '#006d31', borderColor: '#006d31', height: 48, borderRadius: 12, fontWeight: 600 }}>
            Gửi yêu cầu đặt lịch
          </Button>
        </Form>
      </Modal>

      {/* MOBILE FIXED BOTTOM ACTION BAR */}
      {isPhone && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
          background: '#fff', padding: '12px 20px', borderTop: '1px solid #eee',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
        }}>
          <div>
            <Text style={{ fontSize: '12px', color: '#888', display: 'block' }}>Giá thuê</Text>
            <Text strong style={{ fontSize: '18px', color: '#27ae60' }}>
              {(room?.price || 0).toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 400 }}>đ/tháng</span>
            </Text>
          </div>
          <Space>
            <Button
              shape="circle"
              size="large"
              icon={<PhoneOutlined />}
              style={{ background: '#f0faf4', color: '#27ae60', border: 'none' }}
            />
            <Button
              type="primary"
              size="large"
              style={{ background: '#27ae60', border: 'none', borderRadius: '12px', fontWeight: 600, height: 48, padding: '0 24px' }}
              onClick={() => setIsModalVisible(true)}
            >
              Liên hệ ngay
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};

export default RoomDetailClient;
