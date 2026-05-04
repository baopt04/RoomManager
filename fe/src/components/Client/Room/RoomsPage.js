import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Spin, Button, Empty, Slider } from 'antd';
import {
  LoadingOutlined, RightOutlined, EnvironmentOutlined, TagOutlined,
  CompassOutlined, GlobalOutlined, BankOutlined, ShopOutlined,
  BuildOutlined, HomeOutlined, AppstoreOutlined, FilterOutlined, WifiOutlined, StarFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllRooms, searchRoomsByAddress } from '../../../services/customer/HomeService';
const { Title, Text } = Typography;


const RoomCard = ({ room, onClick, index, activeType }) => {
  const [isHovered, setIsHovered] = useState(false);


  const isShortTerm = activeType === 'short' || (activeType === 'all' && index % 3 === 0);

  const formatCurrency = (amount) => {
    if (!amount) return "Liên hệ";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency', currency: 'VND', maximumFractionDigits: 0
    }).format(amount).replace("₫", "VNĐ");
  };

  const isNew = (dateString) => {
    if (!dateString) return false;
    return (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24) <= 3;
  };

  const isRoomNew = isNew(room.lastModifiedDate);
  // Calculate daily price for short term (premium on monthly / 30)
  const dailyPrice = Math.round(room.price / 30 / 1000) * 1000 + 150000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
    >
      <Card
        hoverable
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          border: isShortTerm ? '2px solid rgba(0,113,227,0.1)' : '1px solid rgba(0,0,0,0.04)',
          background: '#ffffff',
          boxShadow: isHovered ? '0 25px 50px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.03)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered ? 'translateY(-8px)' : 'none',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
          <img
            alt={room.name}
            src={room.images && room.images.length > 0 ? room.images[0] : room.displayImage}
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          />

          <div style={{
            position: 'absolute', top: '12px', left: '12px', zIndex: 10,
            background: isShortTerm ? 'rgba(0,113,227,0.9)' : 'rgba(29,29,31,0.8)',
            color: '#fff', padding: '4px 10px', borderRadius: '10px',
            fontSize: '11px', fontWeight: 700, backdropFilter: 'blur(4px)',
            textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {isShortTerm ? 'Homestay' : 'Phòng trọ'}
          </div>

          {isRoomNew && (
            <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
              <div style={{
                background: 'rgba(255,255,255,0.9)', color: '#34c759',
                padding: '4px 10px', borderRadius: '10px',
                fontSize: '12px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '4px',
                backdropFilter: 'blur(4px)'
              }}>
                <TagOutlined style={{ fontSize: '12px' }} /> Mới
              </div>
            </div>
          )}

          {isShortTerm && (
            <div style={{
              position: 'absolute', bottom: '12px', right: '12px',
              background: 'rgba(0,0,0,0.6)', color: '#fff',
              padding: '4px 10px', borderRadius: '10px',
              fontSize: '12px', fontWeight: 600, backdropFilter: 'blur(4px)'
            }}>
              <StarFilled style={{ color: '#ffb800', marginRight: 4 }} /> 4.9
            </div>
          )}
        </div>

        <div style={{ padding: '20px' }}>
          <Text style={{
            display: 'block', fontSize: '16px', lineHeight: '1.4',
            color: '#1d1d1f', fontWeight: 600, marginBottom: '8px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {room.name || "Địa chỉ không xác định"}
          </Text>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', minHeight: '22px' }}>
            {isShortTerm ? (
              <>
                <span style={{ fontSize: '12px', color: '#86868b' }}><WifiOutlined /> Wifi</span>
                <span style={{ fontSize: '12px', color: '#86868b' }}><StarFilled style={{ color: '#ffb800' }} /> Best Stay</span>
              </>
            ) : (
              <>
                <span style={{
                  background: '#f5f5f7', padding: '2px 8px', borderRadius: '6px',
                  fontSize: '11px', color: '#515154'
                }}>
                  {room.acreage} m²
                </span>
                <span style={{
                  background: '#f5f5f7', padding: '2px 8px', borderRadius: '6px',
                  fontSize: '11px', color: '#515154'
                }}>
                  Tối đa {room.peopleMax} người
                </span>
              </>
            )}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: '16px', borderTop: '1px solid #f5f5f7'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ color: '#86868b', fontSize: '11px', marginBottom: '2px' }}>
                {isShortTerm ? 'Giá theo đêm' : 'Giá thuê tháng'}
              </Text>
              <Text style={{ color: isShortTerm ? '#0071e3' : '#1d1d1f', fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>
                {isShortTerm
                  ? `${new Intl.NumberFormat('vi-VN').format(dailyPrice).replace("₫", "")}K`
                  : formatCurrency(room.price)
                }
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#86868b' }}>
                  {isShortTerm ? '/đêm' : '/tháng'}
                </span>
              </Text>
            </div>

            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: isHovered ? (isShortTerm ? '#0071e3' : '#1d1d1f') : '#f5f5f7',
              color: isHovered ? '#fff' : (isShortTerm ? '#0071e3' : '#1d1d1f'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}>
              <RightOutlined style={{ fontSize: '12px' }} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};


const LOCATIONS = [
  { name: 'Tất cả', icon: <AppstoreOutlined />, key: 'all' },
  { name: 'Âu Cơ', icon: <CompassOutlined />, key: 'Âu Cơ' },
  { name: 'Trích Sài', icon: <GlobalOutlined />, key: 'Trích Sài' },
  { name: 'An Dương Vương', icon: <BankOutlined />, key: 'An Dương Vương' },
  { name: 'Tứ Liên', icon: <ShopOutlined />, key: 'Tứ Liên' },
  { name: 'Long Biên', icon: <BuildOutlined />, key: 'Long Biên' },
  { name: 'Hà Đông', icon: <HomeOutlined />, key: 'Hà Đông' },
];

const RENTAL_TYPES = [
  { name: 'Tất cả', key: 'all', icon: <AppstoreOutlined /> },
  { name: 'Dài hạn', key: 'long', icon: <HomeOutlined /> },
  { name: 'Ngắn hạn', key: 'short', icon: <GlobalOutlined /> },
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
];

const formatVND = (val) => `${val / 1000000} triệu`;


const RoomsPage = () => {
  const navigate = useNavigate();
  const [allRooms, setAllRooms] = useState([]);
  const [dataRooms, setDataRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeLocation, setActiveLocation] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [priceRange, setPriceRange] = useState([1000000, 20000000]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

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
    try {
      const response = await getAllRooms();
      const vacantRooms = response.filter(room => room.status === "TRONG");
      const sorted = vacantRooms.sort((a, b) => {
        const now = new Date();
        const isANew = (now - new Date(a.lastModifiedDate || 0)) / (1000 * 60 * 60 * 24) <= 3;
        const isBNew = (now - new Date(b.lastModifiedDate || 0)) / (1000 * 60 * 60 * 24) <= 3;
        if (isANew && !isBNew) return -1;
        if (!isANew && isBNew) return 1;
        return new Date(b.lastModifiedDate || 0) - new Date(a.lastModifiedDate || 0);
      });
      const mapped = sorted.map((room, idx) => ({
        ...room,
        displayImage: FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]
      }));
      setAllRooms(mapped);
      setDataRooms(mapped);
    } catch (err) {
      console.error("Failed to load rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByAddress = async (address) => {
    setLoading(true);
    try {
      const response = await searchRoomsByAddress(address);
      const sorted = response.sort((a, b) => new Date(b.lastModifiedDate || 0) - new Date(a.lastModifiedDate || 0));
      const mapped = sorted.map((room, idx) => ({
        ...room,
        displayImage: FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]
      }));
      setAllRooms(mapped);
      setDataRooms(mapped);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter by price range and rental type whenever dependencies change
  useEffect(() => {
    let filtered = allRooms.filter(
      room => room.price >= priceRange[0] && room.price <= priceRange[1]
    );

    if (activeType === 'short') {
      // For demonstration: any room with 'Studio' or just a subset
      filtered = filtered.filter((_, idx) => idx % 2 === 0 || idx < 3);
    } else if (activeType === 'long') {
      filtered = filtered.filter((_, idx) => idx % 2 !== 0 && idx >= 3);
    }

    setDataRooms(filtered);
  }, [priceRange, allRooms, activeType]);

  const handleLocationClick = (loc) => {
    setActiveLocation(loc.key);
    if (loc.key === 'all') {
      fetchRooms();
    } else {
      fetchByAddress(loc.name);
    }
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh', paddingBottom: '100px' }}>

      {/* ── HERO BANNER (Clean, no search) ── */}
      <div style={{
        position: 'relative', height: isMobile ? '220px' : isTablet ? '270px' : '320px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 100%)',
      }}>
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,113,227,0.15) 0%, transparent 70%)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,113,227,0.1) 0%, transparent 70%)'
        }} />

        <div style={{
          maxWidth: '1200px', margin: '0 auto', height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: isMobile ? '0 16px' : '0 24px', position: 'relative', zIndex: 1
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Text style={{
              color: '#0071e3', fontSize: '13px', fontWeight: 600,
              letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '12px'
            }}>
              DANH SÁCH PHÒNG TRỌ
            </Text>
            <Title level={1} style={{
              color: '#ffffff', fontSize: isMobile ? '28px' : isTablet ? '36px' : '44px', fontWeight: 700,
              margin: 0, lineHeight: 1.15, letterSpacing: '-1px'
            }}>
              Tìm không gian sống <span style={{ color: '#0071e3' }}>phù hợp.</span>
            </Title>
            <Text style={{
              color: 'rgba(255,255,255,0.5)', fontSize: '16px',
              display: 'block', marginTop: '16px', maxWidth: '480px', lineHeight: 1.6
            }}>
              Phòng trọ chất lượng tại các khu vực trung tâm Hà Nội. Giá cả minh bạch, tiện ích đầy đủ.
            </Text>
          </motion.div>
        </div>
      </div>

      {/* ── FILTERS SECTION (Below banner) ── */}
      <div style={{ maxWidth: '1200px', margin: '32px auto 0', padding: isMobile ? '0 12px' : '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card style={{
            borderRadius: '16px', border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }} bodyStyle={{ padding: isMobile ? '16px 12px' : '20px 24px' }}>

            {/* Location tabs */}
            <Row gutter={isMobile ? [12, 16] : [24, 24]}>
              <Col xs={24} lg={14}>
                <Text strong style={{ fontSize: '13px', color: '#86868b', display: 'block', marginBottom: '12px' }}>
                  <EnvironmentOutlined /> KHU VỰC
                </Text>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {LOCATIONS.map((loc) => {
                    const isActive = activeLocation === loc.key;
                    return (
                      <Button
                        key={loc.key}
                        type={isActive ? 'primary' : 'default'}
                        onClick={() => handleLocationClick(loc)}
                        style={{
                          height: '38px', borderRadius: '12px',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '0 16px', fontWeight: isActive ? 600 : 400,
                          fontSize: '13px',
                          background: isActive ? '#1d1d1f' : '#f5f5f7',
                          color: isActive ? '#fff' : '#515154',
                          border: isActive ? 'none' : '1px solid #e8e8e8',
                        }}
                        icon={loc.icon}
                      >
                        {loc.name}
                      </Button>
                    );
                  })}
                </div>
              </Col>

              <Col xs={24} lg={10}>
                <Text strong style={{ fontSize: '13px', color: '#86868b', display: 'block', marginBottom: '12px' }}>
                  <TagOutlined /> LOẠI HÌNH THUÊ
                </Text>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {RENTAL_TYPES.map((type) => {
                    const isActive = activeType === type.key;
                    return (
                      <Button
                        key={type.key}
                        type={isActive ? 'primary' : 'default'}
                        onClick={() => setActiveType(type.key)}
                        style={{
                          height: '38px', borderRadius: '12px',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '0 16px', fontWeight: isActive ? 600 : 400,
                          fontSize: '13px',
                          background: isActive ? '#0071e3' : '#f5f5f7',
                          color: isActive ? '#fff' : '#515154',
                          border: isActive ? 'none' : '1px solid #e8e8e8',
                        }}
                        icon={type.icon}
                      >
                        {type.name}
                      </Button>
                    );
                  })}
                </div>
              </Col>
            </Row>

            {/* Price range slider */}
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text strong style={{ fontSize: '13px', color: '#86868b' }}>
                  <FilterOutlined /> KHOẢNG GIÁ
                </Text>
                <Text style={{ fontSize: '14px', fontWeight: 600, color: '#0071e3' }}>
                  {formatVND(priceRange[0])} — {formatVND(priceRange[1])}
                </Text>
              </div>
              <Slider
                range
                min={1000000}
                max={20000000}
                step={500000}
                value={priceRange}
                onChange={handlePriceChange}
                tooltip={{ formatter: (val) => formatVND(val) }}
                trackStyle={[{ backgroundColor: '#1d1d1f' }]}
                handleStyle={[
                  { borderColor: '#1d1d1f', backgroundColor: '#fff' },
                  { borderColor: '#1d1d1f', backgroundColor: '#fff' }
                ]}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: '12px', color: '#86868b' }}>1 triệu</Text>
                <Text style={{ fontSize: '12px', color: '#86868b' }}>20 triệu</Text>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '24px auto 0', padding: isMobile ? '0 12px' : '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '24px' }}>
          <div>
            <Title level={3} style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#1d1d1f' }}>
              {activeLocation === 'all'
                ? 'Tất cả phòng trống'
                : `Khu vực ${LOCATIONS.find(l => l.key === activeLocation)?.name || ''}`
              }
            </Title>
            <Text style={{ color: '#86868b', fontSize: '13px' }}>
              {loading ? 'Đang tải...' : `${dataRooms.length} phòng được tìm thấy`}
            </Text>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#1d1d1f' }} spin />} />
          </div>
        ) : dataRooms.length > 0 ? (
          <Row gutter={isMobile ? [12, 20] : [24, 32]}>
            {dataRooms.map((room, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
                <RoomCard
                  room={room}
                  index={index}
                  activeType={activeType}
                  onClick={() => navigate(`/room/${room.slug}-${room.id}`)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            style={{
              textAlign: 'center', padding: '80px 0',
              background: '#fff', borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <Empty description={
              <Text style={{ color: '#86868b', fontSize: '16px' }}>
                Không tìm thấy phòng nào trong khoảng giá này
              </Text>
            } />
            <Button
              type="primary"
              onClick={() => { setPriceRange([1000000, 20000000]); handleLocationClick({ key: 'all', name: 'Tất cả' }); }}
              style={{
                marginTop: '20px', background: '#0071e3', border: 'none',
                borderRadius: '12px', fontWeight: 600, height: '44px', padding: '0 28px'
              }}
            >
              Xem tất cả phòng
            </Button>
          </motion.div>
        )}
      </div>



    </div>
  );
};

export default RoomsPage;
