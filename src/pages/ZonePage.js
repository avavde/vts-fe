// src/pages/ZoneManagementPage.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField } from '@mui/material';
import axios from 'axios';

const ZoneManagementPage = () => {
  const [zones, setZones] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editZone, setEditZone] = useState({ id: '', name: '', type: '', radius: '', feed_reference: '' });

  const fetchZones = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_API_URL}api/zones`);
      setZones(response.data);
    } catch (error) {
      console.error('Ошибка при получении списка зон:', error);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleEdit = (zone) => {
    setEditZone(zone);
    setModalOpen(true);
  };

  const handleDelete = async (zoneId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_LOCAL_API_URL}api/zones/${zoneId}`);
      fetchZones(); // Обновляем список зон после удаления
    } catch (error) {
      console.error('Ошибка при удалении зоны:', error);
    }
  };

  const handleSave = async () => {
    try {
      // URL и метод API для обновления зоны могут отличаться в зависимости от вашей реализации
      await axios.put(`${process.env.REACT_APP_LOCAL_API_URL}api/zones/${editZone.id}`, editZone);
      setModalOpen(false);
      fetchZones(); // Обновляем список зон после редактирования
    } catch (error) {
      console.error('Ошибка при обновлении зоны:', error);
    }
  };

  // Стили модального окна
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>Управление зонами</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Список зон</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Радиус</TableCell>
                <TableCell>Ссылка на объект</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell>{zone.id}</TableCell>
                  <TableCell>{zone.name}</TableCell>
                  <TableCell>{zone.type}</TableCell>
                  <TableCell>{zone.radius}</TableCell>
                  <TableCell>{zone.feed_reference}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(zone)}>Редактировать</Button>
                    <Button onClick={() => handleDelete(zone.id)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <Modal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">Редактирование зоны</Typography>
          <TextField
            fullWidth
            label="Название"
            margin="normal"
            value={editZone.name}
            onChange={(e) => setEditZone({ ...editZone, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Тип"
            margin="normal"
            value={editZone.type}
            onChange={(e) => setEditZone({ ...editZone, type: e.target.value })}
          />
          <TextField
            fullWidth
            label="Радиус"
            margin="normal"
            value={editZone.radius}
            onChange={(e) => setEditZone({ ...editZone, radius: e.target.value })}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)} sx={{ mr: 1 }}>Отменить</Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ZoneManagementPage;
