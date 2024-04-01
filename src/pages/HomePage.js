import React, { useContext, useState, useEffect } from 'react';
import { Box, Grid, Typography, Snackbar, Button } from '@mui/material';
import { WebSocketContext } from '../components/WebSocketContext';
import CustomMap from '../components/CustomMap';

const HomePage = () => {
  const { data: messages } = useContext(WebSocketContext);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#FFEB3B'); // Цвет по умолчанию (желтый)

  // Функция для отображения Snackbar с сообщением
  const handleOpenSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setOpen(true);
  };

  useEffect(() => {
    const relevantMessages = messages.filter(msg =>
      msg.body?.zones?.some(zone => ['info', 'warning', 'danger'].includes(zone.type))
    );

    if (relevantMessages.length > 0) {
      const lastMessage = relevantMessages[relevantMessages.length - 1];
      const lastZone = lastMessage.body.zones.find(zone => ['info', 'warning', 'danger'].includes(zone.type));
      const alertColors = {
        info: '#FFEB3B', // желтый
        warning: '#FF9800', // оранжевый
        danger: '#F44336' // красный
      };
      const message = `Метка ${lastMessage.body.address} ${lastZone.type === 'info' ? 'вошла в информационную зону' : lastZone.type === 'warning' ? 'вошла в зону предупреждения' : 'вошла в опасную зону'}: ${lastZone.name}`;
      const color = alertColors[lastZone.type];
      handleOpenSnackbar(message, color);
    }
  }, [messages]);


  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>Главная страница</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Информация о подключении</Typography>
          <Typography>API сервер: {process.env.REACT_APP_LOCAL_API_URL}</Typography>
          <Typography>WebSocket сервер: {process.env.REACT_APP_LOCAL_WS_URL}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Последние сообщения</Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {messages.length > 0 ? (
                  messages.slice(-100).map((message, index) => (
                    <Typography key={index}>{JSON.stringify(message)}</Typography>
                  ))
                ) : (
                  <Typography>Сообщений нет.</Typography>
                )}
            </Box>

        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={() => setOpen(false)}>
            OK
          </Button>
        }
        sx={{ '& .MuiSnackbarContent-root': { backgroundColor: snackbarColor } }}
      />
    </Box>
  );
};

export default HomePage;
