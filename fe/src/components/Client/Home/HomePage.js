import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Spin, Button, Input, Tabs, Badge, Carousel } from 'antd';
import {
  SearchOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  RightOutlined,
  LeftOutlined,
  StarFilled,
  SafetyCertificateOutlined,
  MessageOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllRooms } from '../../../services/customer/HomeService';
import { PRIMARY_IMAGES } from './HomeConstants';
import { RoomCard } from './subcomponents/HomeCards';
import bannerPhu from '../../../assets/banner_phu.png';
import bannerChinh from '../../../assets/banner_chinh.png';
import back1 from '../../../assets/back-1.jpg';
import back2 from '../../../assets/back-2.jpg';
import back3 from '../../../assets/back-3.jpg';
import back4 from '../../../assets/back-4.jpg';
import { useClientBreakpoints } from '../hooks/useClientBreakpoints';

const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [dataRooms, setDataRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPhone, isTabletLike } = useClientBreakpoints();
  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: isTabletLike ? '8px' : '-50px',
          zIndex: 2,
          width: '44px',
          height: '44px',
          background: '#fff',
          borderRadius: '50%',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={onClick}
      >
        <LeftOutlined style={{ fontSize: '18px', color: '#27ae60' }} />
      </div>
    );
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          right: isTabletLike ? '8px' : '-50px',
          zIndex: 2,
          width: '44px',
          height: '44px',
          background: '#fff',
          borderRadius: '50%',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={onClick}
      >
        <RightOutlined style={{ fontSize: '18px', color: '#27ae60' }} />
      </div>
    );
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await getAllRooms();
      const vacantRooms = response.filter(room => room.status === "TRONG");
      const mappedRooms = vacantRooms.map((room, index) => ({
        ...room,
        displayImage: PRIMARY_IMAGES[index % PRIMARY_IMAGES.length]
      }));
      setDataRooms(mappedRooms);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to load rooms:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div style={{ background: '#fff' }}>

      {/* 1. HERO SECTION - CLEAN FLOW LAYOUT */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        style={{
          width: '100%',
          padding: isPhone ? '16px' : isTabletLike ? '24px 24px 40px' : '40px 60px 60px',
          background: '#fff',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Banner Image Container */}
        <motion.div
          variants={fadeInUp}
          style={{
            width: '100%',
            borderRadius: '10px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
            background: '#fff',
            marginBottom: '40px',
            overflow: 'hidden',
            transform: 'translateZ(0)'
          }}
        >
          <img
            src={bannerChinh}
            alt="Hero Banner"
            style={{ width: '100%', display: 'block', borderRadius: '10px' }}
          />
        </motion.div>

        {/* Interactive Search Box - Enhanced & Even Wider */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          style={{
            width: '100%',
            maxWidth: '1400px',
            margin: isPhone ? '0 auto 40px' : '0 auto 80px',
            zIndex: 10,
            padding: isPhone ? '0' : isTabletLike ? '0 12px' : '0 20px'
          }}
        >
          <Card style={{
            borderRadius: isPhone ? '20px' : '32px',
            boxShadow: '0 30px 90px rgba(0,0,0,0.08)',
            border: 'none',
            padding: isPhone ? '15px' : isTabletLike ? '18px 20px 24px' : '20px 30px 35px',
            background: '#fff'
          }}>
            {!isPhone && (
              <Tabs
                className="custom-tabs"
                defaultActiveKey="1"
                items={[
                  { key: '1', label: 'Tìm theo khu vực' },
                  { key: '2', label: 'Tìm theo tuyến đường' },
                  { key: '3', label: 'Tìm theo trường đại học' },
                ]}
                style={{ marginBottom: '25px' }}
              />
            )}

            <div style={{
              display: 'flex',
              flexDirection: isPhone ? 'column' : 'row',
              gap: '0',
              alignItems: 'stretch',
              background: '#f8faf9',
              borderRadius: '20px',
              padding: '8px'
            }}>
              <div className="search-segment" style={{
                flex: 1.5,
                padding: '12px 24px',
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Text strong style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Khu vực</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <EnvironmentOutlined style={{ color: '#27ae60', fontSize: '16px' }} />
                  <Input
                    placeholder="Bạn muốn tìm ở đâu?"
                    variant="borderless"
                    style={{ padding: 0, fontWeight: 600, fontSize: '16px', color: '#1a4332', width: '100%' }}
                  />
                </div>
              </div>

              {!isPhone && <div style={{ width: '1px', height: '40px', background: '#dce5e0', alignSelf: 'center' }} />}

              <div className="search-segment" style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Text strong style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Khoảng giá</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarOutlined style={{ color: '#27ae60', fontSize: '16px' }} />
                  <Input
                    placeholder="Chọn mức giá"
                    variant="borderless"
                    style={{ padding: 0, fontWeight: 600, fontSize: '16px', color: '#1a4332', width: '100%' }}
                  />
                </div>
              </div>

              {!isPhone && <div style={{ width: '1px', height: '40px', background: '#dce5e0', alignSelf: 'center' }} />}

              <div style={{
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Button
                  type="primary"
                  icon={<SearchOutlined style={{ fontSize: '18px' }} />}
                  size="large"
                  onClick={() => navigate('/rooms')}
                  style={{
                    height: '60px',
                    minWidth: isPhone ? '100%' : isTabletLike ? '150px' : '180px',
                    borderRadius: '16px',
                    background: '#1a4332',
                    borderColor: '#1a4332',
                    fontWeight: 700,
                    fontSize: '17px',
                    boxShadow: '0 10px 25px rgba(26, 67, 50, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  Tìm ngay
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          style={{
            display: 'grid',
            gridTemplateColumns: isPhone ? 'repeat(2, 1fr)' : isTabletLike ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)',
            gap: isPhone ? '16px' : isTabletLike ? '20px' : '30px',
            padding: isPhone ? '0' : isTabletLike ? '0 12px' : '0 60px'
          }}
        >
          {[
            { icon: <HomeOutlined />, title: 'Nguồn phòng đa dạng', sub: 'Hàng nghìn lựa chọn' },
            { icon: <DollarOutlined />, title: 'Giá cả minh bạch', sub: 'Không phát sinh phí' },
            { icon: <TeamOutlined />, title: 'Hỗ trợ tận tâm', sub: 'Tư vấn 24/7' },
            { icon: <SafetyCertificateOutlined />, title: 'An toàn & uy tín', sub: 'Thông tin xác thực' },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
            >
              <div style={{ width: '48px', height: '48px', background: '#eafaf1', color: '#27ae60', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {item.icon}
              </div>
              <div>
                <Text strong style={{ display: 'block', fontSize: '14px', color: '#1a4332' }}>{item.title}</Text>
                <Text style={{ fontSize: '12px', color: '#999' }}>{item.sub}</Text>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 2. POPULAR LOCATIONS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        style={{ padding: isPhone ? '40px 16px' : '80px 20px', maxWidth: '1400px', margin: '0 auto' }}
      >
        <div style={{ padding: isPhone ? '0' : isTabletLike ? '0 12px' : '0 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isPhone ? '24px' : '40px' }}>
            <Title level={2} style={{ margin: 0, fontSize: isPhone ? '22px' : '28px', fontWeight: 700 }}>Khu vực phổ biến</Title>
            <Button type="link" style={{ color: '#45C97C', fontWeight: 800, fontSize: isPhone ? '13px' : '14px' }}>Xem tất cả <RightOutlined style={{ fontSize: '12px' }} /></Button>
          </div>

          <Row gutter={[20, 20]}>
            {[
              { name: 'Long Biên', rooms: '1.200+', img: back1 },
              { name: 'Tứ liên', rooms: '850+', img: back2 },
              { name: 'Âu Cơ', rooms: '2.100+', img: back3 },
              { name: 'Minh Khai', rooms: '1.500+', img: back4 },
              { name: 'Hà Đông', rooms: '1.800+', img: back3 },
              { name: 'Cầu Giấy', rooms: '1.800+', img: back1 },
            ].map((loc, i) => (
              <Col xs={12} sm={8} md={8} lg={4} key={i}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card
                    cover={<img src={loc.img} alt={loc.name} style={{ height: '160px', objectFit: 'cover', borderRadius: '16px' }} />}
                    style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}
                    bodyStyle={{ padding: '15px' }}
                  >
                    <Text strong style={{ display: 'block', fontSize: '16px' }}>{loc.name}</Text>
                    <Text style={{ color: '#95a5a6', fontSize: '13px' }}>{loc.rooms} phòng</Text>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </motion.section>

      {/* 3. FEATURED ROOMS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        style={{ padding: isPhone ? '40px 16px' : '80px 20px', background: '#f9fbf9' }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isPhone ? '0' : isTabletLike ? '0 12px' : '0 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isPhone ? '24px' : '40px' }}>
            <Title level={2} style={{ margin: 0, fontSize: isPhone ? '22px' : '28px', fontWeight: 700 }}>Phòng trọ nổi bật</Title>
            <Button type="link" style={{ color: '#27ae60', fontWeight: 600, fontSize: isPhone ? '13px' : '14px' }}>Xem tất cả <RightOutlined style={{ fontSize: '12px' }} /></Button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <Spin size="large" tip="Đang tải danh sách phòng..." />
            </div>
          ) : dataRooms && dataRooms.length > 0 ? (
            <Row gutter={[24, 24]}>
              {dataRooms.slice(0, 4).map((room, i) => (
                <Col xs={12} sm={12} md={6} key={room.id || i}>
                  <RoomCard room={room} onClick={() => navigate(`/room/${room.slug}-${room.id}`)} />
                </Col>
              ))}
            </Row>
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 0', background: '#fff', borderRadius: '32px', border: '2px dashed #f0f0f0' }}>
              <Text type="secondary" style={{ fontSize: '16px' }}>Hiện tại không có phòng trọ nổi bật nào khả dụng.</Text>
            </div>
          )}
        </div>
      </motion.section>

      {/* 4. WHY CHOOSE US */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        style={{ padding: isPhone ? '60px 16px' : '100px 20px', maxWidth: '1400px', margin: '0 auto' }}
      >
        <div style={{ padding: isPhone ? '0' : isTabletLike ? '0 12px' : '0 40px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '10px', fontSize: isPhone ? '22px' : '32px', fontWeight: 800 }}>Vì sao chọn Tiến Đức Land?</Title>
          <Text style={{ display: 'block', textAlign: 'center', color: '#7f8c8d', fontSize: isPhone ? '14px' : '16px', marginBottom: isPhone ? '32px' : '60px' }}>Mang lại giá trị thực cho người thuê và chủ trọ</Text>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: isPhone ? 'center' : 'space-between',
            gap: '20px'
          }}>
            {[
              { icon: <SafetyCertificateOutlined />, title: 'Phòng thật, giá thật', desc: 'Thông tin chính xác, hình ảnh thực tế 100%.', color: '#45C97C' },
              { icon: <SearchOutlined />, title: 'Tìm kiếm dễ dàng', desc: 'Bộ lọc thông minh giúp bạn tìm phòng nhanh chóng.', color: '#45C97C' },
              { icon: <MessageOutlined />, title: 'Liên hệ nhanh chóng', desc: 'Kết nối trực tiếp với chủ trọ qua zalo hoặc gọi điện.', color: '#45C97C' },
              { icon: <TeamOutlined />, title: 'Hỗ trợ tận tâm', desc: 'Đội ngũ tư vấn trực tuyến 24/7 hoàn toàn miễn phí.', color: '#45C97C' },
              { icon: <SafetyCertificateOutlined />, title: 'An toàn & Bảo mật', desc: 'Thông tin được xác thực, bảo vệ quyền lợi người dùng.', color: '#45C97C' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                whileHover={{ scale: 1.05 }}
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  borderRadius: '24px',
                  background: '#fff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  flex: isPhone ? '1 1 100%' : '1 1 0',
                  minWidth: isPhone ? '100%' : '200px',
                  maxWidth: isPhone ? '100%' : '250px'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: item.color,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '28px',
                  color: '#2c3e50'
                }}>
                  {item.icon}
                </div>
                <Title level={4} style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>{item.title}</Title>
                <Text style={{ color: '#7f8c8d', lineHeight: 1.6 }}>{item.desc}</Text>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 5. TESTIMONIALS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        style={{ padding: isPhone ? '40px 16px' : '100px 20px', background: '#f9fbf9' }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isPhone ? '0' : isTabletLike ? '0 12px' : '0 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isPhone ? '24px' : '40px', flexWrap: 'wrap', gap: '8px' }}>
            <Title level={2} style={{ margin: 0, fontSize: isPhone ? '22px' : '28px', fontWeight: 700 }}>Khách hàng nói gì về Tiến Đức Land?</Title>
            {!isPhone && <Button type="link" style={{ color: '#27ae60', fontWeight: 600 }}>Xem tất cả đánh giá <RightOutlined style={{ fontSize: '12px' }} /></Button>}
          </div>

          <div style={{ position: 'relative' }}>
            <Carousel
              autoplay
              draggable
              dots={{ className: 'custom-carousel-dots' }}
              slidesToShow={isPhone ? 1 : isTabletLike ? 2 : 3}
              slidesToScroll={1}
              infinite={true}
              style={{ paddingBottom: '30px' }}
              arrows={!isPhone}
              prevArrow={<CustomPrevArrow />}
              nextArrow={<CustomNextArrow />}
            >
              {[
                { name: 'Minh Thư', role: 'Sinh viên, TP.HCM', text: 'Em đã tìm được phòng ưng ý chỉ trong 1 ngày. Giao diện dễ dùng, lọc phòng rất tiện!', img: 'https://i.pravatar.cc/150?u=1' },
                { name: 'Hoàng Nam', role: 'Nhân viên văn phòng', text: 'Thông tin rõ ràng, hình ảnh thật. Chủ trọ hỗ trợ nhiệt tình, cảm ơn Tiến Đức Land.', img: 'https://i.pravatar.cc/150?u=2' },
                { name: 'Thanh Trúc', role: 'Nhân viên', text: 'Nhờ Tiến Đức Land mà mình đã tìm được phòng gần chỗ làm, giá hợp lý.', img: 'https://i.pravatar.cc/150?u=3' },
                { name: 'Anh Tuấn', role: 'Kinh doanh tự do', text: 'Hệ thống quản lý rất tốt, tôi đăng tin và tìm khách thuê cực nhanh.', img: 'https://i.pravatar.cc/150?u=4' },
                { name: 'Mai Lan', role: 'Thiết kế đồ họa', text: 'Giao diện web rất đẹp và hiện đại, trải nghiệm tìm phòng thật sự mượt mà.', img: 'https://i.pravatar.cc/150?u=5' },
                { name: 'Quốc Bảo', role: 'Kỹ sư phần mềm', text: 'Tôi thích cách lọc phòng theo bản đồ và khu vực, rất chính xác.', img: 'https://i.pravatar.cc/150?u=6' },
                { name: 'Hà Vy', role: 'Freelancer', text: 'Dịch vụ hỗ trợ khách hàng của Tiến Đức Land rất tuyệt vời, giải đáp thắc mắc 24/7.', img: 'https://i.pravatar.cc/150?u=7' },
                { name: 'Đức Anh', role: 'Sinh viên năm cuối', text: 'Phòng trọ ở đây đa dạng, phù hợp với túi tiền sinh viên chúng em.', img: 'https://i.pravatar.cc/150?u=8' },
                { name: 'Thùy Chi', role: 'Giáo viên mầm non', text: 'Tôi đã giới thiệu cho đồng nghiệp và ai cũng tìm được phòng tốt.', img: 'https://i.pravatar.cc/150?u=9' },
                { name: 'Quang Huy', role: 'Lập trình viên', text: 'Tìm phòng chưa bao giờ dễ dàng đến thế. 10 điểm cho chất lượng!', img: 'https://i.pravatar.cc/150?u=10' },
                { name: 'Bích Phượng', role: 'Kế toán', text: 'Mọi thông tin về giá điện nước đều minh bạch, không lo bị ép giá.', img: 'https://i.pravatar.cc/150?u=11' },
                { name: 'Tấn Phát', role: 'Quản lý nhà hàng', text: 'Tiện ích xung quanh phòng được liệt kê rất đầy đủ và chi tiết.', img: 'https://i.pravatar.cc/150?u=12' },
              ].map((t, i) => (
                <div key={i} style={{ padding: '0 12px' }}>
                  <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', margin: '10px 5px', height: '260px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div style={{ fontSize: '24px', color: '#27ae60' }}>"</div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map(s => <StarFilled key={s} style={{ color: '#f1c40f', fontSize: '12px' }} />)}
                      </div>
                    </div>
                    <Text style={{ display: 'block', marginBottom: '25px', fontSize: '15px', fontStyle: 'italic', color: '#34495e', height: '80px', overflow: 'hidden' }}>{t.text}</Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={t.img} alt={t.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                      <div>
                        <Text strong style={{ display: 'block' }}>{t.name}</Text>
                        <Text style={{ fontSize: '12px', color: '#95a5a6' }}>{t.role}</Text>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </motion.section>

      {/* 6. BLOG / EXPERIENCE */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        style={{ padding: isPhone ? '40px 16px' : '100px 20px', maxWidth: '1400px', margin: '0 auto' }}
      >
        <div style={{ padding: isPhone ? '0' : isTabletLike ? '0 12px' : '0 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isPhone ? '24px' : '40px' }}>
            <Title level={2} style={{ margin: 0, fontSize: isPhone ? '22px' : '28px', fontWeight: 700 }}>Kinh nghiệm thuê trọ</Title>
            <Button type="link" style={{ color: '#27ae60', fontWeight: 600, fontSize: isPhone ? '13px' : '14px' }}>Xem tất cả <RightOutlined style={{ fontSize: '12px' }} /></Button>
          </div>

          <Row gutter={[24, 24]}>
            {[
              { title: 'Kinh nghiệm thuê trọ sinh viên cần biết', date: '12/05/2024', tag: 'Kinh nghiệm', img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=2070' },
              { title: 'Cách bố trí phòng trọ nhỏ đẹp và tiện nghi', date: '10/05/2024', tag: 'Phong thủy', img: back3 },
              { title: 'Những điều cần kiểm tra khi thuê phòng trọ', date: '08/05/2024', tag: 'Kinh nghiệm', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2070' },
              { title: 'Xu hướng phòng trọ được ưa chuộng 2024', date: '05/05/2024', tag: 'Xu hướng', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070' },
            ].map((blog, i) => (
              <Col xs={12} sm={12} md={6} key={i}>
                <motion.div variants={fadeInUp} whileHover={{ y: -5 }}>
                  <Card
                    cover={<img src={blog.img} alt={blog.title} style={{ height: '180px', objectFit: 'cover', borderRadius: '16px 16px 0 0' }} />}
                    style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                  >
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <Badge count={blog.tag} style={{ backgroundColor: '#eafaf1', color: '#45C97C', boxShadow: 'none' }} />
                      <Text style={{ fontSize: '12px', color: '#95a5a6' }}>{blog.date}</Text>
                    </div>
                    <Title level={5} style={{ fontSize: '16px', height: '44px', overflow: 'hidden' }}>{blog.title}</Title>
                    <Button type="link" style={{ padding: 0, color: '#45C97C' }}>Đọc thêm <ArrowRightOutlined style={{ fontSize: '12px' }} /></Button>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </motion.section>

      {/* 7. CTA SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        style={{ padding: isPhone ? '0 16px 40px' : '0 20px 80px', maxWidth: '1400px', margin: '0 auto' }}
      >
        <div style={{ padding: isPhone ? '0' : isTabletLike ? '0 12px' : '0 40px' }}>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => navigate('/post-room')}
            style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '32px' }}
          >
            <img
              src={bannerPhu}
              alt="Bạn đang có phòng trống? Đăng tin ngay!"
              style={{ width: '100%', display: 'block', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
            />
          </motion.div>
        </div>
      </motion.section>

    </div>
  );
};

export default HomePage;

