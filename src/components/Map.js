// src/components/Map.js
import React from 'react';
import { Box } from '@mui/material';

const Map = () => {
  return (
    <Box
      sx={{
        height: 400, // Высота карты
        width: '100%', // Ширина карты
        backgroundColor: 'grey.300', // Цвет фона для визуального отличия
      }}
    >
      {/* В будущем здесь будет реализована карта */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        Карта в процессе разработки
      </Box>
    </Box>
  );
};

export default Map;
