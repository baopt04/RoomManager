import React, { useState, memo } from 'react';
import { Typography, Card } from 'antd';
import { motion } from 'framer-motion';
import { RightOutlined, TagOutlined, StarFilled, WifiOutlined } from '@ant-design/icons';
import { useLanguage } from '../../../../contexts/LanguageContext';

const { Text } = Typography;

const formatCurrency = (amount) => {
  if (!amount) return "Liên hệ";
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency', currency: 'VND', maximumFractionDigits: 0
  }).format(amount).replace("₫", "VNĐ");
};

export const ListingRoomCard = memo(({ room, onClick, index, activeType }) => {
  const { t, tName } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const isShortTerm = activeType === 'short' || (activeType === 'all' && index % 3 === 0);

  const isNew = (dateString) => {
    if (!dateString) return false;
    return (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24) <= 3;
  };

  const isRoomNew = isNew(room.lastModifiedDate);
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
        className="apple-card"
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          border: isShortTerm ? '2px solid rgba(0,113,227,0.1)' : '1px solid rgba(0,0,0,0.04)',
          background: '#ffffff',
          boxShadow: isHovered ? '0 25px 50px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.03)',
          transform: isHovered ? 'translateY(-8px)' : 'none',
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
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          />
          <div className="overlay-tag" style={{ top: '12px', left: '12px', background: isShortTerm ? '#0071e3' : 'rgba(29,29,31,0.9)', color: '#fff' }}>
            {isShortTerm ? t('roomsPage.card.homestay') : t('roomsPage.card.room')}
          </div>
          {isRoomNew && (
            <div className="overlay-tag" style={{ top: '12px', right: '12px', background: 'rgba(255,255,255,0.98)', color: '#34c759', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TagOutlined style={{ fontSize: '12px' }} /> {t('roomsPage.card.new')}
            </div>
          )}
          {isShortTerm && (
            <div className="overlay-tag" style={{ bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.75)', color: '#fff' }}>
              <StarFilled style={{ color: '#ffb800', marginRight: 4 }} /> 4.9
            </div>
          )}
        </div>

        <div style={{ padding: '20px' }}>
          <Text strong style={{ display: 'block', fontSize: '16px', color: '#1d1d1f', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tName(room.name) || t('roomsPage.card.unknownAddress')}
          </Text>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', minHeight: '22px' }}>
            {isShortTerm ? (
              <>
                <span style={{ fontSize: '12px', color: '#86868b' }}><WifiOutlined /> Wifi</span>
                <span style={{ fontSize: '12px', color: '#86868b' }}><StarFilled style={{ color: '#ffb800' }} /> Best Stay</span>
              </>
            ) : (
              <>
                <span className="info-tag" style={{ padding: '2px 8px', fontSize: '11px' }}>{room.acreage} m²</span>
                <span className="info-tag" style={{ padding: '2px 8px', fontSize: '11px' }}>{t('roomsPage.card.peopleMax')} {room.peopleMax}</span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f5f5f7' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ color: '#86868b', fontSize: '11px' }}>{isShortTerm ? t('roomsPage.card.pricePerNight') : t('roomsPage.card.pricePerMonth')}</Text>
              <Text strong style={{ color: isShortTerm ? '#0071e3' : '#1d1d1f', fontSize: '18px', lineHeight: 1 }}>
                {isShortTerm ? `${new Intl.NumberFormat('vi-VN').format(dailyPrice).replace("₫", "")}K` : formatCurrency(room.price)}
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#86868b' }}> {isShortTerm ? t('roomsPage.card.night') : t('roomsPage.card.month')}</span>
              </Text>
            </div>
            <div className="action-circle small" style={{ background: isHovered ? (isShortTerm ? '#0071e3' : '#1d1d1f') : '#f5f5f7', color: isHovered ? '#fff' : (isShortTerm ? '#0071e3' : '#1d1d1f') }}>
              <RightOutlined style={{ fontSize: '12px' }} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
