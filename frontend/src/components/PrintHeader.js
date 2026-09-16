import React from 'react';

export const PrintHeader = () => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    {/* Logo */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src="/royal-bikes-logo.png.jpeg"
        alt="Royal Bikes"
        style={{ height: '72px', width: 'auto', objectFit: 'contain' }}
      />
    </div>

    {/* Company Info */}
    <div style={{ textAlign: 'left', marginLeft: '1.5rem', flex: 1 }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.2rem 0', textTransform: 'uppercase', fontFamily: "'Times New Roman', serif" }}>
        ROYAL BIKES
      </h2>
      <div style={{ fontSize: '0.82rem', color: '#000000', lineHeight: 1.35, fontFamily: "'Times New Roman', serif" }}>
        104/1, ERUKKANCHERY HIGH ROAD, SHARMA NAGAR, VYASARPADI<br />
        CHENNAI-600039 (ANNAI DIGITAL OPPOSITE)<br />
        E-mail : royalbikes2020@gmail.com
      </div>
    </div>
  </div>
);
