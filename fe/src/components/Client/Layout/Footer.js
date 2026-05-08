import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import {
  FacebookFilled,
  YoutubeFilled,
  TikTokOutlined,
  InstagramFilled,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logo from '../../../assets/tien_duc_land_logo_2.png';
const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ background: '#fff', padding: '40px 0 30px', borderTop: '1px solid #f0f0f0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <Row gutter={[40, 40]}>
          <Col xs={24} md={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{
                width: '62px',
                height: '39px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '18px'
              }}><img
                  src={logo}
                  alt="logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                /></div>
              <span style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#27ae60',
                letterSpacing: '-0.5px'
              }}>Tiến Đức Land</span>
            </div>
            <Text style={{ color: '#7f8c8d', fontSize: '14px', lineHeight: '1.6', display: 'block', marginBottom: '20px' }}>
              Nền tảng tìm phòng trọ trực tuyến uy tín, giúp kết nối người thuê và chủ trọ nhanh chóng, an toàn.
            </Text>
            <Space size="middle">
              <FacebookFilled style={{ fontSize: '20px', color: '#2c3e50' }} />
              <YoutubeFilled style={{ fontSize: '20px', color: '#2c3e50' }} />
              <TikTokOutlined style={{ fontSize: '20px', color: '#2c3e50' }} />
              <InstagramFilled style={{ fontSize: '20px', color: '#2c3e50' }} />
            </Space>
          </Col>

          <Col xs={12} md={4}>
            <Title level={5} style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Về Chúng Tôi</Title>
            <Space direction="vertical" size="middle">
              <Link to="/about" style={{ color: '#7f8c8d', fontSize: '14px' }}>Giới thiệu</Link>
              <Link to="/blog" style={{ color: '#7f8c8d', fontSize: '14px' }}>Blog Tiến Đức Land</Link>
              <Link to="/policy" style={{ color: '#7f8c8d', fontSize: '14px' }}>Quy chế hoạt động</Link>
              <Link to="/contact" style={{ color: '#7f8c8d', fontSize: '14px' }}>Liên hệ</Link>
            </Space>
          </Col>

          <Col xs={12} md={4}>
            <Title level={5} style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Hỗ trợ</Title>
            <Space direction="vertical" size="middle">
              <Link to="/help" style={{ color: '#7f8c8d', fontSize: '14px' }}>Trung tâm trợ giúp</Link>
              <Link to="/guide" style={{ color: '#7f8c8d', fontSize: '14px' }}>Hướng dẫn đăng tin</Link>
              <Link to="/faq" style={{ color: '#7f8c8d', fontSize: '14px' }}>Câu hỏi thường gặp</Link>
              <Link to="/report" style={{ color: '#7f8c8d', fontSize: '14px' }}>Quy trình giải quyết</Link>
              <Link to="/safety" style={{ color: '#7f8c8d', fontSize: '14px' }}>Chính sách bảo mật</Link>
            </Space>
          </Col>

          <Col xs={24} md={5}>
            <Title level={5} style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Danh mục phổ biến</Title>
            <Space direction="vertical" size="middle">
              <Link to="/rooms?price=0-2" style={{ color: '#7f8c8d', fontSize: '14px' }}>Phòng trọ dưới 2 triệu</Link>
              <Link to="/rooms?price=2-3" style={{ color: '#7f8c8d', fontSize: '14px' }}>Phòng trọ 2 - 3 triệu</Link>
              <Link to="/rooms?price=3-5" style={{ color: '#7f8c8d', fontSize: '14px' }}>Phòng trọ 3 - 5 triệu</Link>
              <Link to="/rooms?tag=co-gac" style={{ color: '#7f8c8d', fontSize: '14px' }}>Phòng trọ có gác</Link>
              <Link to="/rooms?location=gan-truong" style={{ color: '#7f8c8d', fontSize: '14px' }}>Phòng trọ gần trường</Link>
            </Space>
          </Col>

          <Col xs={24} md={5}>
            <Title level={5} style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Tải ứng dụng</Title>
            <Text style={{ color: '#7f8c8d', fontSize: '14px', display: 'block', marginBottom: '15px' }}>
              Tải app Tiến Đức Land để trải nghiệm tốt hơn trên di động.
            </Text>
            <Space direction="vertical" size="middle">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: '40px', cursor: 'pointer' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: '40px', cursor: 'pointer' }} />
            </Space>
          </Col>
        </Row>

        <Divider style={{ margin: '40px 0 20px' }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <Text style={{ color: '#95a5a6', fontSize: '12px' }}>
            © 2024 Tiến Đức Land. All rights reserved.
          </Text>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PhoneOutlined style={{ color: '#7f8c8d' }} />
              <Text style={{ color: '#7f8c8d', fontSize: '13px' }}>Hotline: 1800 1234</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MailOutlined style={{ color: '#7f8c8d' }} />
              <Text style={{ color: '#7f8c8d', fontSize: '13px' }}>Email: support@tienducland.vn</Text>
            </div>
          </div>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
