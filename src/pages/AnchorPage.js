// src/pages/AnchorManagementPage.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField } from '@mui/material';
import axios from 'axios';

const AnchorManagementPage = () => {
  const [anchors, setAnchors] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editAnchor, setEditAnchor] = useState({ id: '', alias: '', title: '', description: '' });

  const fetchAnchors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_API_URL}api/tags/anchors`);
      setAnchors(response.data);
    } catch (error) {
      console.error('Ошибка при получении якорей:', error);
    }
  };

  useEffect(() => {
    fetchAnchors();
  }, []);

  const handleEdit = (anchor) => {
    setEditAnchor(anchor);
    setModalOpen(true);
  };

  const handleDelete = async (anchorId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_LOCAL_API_URL}api/anchors/anchors/${anchorId}`);
      fetchAnchors(); // Обновляем список якорей после удаления
    } catch (error) {
      console.error('Ошибка при удалении якоря:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_LOCAL_API_URL}api/anchors/anchors/${editAnchor.id}`, editAnchor);
      setModalOpen(false);
      fetchAnchors(); // Обновляем список якорей после редактирования
    } catch (error) {
      console.error('Ошибка при обновлении якоря:', error);
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
      <Typography variant="h4" gutterBottom>Управление якорями</Typography>
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
              {anchors.map((anchor) => (
                <TableRow key={anchor.id}>
                  <TableCell>{anchor.id}</TableCell>
                  <TableCell>{anchor.alias}</TableCell>
                  <TableCell>{anchor.title}</TableCell>
                  <TableCell>{anchor.description}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(anchor)}>Редактировать</Button>
                    <Button onClick={() => handleDelete(anchor.id)}>Удалить</Button>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">Редактирование якоря</Typography>
          <TextField
            fullWidth
            label="Псевдоним"
            margin="normal"
            value={editAnchor.alias}
            onChange={(e) => setEditAnchor({ ...editAnchor, alias: e.target.value })}
          />
          <TextField
            fullWidth
            label="Название"
            margin="normal"
            value={editAnchor.title}
            onChange={(e) => setEditAnchor({ ...editAnchor, title: e.target.value })}
          />
          <TextField
            fullWidth
            label="Описание"
            margin="normal"
            value={editAnchor.description}
            onChange={(e) => setEditAnchor({ ...editAnchor, description: e.target.value })}
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

export default AnchorManagementPage;
