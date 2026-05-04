import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Space, Row, Col, Divider, Drawer } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  PhoneOutlined, 
  MenuOutlined, 
  FacebookFilled, 
  MessageFilled 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import logo from './media/tien_duc_land_logo_2.png';
import logoZalo from '../../assets/logo-zalo.png';
const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

const ClientLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const selectedKey = location.pathname;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setDrawerVisible(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { key: '/', label: 'Tổng quan', path: '/' },
    { key: '/rooms', label: 'Phòng trọ', path: '/rooms' },
    { key: '/locations', label: 'Khu vực', path: '/locations' },
    { key: '/support', label: 'Khám phá', path: '/support' },
  ];

  const handleMobileNavClick = (path) => {
    navigate(path);
    setDrawerVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f7' }}>

      {/* Main Header */}
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          padding: 0,
          height: '60px',
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px'
        }}>
          {/* Logo Area */}
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '10px 0'
            }}
          >
            <img src={logo} alt="Logo" style={{ width: isMobile ? '45px' : '60px', height: 'auto' }} />
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              style={{
                background: 'transparent',
                borderBottom: 'none',
                fontSize: '14px',
                fontWeight: 400,
                flex: 1,
                justifyContent: 'center',
                letterSpacing: '-0.2px',
              }}
              items={navItems.map(item => ({
                key: item.key,
                label: <Link to={item.path}>{item.label}</Link>,
              }))}
            />
          )}

          {/* Desktop: Action Buttons */}
          {!isMobile && (
            <Space size="middle" align="center">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
                <PhoneOutlined style={{ color: '#1d1d1f', fontSize: '14px' }} />
                <Text style={{ fontWeight: 600, color: '#1d1d1f', fontSize: '14px', letterSpacing: '-0.2px' }}>
                  0364.862.148
                </Text>
              </div>
              <Button
                type="primary"
                onClick={() => navigate('/login')}
                style={{
                  background: '#1d1d1f',
                  borderColor: '#1d1d1f',
                  borderRadius: '20px',
                  fontWeight: 500,
                  padding: '0 16px',
                  height: '32px',
                  fontSize: '13px'
                }}
              >
                Đăng tin
              </Button>
            </Space>
          )}

          {/* Mobile: Hamburger */}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: '20px' }} />}
              onClick={() => setDrawerVisible(true)}
              style={{ padding: '4px 8px' }}
            />
          )}
        </div>
      </Header>

      {/* Mobile Navigation Drawer */}
      <Drawer
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="Logo" style={{ width: '35px', height: 'auto' }} />
            <span style={{ fontWeight: 600, fontSize: '15px' }}>Tiến Đức Land</span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <div
              key={item.key}
              onClick={() => handleMobileNavClick(item.path)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: selectedKey === item.key ? 600 : 400,
                color: selectedKey === item.key ? '#1677ff' : '#1d1d1f',
                background: selectedKey === item.key ? '#e6f4ff' : 'transparent',
                fontSize: '15px',
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        <Divider />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
            <PhoneOutlined style={{ color: '#1d1d1f' }} />
            <Text style={{ fontWeight: 600, fontSize: '14px' }}>0364.862.148</Text>
          </div>
          <Button
            type="primary"
            block
            onClick={() => { navigate('/login'); setDrawerVisible(false); }}
            style={{
              background: '#1d1d1f',
              borderColor: '#1d1d1f',
              borderRadius: '20px',
              fontWeight: 500,
              height: '40px',
              fontSize: '14px'
            }}
          >
            Đăng tin
          </Button>
        </div>
      </Drawer>

      {/* Main Content Area */}
      <Content style={{ padding: '0' }}>
        {children}
      </Content>

      {/* Footer */}
      <Footer
        style={{
          background: '#f5f5f7',
          color: '#1d1d1f',
          padding: isMobile ? '40px 0' : '60px 0',
          borderTop: '1px solid #d2d2d7',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

          <Row gutter={[40, 40]}>
            <Col xs={24} md={8}>
              <Title level={5} style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px' }}>Tiến Đức Land</Title>
              <Text style={{ color: '#515154', fontSize: '12px', lineHeight: '1.6', display: 'block' }}>
                Nền tảng công nghệ bất động sản cung cấp giải pháp cho thuê nhanh chóng, trải nghiệm trực quan và minh bạch 100%. Phục vụ hàng triệu khách hàng toàn quốc.
              </Text>
            </Col>

            <Col xs={12} md={5}>
              <Title level={5} style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px' }}>TÀI KHOẢN</Title>
              <Space direction="vertical" size="small">
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Quản lý phòng</Link>
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Quản lý hợp đồng</Link>
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Lịch sử thanh toán</Link>
              </Space>
            </Col>

            <Col xs={12} md={5}>
              <Title level={5} style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px' }}>KHÁM PHÁ</Title>
              <Space direction="vertical" size="small">
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Phòng trọ sinh viên</Link>
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Căn hộ dịch vụ</Link>
                <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Ký túc xá cao cấp</Link>
              </Space>
            </Col>

            <Col xs={24} md={6}>
              <Title level={5} style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px' }}>LIÊN HỆ</Title>
              <Space direction="vertical" size="small" style={{ color: '#515154', fontSize: '12px' }}>
                <Text style={{ color: '#515154', fontSize: '12px' }}>Hotline: 0364.862.148</Text>
                <Text style={{ color: '#515154', fontSize: '12px' }}>Email: tienducland@gmail.com</Text>
                <Text style={{ color: '#515154', fontSize: '12px' }}>Địa chỉ: Thành phố Hà Nội</Text>
              </Space>
            </Col>
          </Row>

          <Divider style={{ borderColor: '#d2d2d7', width: '100%', minWidth: '100%', margin: '40px 0 20px' }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <Text style={{ color: '#86868b', fontSize: '12px' }}>
              Bản quyền © {new Date().getFullYear()} Rentals Inc. Bảo lưu mọi quyền.
            </Text>
            <Space size="middle" wrap>
              <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Chính sách bảo mật</Link>
              <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Điều khoản sử dụng</Link>
              <Link to="#" style={{ color: '#515154', fontSize: '12px' }}>Pháp lý</Link>
            </Space>
          </div>

        </div>
      </Footer>
      {/* Global Floating Contact Buttons (Pill Style) */}
      <div style={{ 
        position: 'fixed', 
        bottom: '24px', 
        right: '24px', 
        zIndex: 2000, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        alignItems: 'flex-end'
      }}>
        {/* Chat Facebook Button */}
        <motion.a
          href="https://m.me/yourpage"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: -5 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0084ff', color: '#fff',
            width: isMobile ? '44px' : 'auto',
            height: isMobile ? '44px' : 'auto',
            padding: isMobile ? '0' : '8px 20px', 
            borderRadius: '100px',
            fontSize: '13px', fontWeight: 700,
            boxShadow: '0 4px 15px rgba(0,132,255,0.3)',
            textDecoration: 'none'
          }}
        >
          <FacebookFilled style={{ fontSize: isMobile ? '24px' : '20px' }} />
          {!isMobile && <span style={{ marginLeft: '10px' }}>CHAT FACEBOOK</span>}
        </motion.a>

        {/* Chat Zalo Button */}
        <motion.a
          href="https://zalo.me/0364862148"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: -5 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0068ff', color: '#fff',
            width: isMobile ? '44px' : 'auto',
            height: isMobile ? '44px' : 'auto',
            padding: isMobile ? '0' : '8px 20px', 
            borderRadius: '100px',
            fontSize: '13px', fontWeight: 700,
            boxShadow: '0 4px 15px rgba(0,104,255,0.3)',
            textDecoration: 'none'
          }}
        >
          <div style={{ 
            width: isMobile ? '30px' : '24px', 
            height: isMobile ? '30px' : '24px', 
            background: '#fff', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <img src={logoZalo} alt="Zalo" style={{ width: isMobile ? '18px' : '16px' }} />
          </div>
          {!isMobile && <span style={{ marginLeft: '10px' }}>CHAT ZALO</span>}
        </motion.a>

        {/* Hotline Button */}
        <motion.a
          href="tel:0364862148"
          whileHover={{ scale: 1.05 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#00992d', color: '#fff',
            width: isMobile ? '50px' : 'auto',
            height: isMobile ? '50px' : '52px',
            padding: isMobile ? '0' : '4px 24px 4px 4px', 
            borderRadius: '100px',
            fontSize: '18px', fontWeight: 800,
            boxShadow: '0 8px 20px rgba(0,153,45,0.3)',
            textDecoration: 'none',
            position: 'relative'
          }}
        >
          <div style={{ 
            width: isMobile ? '42px' : '44px', 
            height: isMobile ? '42px' : '44px', 
            background: isMobile ? 'transparent' : '#fff', 
            borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: isMobile ? '0' : '12px',
            boxShadow: isMobile ? 'none' : '0 0 0 4px rgba(255,255,255,0.2)'
          }}>
            <MessageFilled style={{ color: isMobile ? '#fff' : '#00992d', fontSize: isMobile ? '28px' : '22px' }} />
          </div>
          {!isMobile && "0364.862.148"}
          <div style={{ 
            position: 'absolute', left: '-8px', top: '-8px', 
            right: '-8px', bottom: '-8px', 
            borderRadius: '100px', border: '2px solid #00992d',
            animation: 'pulse-green-global 2s infinite',
            opacity: 0.5,
            pointerEvents: 'none'
          }} />
        </motion.a>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse-green-global {
          0% { transform: scale(1); opacity: 0.5; }
          70% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(1.2); opacity: 0; }
        }
      `}} />
    </Layout>
  );
};

export default ClientLayout;
