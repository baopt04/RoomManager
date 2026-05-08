import React, { useState, memo } from 'react';
import { Typography, Card } from 'antd';
import { motion } from 'framer-motion';
import {
  EnvironmentOutlined,
  ColumnWidthOutlined,
  WifiOutlined,
  SafetyOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useLanguage } from '../../../../contexts/LanguageContext';

const { Title, Text } = Typography;

const formatCurrency = (amount) => {
  if (!amount) return "Liên hệ";
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount).replace("₫", "VNĐ");
};

export const RoomCard = memo(({ room, onClick }) => {
  const { tName } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
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
          boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.03)',
          transition: 'all 0.3s ease',
        }}
        bodyStyle={{ padding: '15px' }}
      >
        <div style={{ position: 'relative', height: '200px', borderRadius: '18px', overflow: 'hidden', marginBottom: '15px' }}>
          <img
            alt={room.name}
            src={room.images && room.images.length > 0 ? room.images[0] : room.displayImage}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          />
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: '#27ae60',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 700
          }}>
            MỚI NHẤT
          </div>
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(4px)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <HeartOutlined style={{ color: '#e74c3c' }} />
          </div>
        </div>

        <div>
          <Title level={5} style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tName(room.name) || "Phòng trọ nội thất, cửa sổ lớn"}
          </Title>
          <Text style={{ color: '#95a5a6', fontSize: '13px', display: 'block', marginBottom: '10px' }}>
            <EnvironmentOutlined style={{ marginRight: '4px' }} />
            Gò Vấp, TP.HCM
          </Text>

          <Title level={4} style={{ color: '#45C97C', margin: '0 0 15px', fontSize: '18px', fontWeight: 800 }}>
            <span style={{ color: '#45C97C' }}>
              {formatCurrency(room.price)}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#45C97C' }}> /tháng</span>
          </Title>

          <div style={{ display: 'flex', gap: '15px', color: '#7f8c8d', fontSize: '12px' }}>
            <span><ColumnWidthOutlined /> {room.acreage} m²</span>
            <span><SafetyOutlined /> Nội thất</span>
            <span><WifiOutlined /> Giờ tự do</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
