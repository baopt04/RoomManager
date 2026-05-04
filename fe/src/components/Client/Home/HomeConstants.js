import React from 'react';
import { CompassOutlined, GlobalOutlined, BankOutlined, ShopOutlined, BuildOutlined, EnvironmentOutlined } from '@ant-design/icons';
import logobanner from '../../../assets/logo_banner.png';
import logobanner2 from '../../../assets/logo_banner_2.png';

export const PRIMARY_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200"
];

export const HOVER_IMAGES = [
  "https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200"
];

export const HOME_HERO_BANNERS = [
  {
    id: 1,
    titleKey: "home.hero.title1",
    descKey: "home.hero.desc1",
    image: logobanner2,
  },
  {
    id: 2,
    titleKey: "home.hero.title2",
    descKey: "home.hero.desc2",
    image: logobanner,
  },
];

export const HOME_LOCATIONS = [
  { name: 'Au Co', icon: <CompassOutlined /> },
  { name: 'Trich Sai', icon: <GlobalOutlined /> },
  { name: 'An Duong Vuong', icon: <BankOutlined /> },
  { name: 'Tu Lien', icon: <ShopOutlined /> },
  { name: 'Long Bien', icon: <BuildOutlined /> },
  { name: 'Ha Dong', icon: <EnvironmentOutlined /> }
];

export const HOME_STATS = [
  { value: '200+', labelKey: 'home.stats.rooms', color: '#0071e3' },
  { value: '1,500+', labelKey: 'home.stats.customers', color: '#34c759' },
  { value: '7', labelKey: 'home.stats.areas', color: '#ff9500' },
  { value: '10+', labelKey: 'home.stats.exp', color: '#af52de' },
];
