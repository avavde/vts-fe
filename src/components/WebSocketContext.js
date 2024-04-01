// src/components/WebSocketContext.js
import React, { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_LOCAL_WS_URL); 
    
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);

      setData(currentData => [...currentData.slice(-100), message]); // Храним только последние 100 сообщений
    };

    ws.onopen = () => {
      console.log('Подключены к WebSocket');
    };
  
    ws.onclose = () => {
      console.log('Отключены от WebSocket');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ data }}>
      {children}
    </WebSocketContext.Provider>
  );
};
