// src/pages/DataStreamManagementPage.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';

const DataStreamManagementPage = () => {
  const [dataStreams, setDataStreams] = useState([]);

  const fetchDataStreams = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_API_URL}api/feeds/datastreams`);
      setDataStreams(response.data);
    } catch (error) {
      console.error('Ошибка при получении потоков данных:', error);
    }
  };

  useEffect(() => {
    fetchDataStreams();
  }, []);

  const handleDelete = async (dataStreamId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_LOCAL_API_URL}api/feeds/datastreams/${dataStreamId}`);
      fetchDataStreams(); // Обновляем список потоков данных после удаления
    } catch (error) {
      console.error('Ошибка при удалении потока данных:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>Управление потоками данных</Typography>
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
              {dataStreams.map((dataStream) => (
                <TableRow key={dataStream.id}>
                  <TableCell>{dataStream.id}</TableCell>
                  <TableCell>{dataStream.alias}</TableCell>
                  <TableCell>{dataStream.title}</TableCell>
                  <TableCell>{dataStream.description}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(dataStream.id)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataStreamManagementPage;
