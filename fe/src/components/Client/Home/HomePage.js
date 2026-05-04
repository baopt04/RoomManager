import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Spin, Button, Space } from 'antd';
import {
  LoadingOutlined, RightOutlined, LeftOutlined, EnvironmentOutlined, DollarOutlined,
  TeamOutlined, ColumnWidthOutlined, CompassOutlined, GlobalOutlined,
  BankOutlined, ShopOutlined, BuildOutlined, ArrowLeftOutlined,
  TagOutlined, FacebookFilled, MessageFilled,
  SafetyCertificateOutlined, ThunderboltOutlined, CheckCircleFilled,
  HomeOutlined, StarFilled, WifiOutlined, CoffeeOutlined, SafetyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllRooms, searchRoomsByAddress } from '../../../services/customer/HomeService';
import logoZalo from '../../../assets/logo-zalo.png';
import logobanner from '../../../assets/logo_banner.png';
import logobanner2 from '../../../assets/logo_banner_2.png';
const { Title, Text } = Typography;

const PRIMARY_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200"
];

const HOVER_IMAGES = [
  "https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200"
];

const HOME_HERO_BANNERS = [
  {
    id: 1,
    title: "Giải pháp toàn diện cho không gian sống của bạn",
    desc: "Tìm phòng trọ minh bạch, xem ảnh thật và liên hệ nhanh — Tiến Đức Land đồng hành cùng bạn từ lúc tìm kiếm đến khi vào ở.",
    image: logobanner2,
  },
  {
    id: 2,
    title: "Thuê trọ thông minh — tiết kiệm thời gian mỗi ngày",
    desc: "Lọc theo khu vực, mức giá và tiện ích. Khám phá phòng trống và đặt xem chỉ với vài thao tác.",
    image: logobanner,
  },
];

const HOME_LOCATIONS = [
  { name: 'Au Co', icon: <CompassOutlined /> },
  { name: 'Trich Sai', icon: <GlobalOutlined /> },
  { name: 'An Duong Vuong', icon: <BankOutlined /> },
  { name: 'Tu Lien', icon: <ShopOutlined /> },
  { name: 'Long Bien', icon: <BuildOutlined /> },
  { name: 'Ha Dong', icon: <EnvironmentOutlined /> }
];

const HOME_STATS = [
  { value: '200+', label: 'Phong cho thue', color: '#0071e3' },
  { value: '1,500+', label: 'Khach hang', color: '#34c759' },
  { value: '7', label: 'Khu vuc', color: '#ff9500' },
  { value: '10+', label: 'Nam kinh nghiem', color: '#af52de' },
];

const RoomCard = ({ room, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format currency with pure black styling
  const formatCurrency = (amount) => {
    if (!amount) return "Liên hệ";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount).replace("₫", "VNĐ");
  };

  const isNew = (dateString) => {
    if (!dateString) return false;
    const lastModified = new Date(dateString);
    const now = new Date();
    const diffTime = now - lastModified;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 3;
  };

  const currentMonth = new Date().getMonth() + 1;
  const isRoomNew = isNew(room.lastModifiedDate);

  return (
    <Card
      hoverable
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.04)',
        background: '#ffffff',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.08)' : '0 4px 12px rgba(0,0,0,0.03)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'none',
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* Image Area */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          alt={room.name}
          src={room.images && room.images.length > 0 ? room.images[0] : room.displayImage}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
            opacity: isHovered ? 0 : 1,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        <img
          alt={`${room.name} hover`}
          src={room.images && room.images.length > 1 ? room.images[1] : (room.images && room.images.length > 0 ? room.images[0] : room.hoverImage)}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Tags */}
        {!isRoomNew && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
            <div style={{
              background: 'rgba(255, 59, 48, 0.9)', color: '#fff',
              padding: '4px 12px', borderRadius: '12px',
              fontSize: '12px', fontWeight: 600,
              backdropFilter: 'blur(4px)'
            }}>
              Giá tốt T{currentMonth}
            </div>
          </div>
        )}
        {isRoomNew && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
            <div style={{
              background: 'rgba(255,255,255,0.9)', color: '#34c759',
              padding: '4px 10px', borderRadius: '12px',
              fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '4px',
              backdropFilter: 'blur(4px)'
            }}>
              <TagOutlined style={{ fontSize: '12px' }} /> Mới
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <Text style={{
          display: 'block', fontSize: '16px', lineHeight: '1.4',
          color: '#1d1d1f', fontWeight: 600, marginBottom: '12px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          <EnvironmentOutlined style={{ color: '#0071e3', marginRight: 6 }} />
          {room.name || "Địa chỉ không xác định"}
        </Text>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <span style={{
            background: '#f5f5f7', padding: '4px 10px', borderRadius: '8px',
            fontSize: '12px', fontWeight: 500, color: '#515154',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            <ColumnWidthOutlined /> {room.acreage} m²
          </span>
          <span style={{
            background: '#f5f5f7', padding: '4px 10px', borderRadius: '8px',
            fontSize: '12px', fontWeight: 500, color: '#515154',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            <TeamOutlined /> {room.peopleMax} người
          </span>
        </div>

        {/* Price & Action */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: '16px', borderTop: '1px solid #f5f5f7'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text style={{ color: '#86868b', fontSize: '12px', marginBottom: '2px' }}>Giá thuê</Text>
            <Text style={{ color: 'black', fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>
              {formatCurrency(room.price)}<span style={{ fontSize: '13px', fontWeight: 500, color: '#8a8b86' }}>/tháng</span>
            </Text>
          </div>

          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: isHovered ? '#0071e3' : '#f5f5f7',
            color: isHovered ? '#fff' : '#0071e3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}>
            <RightOutlined style={{ fontSize: '14px' }} />
          </div>
        </div>
      </div>
    </Card>
  );
};

const ShortTermCard = ({ room, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Card
        hoverable
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          border: 'none',
          background: '#ffffff',
          boxShadow: isHovered ? '0 25px 50px rgba(0,0,0,0.12)' : '0 10px 30px rgba(0,0,0,0.04)',
          transition: 'all 0.4s ease',
          width: '320px',
          marginRight: '24px',
          flexShrink: 0
        }}
        bodyStyle={{ padding: '20px' }}
      >
        <div style={{ position: 'relative', height: '240px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
          <img
            alt={room.name}
            src={room.images && room.images.length > 0 ? room.images[0] : room.displayImage}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          />
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'rgba(255,255,255,0.95)', padding: '4px 10px',
            borderRadius: '10px', fontSize: '11px', fontWeight: 700,
            color: '#1d1d1f', backdropFilter: 'blur(4px)'
          }}>
            SHORT-STAY
          </div>
          <div style={{
            position: 'absolute', bottom: '12px', right: '12px',
            background: 'rgba(0,0,0,0.6)', color: '#fff',
            padding: '4px 10px', borderRadius: '10px',
            fontSize: '12px', fontWeight: 600, backdropFilter: 'blur(4px)'
          }}>
            <StarFilled style={{ color: '#ffb800', marginRight: 4 }} /> 4.9
          </div>
        </div>

        <Title level={5} style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px', color: '#1d1d1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {room.name}
        </Title>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', color: '#86868b', fontSize: '14px' }}>
          <span><WifiOutlined /> Wifi</span>
          <span><CoffeeOutlined /> Tea</span>
          <span><SafetyOutlined /> Safe</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f5f7', paddingTop: '16px' }}>
          <div>
            <Text style={{ fontSize: '18px', fontWeight: 700, color: '#0071e3' }}>
              {new Intl.NumberFormat('vi-VN').format(Math.round(room.price / 30 / 1000) * 1000 + 150000).replace("₫", "")}
              <span style={{ fontSize: '13px', color: '#86868b', fontWeight: 400 }}> VNĐ/đêm</span>
            </Text>
          </div>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#0071e3', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <RightOutlined style={{ fontSize: '12px' }} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};


const HomePage = () => {
  const navigate = useNavigate();
  const [dataRooms, setDataRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTitle, setSearchTitle] = useState("CÁC CĂN HỘ ĐANG TRỐNG");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    setIsSearching(false);
    setSearchTitle("CÁC CĂN HỘ ĐANG TRỐNG");
    try {
      const response = await getAllRooms();
      // Filter rooms with status "TRONG"
      const vacantRooms = response.filter(room => room.status === "TRONG");

      // Sort: Rooms within 3 days first, then others, all sorted by date descending
      const sortedRooms = vacantRooms.sort((a, b) => {
        const dateA = new Date(a.lastModifiedDate || 0);
        const dateB = new Date(b.lastModifiedDate || 0);
        const now = new Date();

        const isANew = (now - dateA) / (1000 * 60 * 60 * 24) <= 3;
        const isBNew = (now - dateB) / (1000 * 60 * 60 * 24) <= 3;

        if (isANew && !isBNew) return -1;
        if (!isANew && isBNew) return 1;

        return dateB - dateA;
      });

      // Map data with fallback images if API images are missing
      const mappedRooms = sortedRooms.map((room, index) => ({
        ...room,
        displayImage: PRIMARY_IMAGES[index % PRIMARY_IMAGES.length],
        hoverImage: HOVER_IMAGES[index % HOVER_IMAGES.length]
      }));
      setDataRooms(mappedRooms);
    } catch (error) {
      console.error("Failed to load rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSearchByAddress = async (address) => {
    setLoading(true);
    setIsSearching(true);
    setSearchTitle(`KẾT QUẢ TÌM KIẾM TẠI: ${address.toUpperCase()}`);
    try {
      const response = await searchRoomsByAddress(address);

      // Sort search results same way
      const sortedRooms = response.sort((a, b) => {
        const dateA = new Date(a.lastModifiedDate || 0);
        const dateB = new Date(b.lastModifiedDate || 0);
        const now = new Date();

        const isANew = (now - dateA) / (1000 * 60 * 60 * 24) <= 3;
        const isBNew = (now - dateB) / (1000 * 60 * 60 * 24) <= 3;

        if (isANew && !isBNew) return -1;
        if (!isANew && isBNew) return 1;

        return dateB - dateA;
      });

      const mappedRooms = sortedRooms.map((room, index) => ({
        ...room,
        displayImage: PRIMARY_IMAGES[index % PRIMARY_IMAGES.length],
        hoverImage: HOVER_IMAGES[index % HOVER_IMAGES.length]
      }));
      setDataRooms(mappedRooms);

      // Scroll to results
      document.getElementById('rooms-grid').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HOME_HERO_BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HOME_HERO_BANNERS.length) % HOME_HERO_BANNERS.length);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HOME_HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ paddingBottom: '100px', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>

      {/* Hero Slider Section */}
      <div style={{ position: 'relative', background: '#ffffff', overflow: 'hidden', padding: isMobile ? '20px 0' : '30px 0' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 40px' }}
          >
            <Title
              level={1}
              style={{
                fontSize: isMobile ? '32px' : isTablet ? '44px' : '52px',
                fontWeight: 800,
                letterSpacing: '-2px',
                color: '#1d1d1f',
                margin: '0 auto 16px',
                lineHeight: 1.1,
                maxWidth: '900px'
              }}
            >
              {HOME_HERO_BANNERS[currentSlide].title}
            </Title>
            <Text style={{ fontSize: isMobile ? '16px' : '18px', color: '#86868b', maxWidth: '700px', display: 'block', margin: '0 auto 40px' }}>
              {HOME_HERO_BANNERS[currentSlide].desc}
            </Text>

            <div style={{ position: 'relative', marginTop: '20px' }}>
              <img
                src={HOME_HERO_BANNERS[currentSlide].image}
                alt="Banner"
                loading={currentSlide === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  maxHeight: isMobile ? '280px' : '500px',
                  objectFit: 'cover',
                  WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0.75) 76%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0.75) 76%, transparent 100%)'
                }}
              />

              <div
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                style={{
                  position: 'absolute', left: isMobile ? '8px' : '20px', top: '50%', transform: 'translateY(-50%)',
                  zIndex: 100, cursor: 'pointer', width: isMobile ? '36px' : '48px', height: isMobile ? '36px' : '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                  borderRadius: '50%', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s'
                }}
              >
                <LeftOutlined style={{ fontSize: isMobile ? '16px' : '20px', color: '#1d1d1f' }} />
              </div>

              <div
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                style={{
                  position: 'absolute', right: isMobile ? '8px' : '20px', top: '50%', transform: 'translateY(-50%)',
                  zIndex: 100, cursor: 'pointer', width: isMobile ? '36px' : '48px', height: isMobile ? '36px' : '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                  borderRadius: '50%', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s'
                }}
              >
                <RightOutlined style={{ fontSize: isMobile ? '16px' : '20px', color: '#1d1d1f' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              {HOME_HERO_BANNERS.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Banner ${index + 1}`}
                  style={{
                    width: currentSlide === index ? '22px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    border: 'none',
                    background: currentSlide === index ? '#1d1d1f' : '#d2d2d7',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    padding: 0
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>


      {/* 4. LOCATIONS SECTION - Region Discovery */}
      <div style={{ padding: isMobile ? '28px 12px' : '40px 20px', maxWidth: '1400px', margin: '0 auto 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Title level={2} style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '32px', paddingLeft: '8px', textAlign: 'center' }}>
            Tìm kiếm theo khu vực
          </Title>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            padding: '0 8px'
          }}>
            {HOME_LOCATIONS.map((loc, index) => (
              <motion.div
                key={loc.name}
                whileHover={{ scale: 1.05, translateY: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                style={{
                  background: '#ffffff',
                  padding: isMobile ? '12px 16px' : '16px 24px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0'
                }}
                onClick={() => handleSearchByAddress(loc.name)}
              >
                <div style={{ fontSize: '20px', color: '#0071e3' }}>{loc.icon}</div>
                <Text strong style={{ fontSize: isMobile ? '14px' : '16px', color: '#1d1d1f' }}>{loc.name}</Text>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ padding: isMobile ? '30px 16px 20px' : '60px 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div style={{
            display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap',
            background: '#ffffff', borderRadius: '24px', padding: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0'
          }}>
            <div style={{ flex: 1, minWidth: isMobile ? '100%' : '280px' }}>
              <Text style={{
                color: '#0071e3', fontSize: '12px', fontWeight: 600,
                letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px'
              }}>
                GIỚI THIỆU
              </Text>
              <Title level={3} style={{
                fontSize: '26px', fontWeight: 700, color: '#1d1d1f',
                margin: '0 0 12px', lineHeight: 1.3
              }}>
                Tiến Đức Land — <br />Kiến tạo không gian sống
              </Title>
              <Text style={{
                color: '#86868b', fontSize: '15px', lineHeight: 1.8, display: 'block', marginBottom: '12px'
              }}>
                <strong style={{ color: '#1d1d1f' }}>Tiến Đức Land</strong> là đơn vị chuyên cho thuê phòng trọ, nhà nguyên căn tại Hà Nội. Với hơn 5 năm kinh nghiệm, chúng tôi cam kết mang đến không gian sống sạch sẽ, tiện nghi và an toàn cho sinh viên, người đi làm.
              </Text>
              <Text style={{
                color: '#86868b', fontSize: '15px', lineHeight: 1.8, display: 'block', marginBottom: '20px'
              }}>
                Hệ thống phòng trọ Tiến Đức Land trải dài tại các khu vực: Âu Cơ, Trích Sài, An Dương Vương, Tứ Liên, Long Biên và Hà Đông — đáp ứng đa dạng nhu cầu và ngân sách của khách hàng.
              </Text>
              <Button
                type="link"
                onClick={() => navigate('/support')}
                style={{ padding: 0, color: '#0071e3', fontWeight: 600, fontSize: '15px' }}
              >
                Tìm hiểu thêm về Tiến Đức Land <RightOutlined style={{ fontSize: '12px' }} />
              </Button>
            </div>


            <div style={{
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', minWidth: isMobile ? '100%' : '240px'
            }}>
              {HOME_STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  style={{
                    textAlign: 'center', padding: '16px 12px',
                    background: '#f5f5f7', borderRadius: '16px'
                  }}
                >
                  <Title level={4} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Title>
                  <Text style={{ color: '#86868b', fontSize: '12px' }}>{stat.label}</Text>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ padding: isMobile ? '36px 0' : '60px 0', background: '#f5f5f7', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 12px' : '0 20px' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <div>
                <Text style={{
                  color: '#0071e3', fontSize: '13px', fontWeight: 600,
                  letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '12px'
                }}>
                  DU LỊCH & CÔNG TÁC
                </Text>
                <Title level={2} style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: '#1d1d1f' }}>
                  Phòng cho thuê ngắn hạn
                </Title>
              </div>
              <Button
                type="link"
                icon={<RightOutlined />}
                style={{ color: '#0071e3', fontWeight: 600, fontSize: '15px' }}
                onClick={() => navigate('/rooms')}
              >
                Xem tất cả homestay
              </Button>
            </div>
          </motion.div>

          <div style={{
            display: 'flex',
            overflowX: 'auto',
            padding: '20px 0 40px',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            cursor: 'grab'
          }} className="hide-scrollbar">
            {dataRooms.length > 0 ? (
              dataRooms.slice(0, 5).map((room, idx) => (
                <ShortTermCard
                  key={room.id}
                  room={room}
                  onClick={() => navigate(`/room/${room.slug}-${room.id}`)}
                />
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} style={{ width: '320px', height: '400px', background: '#fff', borderRadius: '24px', marginRight: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Spin />
                </div>
              ))
            )}
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}} />
        </div>
      </div>

      <div id="rooms-grid" style={{ padding: isMobile ? '16px 12px' : '20px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '32px', paddingLeft: '8px', textAlign: 'center' }}>
          {searchTitle}
        </Title>

        {isSearching && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Button type="link" onClick={fetchRooms} style={{ color: '#0071e3', fontSize: '16px' }}>
              <ArrowLeftOutlined /> Quay lại danh sách mặc định
            </Button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#1d1d1f' }} spin />} />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <Row gutter={isMobile ? [12, 20] : [24, 40]}>
              {dataRooms.length > 0 ? (
                // 4 items per row is lg={6} because 24 / 6 = 4
                dataRooms.map((room) => (
                  <Col xs={24} md={12} lg={6} xl={6} key={room.id}>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                      }}
                    >
                      <RoomCard room={room} onClick={() => navigate(`/room/${room.slug}-${room.id}`)} />
                    </motion.div>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#86868b', fontSize: '18px' }}>
                    {isSearching ? "Không tìm thấy phòng nào tại khu vực này." : "Hiện tại không có phòng trống."}
                  </div>
                </Col>
              )}
            </Row>
          </motion.div>
        )}
      </div>
      <div style={{ padding: isMobile ? '30px 16px' : '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Title level={2} style={{ fontSize: '28px', fontWeight: 700, textAlign: 'center', color: '#1d1d1f', marginBottom: '8px' }}>
            Tại sao chọn Tiến Đức Land?
          </Title>
          <Text style={{ display: 'block', textAlign: 'center', color: '#86868b', fontSize: '15px', marginBottom: '40px' }}>
            Cam kết mang đến trải nghiệm thuê trọ tốt nhất
          </Text>
          <Row gutter={[20, 20]}>
            {[
              { icon: '🔒', title: 'An ninh 24/7', desc: 'Camera giám sát, khóa vân tay, bảo vệ trực cả ngày lẫn đêm.' },
              { icon: '🧹', title: 'Sạch sẽ & Tiện nghi', desc: 'Vệ sinh định kỳ, trang bị đầy đủ nội thất cơ bản.' },
              { icon: '💰', title: 'Giá cả minh bạch', desc: 'Không phí phát sinh, giá niêm yết rõ ràng, hợp đồng công khai.' },
              { icon: '🔧', title: 'Sửa chữa nhanh', desc: 'Đội ngũ kỹ thuật hỗ trợ trong vòng 24h khi có sự cố.' },
              { icon: '📍', title: 'Vị trí thuận tiện', desc: 'Gần trường học, chợ, siêu thị, bệnh viện và bến xe buýt.' },
              { icon: '📱', title: 'Quản lý online', desc: 'Thanh toán, hợp đồng và hỗ trợ đều thực hiện trực tuyến.' },
            ].map((item, i) => (
              <Col xs={24} sm={12} md={8} key={i}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                  <div style={{ background: '#fff', borderRadius: '20px', padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', height: '100%' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                    <Title level={5} style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px', color: '#1d1d1f' }}>{item.title}</Title>
                    <Text style={{ color: '#86868b', fontSize: '14px', lineHeight: 1.7 }}>{item.desc}</Text>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </div>

      {/* 6. QUY TRÌNH THUÊ PHÒNG - Horizontal Timeline Redesign */}
      <div style={{ padding: isMobile ? '40px 12px 60px' : '60px 20px 80px', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Title level={2} style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: 800, textAlign: 'center', color: '#1d1d1f', marginBottom: '12px', letterSpacing: '-1.5px' }}>
            Quy trình thuê phòng
          </Title>
          <Text style={{ display: 'block', textAlign: 'center', color: '#86868b', fontSize: '16px', marginBottom: '60px' }}>
            Chỉ 4 bước đơn giản để tìm thấy tổ ấm mới của bạn
          </Text>

          <div style={{ position: 'relative' }}>
            {/* Horizontal Connecting Line (Desktop Only) */}
            {!isMobile && (
              <div style={{
                position: 'absolute',
                top: '40px',
                left: '10%',
                right: '10%',
                height: '2px',
                background: 'linear-gradient(to right, #0071e3 0%, #34c759 33%, #ff9500 66%, #af52de 100%)',
                opacity: 0.2,
                zIndex: 0
              }} />
            )}

            <div style={{ display: 'flex', gap: '20px', flexWrap: isMobile ? 'wrap' : 'nowrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              {[
                { step: '01', title: 'Tìm phòng', desc: 'Duyệt danh sách phòng trống theo khu vực và khoảng giá.', color: '#0071e3' },
                { step: '02', title: 'Đặt lịch xem', desc: 'Đăng ký lịch xem phòng, chúng tôi sẽ liên hệ xác nhận.', color: '#34c759' },
                { step: '03', title: 'Ký hợp đồng', desc: 'Thỏa thuận điều khoản, ký hợp đồng và đặt cọc.', color: '#ff9500' },
                { step: '04', title: 'Nhận phòng', desc: 'Nhận chìa khóa, bắt đầu cuộc sống mới.', color: '#af52de' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  style={{
                    flex: isMobile ? '1 1 100%' : '1 1 0',
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '32px 24px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.03)',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: item.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 800,
                    margin: '-72px auto 24px', // Float above the card
                    boxShadow: `0 12px 24px ${item.color}44`,
                    border: '6px solid #fff'
                  }}>
                    {item.step}
                  </div>
                  <Title level={4} style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#1d1d1f' }}>
                    {item.title}
                  </Title>
                  <Text style={{ color: '#6e6e73', fontSize: '14px', lineHeight: 1.6 }}>
                    {item.desc}
                  </Text>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 7. ĐÁNH GIÁ KHÁCH HÀNG */}
      <div style={{ padding: isMobile ? '28px 12px 40px' : '40px 20px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Title level={2} style={{ fontSize: '28px', fontWeight: 700, textAlign: 'center', color: '#1d1d1f', marginBottom: '8px' }}>Khách hàng nói gì?</Title>
          <Text style={{ display: 'block', textAlign: 'center', color: '#86868b', fontSize: '15px', marginBottom: '40px' }}>Phản hồi từ khách hàng đã thuê tại Tiến Đức Land</Text>
          <Row gutter={[20, 20]}>
            {[
              { name: 'Nguyễn Minh Anh', role: 'Sinh viên ĐH Ngoại Thương', text: 'Phòng sạch sẽ, chủ nhà dễ thương, giá hợp lý. Mình ở đây hơn 2 năm rất hài lòng!', rating: 5 },
              { name: 'Trần Văn Hùng', role: 'Nhân viên văn phòng', text: 'Thủ tục nhanh gọn, không phí phát sinh. Vị trí gần Hồ Tây rất thuận tiện.', rating: 5 },
              { name: 'Lê Thị Hương', role: 'Sinh viên ĐH Bách Khoa', text: 'Phòng đầy đủ tiện nghi, an ninh tốt. Hệ thống quản lý online rất tiện lợi.', rating: 4 },
            ].map((r, i) => (
              <Col xs={24} md={8} key={i}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <div style={{ background: '#fff', borderRadius: '20px', padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0', height: '100%' }}>
                    <div style={{ marginBottom: '12px' }}>{Array.from({ length: 5 }).map((_, si) => (<span key={si} style={{ fontSize: '16px', color: si < r.rating ? '#ffb800' : '#e0e0e0' }}>★</span>))}</div>
                    <Text style={{ color: '#515154', fontSize: '14px', lineHeight: 1.8, display: 'block', marginBottom: '16px', fontStyle: 'italic' }}>"{r.text}"</Text>
                    <div style={{ borderTop: '1px solid #f5f5f7', paddingTop: '12px' }}>
                      <Text strong style={{ color: '#1d1d1f', fontSize: '14px', display: 'block' }}>{r.name}</Text>
                      <Text style={{ color: '#86868b', fontSize: '12px' }}>{r.role}</Text>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </div>

      {/* 8. CTA */}
      <div style={{ padding: isMobile ? '0 12px 40px' : '0 20px 60px', maxWidth: '900px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div style={{ background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%)', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
            <Title level={3} style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0 }}>Bạn đang tìm phòng trọ?</Title>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', display: 'block', margin: '12px 0 28px', lineHeight: 1.7 }}>
              Liên hệ ngay Tiến Đức Land · Hotline: <strong style={{ color: '#fff' }}>0364.862.148</strong>
            </Text>
            <Space size="middle" wrap>
              <Button type="primary" size="large" onClick={() => { document.getElementById('rooms-grid').scrollIntoView({ behavior: 'smooth' }); }}
                style={{ background: '#0071e3', border: 'none', borderRadius: '16px', fontWeight: 600, height: '48px', padding: '0 32px', fontSize: '15px', boxShadow: '0 8px 20px rgba(0,113,227,0.3)' }}>
                Xem phòng trống
              </Button>
              <Button size="large" onClick={() => navigate('/support')}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '16px', fontWeight: 600, height: '48px', padding: '0 32px', fontSize: '15px' }}>
                Tìm hiểu thêm
              </Button>
            </Space>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default HomePage;
