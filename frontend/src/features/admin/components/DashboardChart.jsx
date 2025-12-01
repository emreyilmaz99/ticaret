import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const data = [
  { name: 'Oca', satis: 4000, ziyaret: 2400 },
  { name: 'Şub', satis: 3000, ziyaret: 1398 },
  { name: 'Mar', satis: 2000, ziyaret: 9800 },
  { name: 'Nis', satis: 2780, ziyaret: 3908 },
  { name: 'May', satis: 1890, ziyaret: 4800 },
  { name: 'Haz', satis: 2390, ziyaret: 3800 },
  { name: 'Tem', satis: 3490, ziyaret: 4300 },
  { name: 'Ağu', satis: 4200, ziyaret: 5100 },
  { name: 'Eyl', satis: 5100, ziyaret: 6200 },
  { name: 'Eki', satis: 4800, ziyaret: 5800 },
  { name: 'Kas', satis: 6200, ziyaret: 7100 },
  { name: 'Ara', satis: 7400, ziyaret: 8500 },
];

export const DashboardChart = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
      
      {/* Sol: Satış Grafiği */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '24px', 
        borderRadius: 'var(--radius)', 
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid #e2e8f0',
        height: '400px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '24px' }}>Yıllık Satış Analizi</h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSatis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `₺${value}`} />
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                itemStyle={{ color: '#cbd5e1' }}
              />
              <Area type="monotone" dataKey="satis" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSatis)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sağ: Ziyaretçi Grafiği */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '24px', 
        borderRadius: 'var(--radius)', 
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid #e2e8f0',
        height: '400px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '24px' }}>Ziyaretçi İstatistiği</h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
              />
              <Bar dataKey="ziyaret" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
