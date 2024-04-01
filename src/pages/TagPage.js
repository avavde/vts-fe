// src/pages/TagManagementPage.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField } from '@mui/material';
import axios from 'axios';

const TagManagementPage = () => {
  const [tags, setTags] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editTag, setEditTag] = useState({ id: '', alias: '', title: '', description: '' });

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_API_URL}api/tags/tags`);
      setTags(response.data);
    } catch (error) {
      console.error('Ошибка при получении тегов:', error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleEdit = (tag) => {
    setEditTag(tag);
    setModalOpen(true);
  };

  const handleDelete = async (tagId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_LOCAL_API_URL}api/tags/tags/${tagId}`);
      fetchTags(); // Обновляем список тегов после удаления
    } catch (error) {
      console.error('Ошибка при удалении тега:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_LOCAL_API_URL}api/tags/tags/${editTag.id}`, editTag);
      setModalOpen(false);
      fetchTags(); // Обновляем список тегов после редактирования
    } catch (error) {
      console.error('Ошибка при обновлении тега:', error);
    }
  };

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
      <Typography variant="h4" gutterBottom>Управление тегами</Typography>
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
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.id}</TableCell>
                  <TableCell>{tag.alias}</TableCell>
                  <TableCell>{tag.title}</TableCell>
                  <TableCell>{tag.description}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(tag)}>Редактировать</Button>
                    <Button onClick={() => handleDelete(tag.id)}>Удалить</Button>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">Редактирование тега</Typography>
          <TextField
            fullWidth
            label="Псевдоним"
            margin="normal"
            value={editTag.alias}
            onChange={(e) => setEditTag({ ...editTag, alias: e.target.value })}
          />
          <TextField
            fullWidth
            label="Название"
            margin="normal"
            value={editTag.title}
            onChange={(e) => setEditTag({ ...editTag, title: e.target.value })}
          />
          <TextField
            fullWidth
            label="Описание"
            margin="normal"
            value={editTag.description}
            onChange={(e) => setEditTag({ ...editTag, description: e.target.value })}
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

export default TagManagementPage;
