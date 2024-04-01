// src/pages/BuildingManagementPage.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField } from '@mui/material';
import axios from 'axios';

const BuildingManagementPage = () => {
  const [buildings, setBuildings] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editBuilding, setEditBuilding] = useState({ id: '', alias: '', title: '', description: '' });

  const fetchBuildings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_API_URL}api/buildings`);
      setBuildings(response.data);
    } catch (error) {
      console.error('Ошибка при получении списка зданий:', error);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleEdit = (building) => {
    setEditBuilding(building);
    setModalOpen(true);
  };

  const handleDelete = async (buildingId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_LOCAL_API_URL}api/buildings/${buildingId}`);
      fetchBuildings(); // Обновляем список зданий после удаления
    } catch (error) {
      console.error('Ошибка при удалении здания:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_LOCAL_API_URL}api/buildings/${editBuilding.id}`, editBuilding);
      setModalOpen(false);
      fetchBuildings(); // Обновляем список зданий после редактирования
    } catch (error) {
      console.error('Ошибка при обновлении здания:', error);
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
      <Typography variant="h4" gutterBottom>Управление зданиями</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Псевдоним</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buildings.map((building) => (
                <TableRow key={building.id}>
                  <TableCell>{building.id}</TableCell>
                  <TableCell>{building.alias}</TableCell>
                  <TableCell>{building.title}</TableCell>
                  <TableCell>{building.description}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(building)}>Редактировать</Button>
                    <Button onClick={() => handleDelete(building.id)}>Удалить</Button>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">Редактирование здания</Typography>
          <TextField
            fullWidth
            label="Псевдоним"
            margin="normal"
            value={editBuilding.alias}
            onChange={(e) => setEditBuilding({ ...editBuilding, alias: e.target.value })}
          />
          <TextField
            fullWidth
            label="Название"
            margin="normal"
            value={editBuilding.title}
            onChange={(e) => setEditBuilding({ ...editBuilding, title: e.target.value })}
          />
          <TextField
            fullWidth
            label="Описание"
            margin="normal"
            value={editBuilding.description}
            onChange={(e) => setEditBuilding({ ...editBuilding, description: e.target.value })}
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

export default BuildingManagementPage;
