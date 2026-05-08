import React, { useState, memo } from 'react';
import { Typography } from 'antd';
import { motion } from 'framer-motion';
import { EnvironmentOutlined, ColumnWidthOutlined, HeartOutlined, HeartFilled, ClockCircleOutlined } from '@ant-design/icons';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useClientBreakpoints } from '../../hooks/useClientBreakpoints';

const { Text } = Typography;

const formatCurrency = (amount) => {
  if (!amount) return "Liên hệ";
  const million = amount / 1000000;
  return `${million % 1 === 0 ? million : million.toFixed(1)} triệu/tháng`;
};

export const ListingRoomCard = memo(({ room, onClick, index }) => {
  const { tName } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const { isPhone } = useClientBreakpoints();

  const isNew = (dateString) => {
    if (!dateString) return false;
    return (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24) <= 3;
  };
  const isRoomNew = isNew(room.lastModifiedDate);
  const imgSrc = room.images && room.images.length > 0 ? room.images[0] : room.displayImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        style={{
          display: 'flex',
          flexDirection: isPhone ? 'column' : 'row',
          background: '#fff',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #f0f0f0',
          boxShadow: isHovered ? '0 8px 30px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.03)',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-2px)' : 'none',
          cursor: 'pointer',
          marginBottom: '16px',
        }}
      >
        {/* Image Section */}
        <div style={{
          position: 'relative',
          width: isPhone ? '100%' : '280px',
          height: isPhone ? '200px' : 'auto',
          minHeight: isPhone ? '200px' : '200px',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          <img
            alt={room.name}
            src={imgSrc}
            loading="lazy"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          {isRoomNew && (
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: '#27ae60', color: '#fff',
              padding: '4px 12px', borderRadius: '8px',
              fontSize: '11px', fontWeight: 700,
            }}>
              MỚI ĐĂNG
            </div>
          )}
          {/* Heart icon on mobile - overlay on image */}
          {isPhone && (
            <div
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              style={{
                position: 'absolute', top: '12px', right: '12px',
                width: '36px', height: '36px', background: '#fff', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                cursor: 'pointer', fontSize: '18px', color: liked ? '#e74c3c' : '#bdc3c7'
              }}
            >
              {liked ? <HeartFilled /> : <HeartOutlined />}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div style={{
          flex: 1,
          padding: isPhone ? '14px 16px' : '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Heart icon on desktop */}
          {!isPhone && (
            <div
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer', fontSize: '20px', color: liked ? '#e74c3c' : '#bdc3c7', transition: 'color 0.2s' }}
            >
              {liked ? <HeartFilled /> : <HeartOutlined />}
            </div>
          )}

          <Text strong style={{
            fontSize: isPhone ? '15px' : '17px',
            color: '#1a1a1a',
            marginBottom: '6px',
            display: 'block',
            paddingRight: isPhone ? '0' : '40px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: isPhone ? 'nowrap' : 'normal'
          }}>
            {tName(room.name) || 'Phòng trọ nội thất, cửa sổ lớn'}
          </Text>

          <Text style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: isPhone ? '8px' : '10px' }}>
            <EnvironmentOutlined style={{ color: '#27ae60' }} />
            {room.houseName || 'Gò Vấp, TP.HCM'}
          </Text>

          <Text strong style={{ fontSize: isPhone ? '16px' : '18px', color: '#27ae60', display: 'block', marginBottom: isPhone ? '10px' : '14px' }}>
            {formatCurrency(room.price)}
          </Text>

          <div style={{ display: 'flex', gap: isPhone ? '12px' : '20px', color: '#666', fontSize: '13px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ColumnWidthOutlined /> {room.acreage || 25}m²
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              🛋️ Full nội thất
            </span>
            {!isPhone && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ClockCircleOutlined /> Giờ tự do
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
