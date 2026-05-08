import React, { useState, useEffect } from 'react';
import { Layout, Button, Drawer, Badge } from 'antd';
import {
  MenuOutlined,
  HeartOutlined,
  UserOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logo from '../../../assets/tien_duc_land_logo_2.png';
import { useClientBreakpoints } from '../hooks/useClientBreakpoints';
const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPhone, isTablet, isTabletLike } = useClientBreakpoints();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    { key: '/', label: 'Trang chủ' },
    { key: '/rooms', label: 'Tìm phòng' },
    { key: '/locations', label: 'Khu vực' },
    { key: '/blog', label: 'Blog' },
    { key: '/support', label: 'Về chúng tôi' },

  ];

  const useCompactNav = isPhone || isTablet;

  return (
    <AntHeader
      style={{
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        width: '100%',
        background: scrolled ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        height: '72px',
        lineHeight: '72px',
        padding: '0 20px',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.04)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: 'none !important',
        border: 'none !important',
        outline: 'none !important'
      }}
    >
      <div style={{
        width: '100%',
        padding: isPhone ? '0 10px' : isTabletLike ? '0 20px' : '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            gap: '8px'
          }}
        >
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
            fontSize: isPhone ? '16px' : '18px',
            fontWeight: 800,
            color: '#27ae60',
            letterSpacing: '-0.5px',
            whiteSpace: 'nowrap'
          }}>Tiến Đức Land</span>
        </div>

        {/* Desktop Menu (hide on iPad mini/air) */}
        {!useCompactNav && (
          <div style={{ display: 'flex', gap: isTabletLike ? '16px' : '30px', alignItems: 'center', height: '100%' }}>
            {menuItems.map(item => (
              <Link
                key={item.key}
                to={item.key}
                style={{
                  color: location.pathname === item.key ? '#27ae60' : '#2c3e50',
                  fontWeight: location.pathname === item.key ? 700 : 500,
                  fontSize: '15px',
                  position: 'relative',
                  height: '72px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {item.label}
                {location.pathname === item.key && (
                  <div style={{
                    position: 'absolute',
                    bottom: '18px',
                    left: '0',
                    right: '0',
                    height: '3px',
                    background: '#27ae60',
                    borderRadius: '2px'
                  }} />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!useCompactNav && (
            <>
              <Badge count={0} showZero={false}>
                <HeartOutlined style={{ fontSize: '20px', color: '#2c3e50', cursor: 'pointer' }} />
              </Badge>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/login')}
                style={{
                  background: '#27ae60',
                  borderColor: '#27ae60',
                  borderRadius: '10px',
                  height: '40px',
                  fontWeight: 600,
                  boxShadow: '0 4px 10px rgba(39, 174, 96, 0.2)'
                }}
              >
                Đăng tin phòng
              </Button>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#f0f2f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <UserOutlined style={{ fontSize: '18px', color: '#2c3e50' }} />
              </div>
            </>
          )}

          {useCompactNav && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: '22px' }} />}
              onClick={() => setDrawerVisible(true)}
            />
          )}
        </div>
      </div>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {menuItems.map(item => (
            <Link
              key={item.key}
              to={item.key}
              onClick={() => setDrawerVisible(false)}
              style={{
                fontSize: '16px',
                color: location.pathname === item.key ? '#27ae60' : '#2c3e50',
                fontWeight: location.pathname === item.key ? 700 : 500,
                padding: '10px 0',
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              {item.label}
            </Link>
          ))}
          <Button
            type="primary"
            block
            size="large"
            onClick={() => { navigate('/login'); setDrawerVisible(false); }}
            style={{ background: '#27ae60', borderColor: '#27ae60', marginTop: '20px', borderRadius: '10px' }}
          >
            Đăng tin phòng
          </Button>
        </div>
      </Drawer>
    </AntHeader>
  );
};

export default Header;
