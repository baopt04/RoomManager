import React, { useState, memo } from 'react';
import { Typography, Card, Space, Button } from 'antd';
import { motion } from 'framer-motion';
import { EnvironmentOutlined, ColumnWidthOutlined, TeamOutlined, RightOutlined, TagOutlined, StarFilled, WifiOutlined, CoffeeOutlined, SafetyOutlined } from '@ant-design/icons';
import { useLanguage } from '../../../../contexts/LanguageContext';

const { Title, Text } = Typography;

// Helper for currency
const formatCurrency = (amount) => {
  if (!amount) return "Liên hệ";
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount).replace("₫", "VNĐ");
};

// RoomCard optimized with memo
export const RoomCard = memo(({ room, onClick }) => {
  const { t, tName } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const isNew = (dateString) => {
    if (!dateString) return false;
    const diffDays = (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24);
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
      className="apple-card"
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
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          alt={room.name}
          src={room.images && room.images.length > 0 ? room.images[0] : room.displayImage}
          loading="lazy"
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
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        {!isRoomNew && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
            <div style={{ background: 'rgba(255, 59, 48, 0.95)', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
              {t('home.roomCard.goodPrice')}{currentMonth}
            </div>
          </div>
        )}
        {isRoomNew && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.98)', color: '#34c759', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TagOutlined style={{ fontSize: '12px' }} /> {t('home.roomCard.new')}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '20px' }}>
        <Text strong style={{ display: 'block', fontSize: '16px', color: '#1d1d1f', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <EnvironmentOutlined style={{ color: '#0071e3', marginRight: 6 }} />
          {tName(room.name) || "Địa chỉ không xác định"}
        </Text>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span className="info-tag"><ColumnWidthOutlined /> {room.acreage} m²</span>
          <span className="info-tag"><TeamOutlined /> {room.peopleMax} {t('home.roomCard.people')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f5f5f7' }}>
          <div>
            <Text style={{ color: '#86868b', fontSize: '12px', display: 'block' }}>{t('home.roomCard.price')}</Text>
            <Text strong style={{ color: 'black', fontSize: '18px' }}>
              {formatCurrency(room.price)}<span style={{ fontSize: '13px', fontWeight: 500, color: '#8a8b86' }}>{t('home.roomCard.month')}</span>
            </Text>
          </div>
          <div className="action-circle">
            <RightOutlined style={{ fontSize: '14px' }} />
          </div>
        </div>
      </div>
    </Card>
  );
});

// ShortTermCard optimized
export const ShortTermCard = memo(({ room, onClick }) => {
  const { t, tName } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }} onClick={onClick} style={{ cursor: 'pointer' }}>
      <Card
        hoverable
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          borderRadius: '24px', overflow: 'hidden', border: 'none', background: '#ffffff',
          boxShadow: isHovered ? '0 25px 50px rgba(0,0,0,0.12)' : '0 10px 30px rgba(0,0,0,0.04)',
          transition: 'all 0.4s ease', width: '320px', marginRight: '24px', flexShrink: 0
        }}
        bodyStyle={{ padding: '20px' }}
      >
        <div style={{ position: 'relative', height: '240px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
          <img
            alt={room.name}
            src={room.images && room.images.length > 0 ? room.images[0] : room.displayImage}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
          />
          <div className="overlay-tag" style={{ top: '12px', left: '12px', background: 'rgba(255,255,255,0.98)', color: '#1d1d1f' }}>SHORT-STAY</div>
          <div className="overlay-tag" style={{ bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
            <StarFilled style={{ color: '#ffb800', marginRight: 4 }} /> 4.9
          </div>
        </div>
        <Title level={5} style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px', color: '#1d1d1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {tName(room.name)}
        </Title>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', color: '#86868b', fontSize: '14px', flexWrap: 'wrap' }}>
          <span><WifiOutlined /> Wifi</span>
          <span><CoffeeOutlined /> Tea</span>
          <span><SafetyOutlined /> Safe</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f5f7', paddingTop: '16px' }}>
          <Text strong style={{ fontSize: '18px', color: '#0071e3' }}>
            {new Intl.NumberFormat('vi-VN').format(Math.round(room.price / 30 / 1000) * 1000 + 150000).replace("₫", "")}
            <span style={{ fontSize: '13px', color: '#86868b', fontWeight: 400 }}> {t('home.shortTerm.night')}</span>
          </Text>
          <div className="action-circle small" style={{ background: '#0071e3', color: '#fff' }}>
            <RightOutlined style={{ fontSize: '12px' }} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

