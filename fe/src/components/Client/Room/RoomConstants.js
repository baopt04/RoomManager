import React from 'react';
import { AppstoreOutlined, CompassOutlined, GlobalOutlined, BankOutlined, ShopOutlined, BuildOutlined, HomeOutlined } from '@ant-design/icons';

export const LOCATIONS = [
  { name: 'Tất cả', icon: <AppstoreOutlined />, key: 'all' },
  { name: 'Âu Cơ', icon: <CompassOutlined />, key: 'Âu Cơ' },
  { name: 'Trích Sài', icon: <GlobalOutlined />, key: 'Trích Sài' },
  { name: 'An Dương Vương', icon: <BankOutlined />, key: 'An Dương Vương' },
  { name: 'Tứ Liên', icon: <ShopOutlined />, key: 'Tứ Liên' },
  { name: 'Long Biên', icon: <BuildOutlined />, key: 'Long Biên' },
  { name: 'Hà Đông', icon: <HomeOutlined />, key: 'Hà Đông' },
];

export const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
];

