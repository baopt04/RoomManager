import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Spin, Button, Divider, message, Breadcrumb, Modal, Form, Input, DatePicker, Image, Tag, Skeleton, Space } from 'antd';
import { 
  EnvironmentOutlined, 
  TeamOutlined, 
  PhoneOutlined, 
  CheckCircleFilled, 
  HomeOutlined,
  StarFilled,
  WifiOutlined,
  CoffeeOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  ExpandOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getRoomDetail } from '../../../services/customer/HomeService';
import { createRoomViewing } from '../../../services/customer/RoomViewing';
import dayjs from 'dayjs';

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
  // Shorthand: rd('modal.title') === t('home.roomDetail.modal.title')
  const rd = (key) => t(`home.roomDetail.${key}`);
  const id = slugAndId?.substring(slugAndId.length - 36);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          const payload = {
            name: values.name,
            phone: values.phone,
            idRoom: room.id,
            viewDate: values.viewDate ? dayjs(values.viewDate).format('DD-MM-YYYY HH:mm:ss') : null,
            note: values.note || ""
          };

          await createRoomViewing(payload);

          message.success(rd('modal.success'));
          form.resetFields();
          setIsModalVisible(false);
        } catch (error) {
          console.error("Failed to create room viewing:", error);
          message.error(error.response?.data?.message || rd('modal.error'));
        } finally {
          setSubmitting(false);
        }
      }
    });
  };

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

  const displayImages = room ? [...images] : [...DEFAULT_IMAGES];
  if (room) {
    while (displayImages.length < 5) {
      displayImages.push(DEFAULT_IMAGES[displayImages.length % DEFAULT_IMAGES.length]);
    }
  }

  const renderSkeleton = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      <Row gutter={[12, 12]} style={{ height: isMobile ? '300px' : '520px', marginBottom: '40px' }}>
        <Col xs={24} md={14}><Skeleton.Button active style={{ width: '100%', height: '100%', borderRadius: '28px' }} /></Col>
        <Col xs={0} md={10}>
          <Row gutter={[12, 12]} style={{ height: '100%' }}>
            {[1, 2, 3, 4].map(i => (
              <Col span={12} key={i} style={{ height: 'calc(50% - 6px)' }}><Skeleton.Button active style={{ width: '100%', height: '100%', borderRadius: '16px' }} /></Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row gutter={[40, 40]}>
        <Col xs={24} lg={16}>
          <Skeleton active paragraph={{ rows: 2 }} title={{ width: '60%' }} style={{ marginBottom: '40px' }} />
          <Row gutter={[16, 16]} style={{ marginBottom: '40px' }}>
            {[1, 2, 3, 4].map(i => (
              <Col xs={12} sm={6} key={i}><Skeleton.Button active style={{ width: '100%', height: '100px', borderRadius: '20px' }} /></Col>
            ))}
          </Row>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Col>
        <Col xs={24} lg={8}><Skeleton.Button active style={{ width: '100%', height: '400px', borderRadius: '28px' }} /></Col>
      </Row>
    </div>
  );

  return (
    <div style={{ background: '#f5f5f7', paddingBottom: '80px', minHeight: '100vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '12px 0' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
          <Breadcrumb
            separator={<span style={{ color: '#d2d2d7' }}>/</span>}
            style={{ fontSize: '14px', fontWeight: 500 }}
            items={[
              { title: <Link to="/" style={{ color: '#86868b', transition: 'color 0.3s' }}>{rd('breadcrumb.home')}</Link> },
              { title: <Link to="/rooms" style={{ color: '#86868b' }}>{rd('breadcrumb.rooms')}</Link> },
              { title: <span style={{ color: '#1d1d1f' }}>{loading ? <Skeleton.Input size="small" active /> : (tName(room?.name) || `Phòng ${room?.code || slugAndId}`)}</span> }
            ]}
          />
        </div>
      </motion.div>

      {loading ? renderSkeleton() : (
        !room ? (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: '#f5f5f7', minHeight: '80vh' }}>
            <Title level={3}>{rd('notFound')}</Title>
            <Button size="large" style={{ borderRadius: '12px' }} onClick={() => navigate('/')}>{rd('backHome')}</Button>
          </div>
        ) : (
          <>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.4 }}
                style={{ position: 'relative', marginBottom: '40px' }}
              >
                <Image.PreviewGroup>
                  <Row gutter={[12, 12]} style={{
                    height: isMobile ? '300px' : '520px',
                    borderRadius: '28px',
                    overflow: 'hidden'
                  }}>
                    <Col xs={24} md={14} style={{ height: '100%' }}>
                      <div style={{ height: '100%', overflow: 'hidden', borderRadius: '16px' }}>
                        <Image
                          src={displayImages[0]}
                          alt="Main"
                          wrapperStyle={{ width: '100%', height: '100%' }}
                          style={{
                            width: '100%', height: '100%',
                            objectFit: 'cover', cursor: 'pointer',
                            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      </div>
                    </Col>

                    <Col xs={0} md={10} style={{ height: '100%' }}>
                      <Row gutter={[12, 12]} style={{ height: '100%' }}>
                        {displayImages.slice(1, 5).map((img, idx) => (
                          <Col span={12} key={idx} style={{ height: 'calc(50% - 6px)' }}>
                            <div style={{ height: '100%', overflow: 'hidden', borderRadius: '16px', position: 'relative' }}>
                              <Image
                                src={img}
                                alt={`Room ${idx + 2}`}
                                wrapperStyle={{ width: '100%', height: '100%' }}
                                style={{
                                  width: '100%', height: '100%',
                                  objectFit: 'cover', cursor: 'pointer',
                                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              />
                              {idx === 3 && images.length > 5 && (
                                <div
                                  style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(0,0,0,0.6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: '18px', fontWeight: 600,
                                    pointerEvents: 'none', borderRadius: '16px'
                                  }}
                                >
                                  +{images.length - 4} ảnh
                                </div>
                              )}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Col>

                    <div style={{ display: 'none' }}>
                      {displayImages.slice(5).map((img, idx) => (
                        <Image key={idx + 5} src={img} />
                      ))}
                    </div>
                  </Row>
                </Image.PreviewGroup>

                <Button
                  style={{
                    position: 'absolute', bottom: '24px', right: '24px',
                    borderRadius: '14px', fontWeight: 600, padding: '12px 24px',
                    height: 'auto', background: '#ffffff',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    border: 'none', display: 'flex', alignItems: 'center', gap: '10px',
                    zIndex: 10
                  }}
                  onClick={() => {
                    const firstImage = document.querySelector('.ant-image-img');
                    if (firstImage) firstImage.click();
                  }}
                >
                  <AppstoreOutlined style={{ fontSize: '18px' }} />
                  {rd('allImages')}
                </Button>
              </motion.div>

              <Row gutter={[40, 40]}>
                <Col xs={24} lg={16}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <Tag color="blue" style={{ borderRadius: '6px', fontWeight: 600, margin: 0, padding: '2px 10px' }}>{rd('tags.vacant')}</Tag>
                        <Tag color="green" style={{ borderRadius: '6px', fontWeight: 600, margin: 0, padding: '2px 10px' }}>{rd('tags.offer')} {dayjs().format('MM')}</Tag>
                      </div>
                      <Title level={1} style={{ margin: '0 0 12px', fontWeight: 800, fontSize: isMobile ? '32px' : '44px', letterSpacing: '-2px', color: '#1d1d1f' }}>
                        {tName(room.name) || `Phòng ${room.code || slugAndId}`}
                      </Title>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#86868b', fontSize: '16px' }}>
                        <EnvironmentOutlined style={{ color: '#0071e3' }} />
                        <Text style={{ color: '#86868b' }}>{tName(room.houseForRent?.address) || "Hà Nội"}</Text>
                        <Divider type="vertical" />
                        <Text style={{ color: '#86868b' }}>{rd('floor')} {room.floor || "0"}</Text>
                      </div>
                    </div>

                    {/* Bento Grid Info Cards */}
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1, delayChildren: 0.4 }
                        }
                      }}
                    >
                      <Row gutter={[16, 16]} style={{ marginBottom: '40px' }}>
                        {[
                          { icon: <ExpandOutlined />, label: rd('bento.area'), value: `${room.acreage} m²`, color: '#eef4ff', iconColor: '#0071e3' },
                          { icon: <TeamOutlined />, label: rd('bento.capacity'), value: `${rd('bento.max')} ${room.peopleMax} ${rd('bento.people')}`, color: '#f0fcf4', iconColor: '#34c759' },
                          { icon: <HomeOutlined />, label: rd('bento.type'), value: rd('bento.typeValue'), color: '#fff9f0', iconColor: '#ff9500' },
                          { icon: <SafetyOutlined />, label: rd('bento.security'), value: '24/7', color: '#fdf2f8', iconColor: '#af52de' }
                        ].map((item, idx) => (
                          <Col xs={12} sm={6} key={idx}>
                            <motion.div 
                              variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                              }}
                              style={{
                                background: item.color, borderRadius: '20px', padding: '20px',
                                height: '100%', border: '1px solid rgba(0,0,0,0.02)',
                                display: 'flex', flexDirection: 'column', gap: '12px'
                              }}
                            >
                              <div style={{ 
                                width: '36px', height: '36px', borderRadius: '10px', 
                                background: '#fff', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', color: item.iconColor, fontSize: '18px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                              }}>
                                {item.icon}
                              </div>
                              <div>
                                <Text style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '2px' }}>{item.label}</Text>
                                <Text strong style={{ fontSize: '15px', color: '#1d1d1f' }}>{item.value}</Text>
                              </div>
                            </motion.div>
                          </Col>
                        ))}
                      </Row>
                    </motion.div>

                    <Divider style={{ margin: '40px 0' }} />

                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      style={{ marginBottom: '48px' }}
                    >
                      <Title level={3} style={{ fontWeight: 700, fontSize: '24px', marginBottom: '20px', letterSpacing: '-0.5px' }}>
                        {rd('about.title')}
                      </Title>
                      <Paragraph style={{ fontSize: '17px', lineHeight: '1.8', color: '#424245', marginBottom: '24px' }}>
                        {rd('about.desc1')} {tName(room.houseForRent?.nameHouse) || rd('about.desc2')}, {rd('about.desc3')}
                      </Paragraph>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                        {(Array.isArray(rd('about.features')) ? rd('about.features') : []).map((text, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                          >
                            <CheckCircleFilled style={{ color: '#34c759', fontSize: '18px' }} />
                            <Text style={{ fontSize: '16px', color: '#1d1d1f' }}>{text}</Text>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      style={{ marginBottom: '20px' }}
                    >
                      <Title level={3} style={{ fontWeight: 700, fontSize: '24px', marginBottom: '24px', letterSpacing: '-0.5px' }}>
                        {rd('amenities.title')}
                      </Title>
                      <Row gutter={[20, 20]}>
                        {[
                          { icon: <ThunderboltOutlined />, name: rd('amenities.ac') },
                          { icon: <HomeOutlined />, name: rd('amenities.bed') },
                          { icon: <CoffeeOutlined />, name: rd('amenities.closet') },
                          { icon: <WifiOutlined />, name: rd('amenities.wifi') },
                          { icon: <SafetyOutlined />, name: rd('amenities.kitchen') },
                          { icon: <StarFilled />, name: rd('amenities.heater') }
                        ].map((item, idx) => (
                          <Col xs={12} sm={8} key={idx}>
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '16px', borderRadius: '16px', border: '1px solid #f2f2f7',
                                background: '#fafafa', transition: 'all 0.3s'
                              }}
                            >
                              <span style={{ fontSize: '20px', color: '#1d1d1f' }}>{item.icon}</span>
                              <Text strong style={{ fontSize: '14px', color: '#1d1d1f' }}>{item.name}</Text>
                            </motion.div>
                          </Col>
                        ))}
                      </Row>
                    </motion.div>
                  </motion.div>
                </Col>

                <Col xs={24} lg={8}>
                  <div style={{ position: 'sticky', top: '150px' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <Card
                        style={{
                          borderRadius: '28px',
                          border: '1px solid rgba(0,0,0,0.06)',
                          boxShadow: '0 24px 80px rgba(0,0,0,0.1)',
                          overflow: 'hidden',
                          background: '#fff'
                        }}
                        bodyStyle={{ padding: '32px' }}
                      >
                        <div style={{ marginBottom: '24px' }}>
                          <Text style={{ fontSize: '14px', color: '#86868b', fontWeight: 500 }}>{rd('pricing.title')}</Text>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                            <Text style={{ fontSize: '32px', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-1px' }}>
                              {formatCurrency(room.price)}
                            </Text>
                            <Text style={{ fontSize: '16px', color: '#86868b' }}>{rd('pricing.month')}</Text>
                          </div>
                        </div>

                        <Divider style={{ margin: '24px 0', opacity: 0.6 }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <ThunderboltOutlined style={{ color: '#ff9500' }} />
                              <Text style={{ color: '#515154' }}>{rd('pricing.electric')}</Text>
                            </div>
                            <Text strong>{formatCurrency(room.electricUnitPrice)}/kWh</Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <EnvironmentOutlined style={{ color: '#0071e3' }} />
                              <Text style={{ color: '#515154' }}>{rd('pricing.water')}</Text>
                            </div>
                            <Text strong>{rd('pricing.waterPrice')}</Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <SafetyOutlined style={{ color: '#af52de' }} />
                              <Text style={{ color: '#515154' }}>{rd('pricing.other')}</Text>
                            </div>
                            <Text strong>{rd('pricing.free')}</Text>
                          </div>
                        </div>

                        <Button
                          type="primary"
                          size="large"
                          block
                          style={{
                            height: '56px',
                            borderRadius: '16px',
                            fontSize: '17px',
                            fontWeight: 700,
                            background: '#1d1d1f',
                            borderColor: '#1d1d1f',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                          }}
                          onClick={() => setIsModalVisible(true)}
                        >
                          <PhoneOutlined /> {rd('pricing.book')}
                        </Button>

                        <div style={{ marginTop: '20px', textAlign: 'center', padding: '0 10px' }}>
                          <Text style={{ fontSize: '12px', color: '#86868b', lineHeight: 1.5, display: 'block' }}>
                            {rd('pricing.note')}
                          </Text>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </Col>
              </Row>
            </div>

            <Modal
              title={<Title level={4} style={{ margin: 0 }}>{rd('modal.title')}</Title>}
              open={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={null}
              centered
              styles={{ body: { padding: '24px 0 0 0' } }}
            >
              <div style={{ background: '#f5f5f7', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                <Text strong style={{ display: 'block', fontSize: '15px', color: '#1d1d1f' }}>{rd('modal.hostInfo')}</Text>
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <Text>{rd('modal.representative')}</Text>
                  <Text strong>{room.host?.name || room.houseForRent?.host?.name || rd('modal.management')}</Text>
                </div>
                <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <Text>{rd('modal.phone')}</Text>
                  <Text strong style={{ color: '#0071e3' }}>
                    <a href={`tel:${room.host?.phoneNumber || room.houseForRent?.host?.phoneNumber || "19001234"}`}>
                      {room.host?.phoneNumber || room.houseForRent?.host?.phoneNumber || "0364.862.148"}
                    </a>
                  </Text>
                </div>
                <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginTop: '8px' }}>
                  {rd('modal.desc')}
                </Text>
              </div>

              <Form form={form} layout="vertical" onFinish={handleContactSubmit}>
                <Form.Item label={rd('modal.nameLabel')} name="name" rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}>
                  <Input size="large" placeholder={rd('modal.namePlaceholder')} />
                </Form.Item>
                <Form.Item label={rd('modal.phoneLabel')} name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                  <Input size="large" placeholder={rd('modal.phonePlaceholder')} />
                </Form.Item>
                <Form.Item label={rd('modal.dateLabel')} name="viewDate" rules={[{ required: true, message: 'Vui lòng chọn ngày và giờ xem phòng!' }]}>
                  <DatePicker
                    showTime
                    size="large"
                    style={{ width: '100%' }}
                    placeholder={rd('modal.datePlaceholder')}
                    format="DD-MM-YYYY HH:mm"
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
                </Form.Item>
                <Form.Item label={rd('modal.roomLabel')} name="roomCode" initialValue={tName(room.name) || `Phòng ${room.code || slugAndId}`}>
                  <Input size="large" disabled />
                </Form.Item>
                <Form.Item label={rd('modal.noteLabel')} name="note">
                  <Input.TextArea rows={3} placeholder={rd('modal.notePlaceholder')} />
                </Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  block
                  loading={submitting}
                  style={{ background: '#1d1d1f', borderColor: '#1d1d1f', height: '48px', borderRadius: '12px' }}
                >
                  {rd('modal.submit')}
                </Button>
              </Form>
            </Modal>
          </>
        )
      )}
    </div>
  );
};

export default RoomDetailClient;
