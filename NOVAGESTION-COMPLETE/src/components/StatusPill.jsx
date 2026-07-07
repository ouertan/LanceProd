import React from 'react';
import { Fonts } from '../constants/fonts';
import { STATUS_STYLES } from '../constants/statusStyles';

const StatusPill = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.attente;
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      fontFamily: Fonts.body,
      fontWeight: 600,
      fontSize: 11,
      padding: '4px 12px',
      borderRadius: 20,
      whiteSpace: 'nowrap'
    }}>
      {s.label}
    </span>
  );
};

export default StatusPill;