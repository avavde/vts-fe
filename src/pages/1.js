const WebSocket = require('ws');
require('dotenv').config();

class WebSocketService {
    constructor(wss) {
      this.wss = wss; // Теперь wss доступен во всем классе
      this.url = process.env.SEWIO_WS_URL;
      this.apiKey = process.env.SEWIO_API_KEY;
      this.subscriptions = [];
      this.ws = null;
      this.messagesQueue = [];
      this.init();
    }
  
  

  init() {

    this.ws = new WebSocket(this.url, {
      headers: { 'X-ApiKey': this.apiKey }
    });

    this.ws.on('open', () => {
      console.log('Подключен к SEWIO WebSocket');
      this.subscribeToTags();
    });

    this.ws.on('message', (data) => {
      const message = JSON.parse(data);
      this.messagesQueue.push(message);
      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    });

    this.ws.on('close', () => {
      console.log('Отключен от SEWIO WebSocket');
    });

    this.ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });

    setInterval(() => {
      while (this.messagesQueue.length > 0) {
        const message = this.messagesQueue.shift();
        this.processMessage(message);
      }
    }, 100); // Обработка сообщений каждую секунду
  }

  processMessage(message) {
    console.log("Получено сообщение:", message);
    const { resource, body } = message;

    // Форвардинг сообщений клиентам фронтенда


    // Добавленная логика для обработки сообщений
    if (resource.startsWith('/feeds/') && body.datastreams) {
 //     console.log(`Изменение данных для метки ${body.id}:`);
      body.datastreams.forEach((ds, index) => {
   //     console.log(` Datastream ${index + 1}:`, ds);
      });
    } else if (resource.startsWith('/feeds/lifecycle')) {
      const action = message.method === 'new_feed' ? 'создана' : 'удалена';
   //   console.log(`Метка или анкер ${action}: ${body.id}`);
    } else if (resource.startsWith('/zones/') || resource.startsWith('/tagzones/data') && body.zones) {
      body.zones.forEach(zone => {
        if (['info', 'warning', 'danger'].includes(zone.type)) {
          console.log(`Метка с ID ${body.uuid} вошла в зону типа '${zone.type}' с названием '${zone.name}'`);
              
    
      } else if (body.status) {
        const action = body.status === 'in' ? 'вошла' : 'вышла';
        console.log(`Метка ${body.feed_id} ${action} из зоны ${body.zone_id}`);
      }
    }
  }

  subscribeToTags() {
    const subscribeMessage = {
      headers: { "X-ApiKey": this.apiKey },
      method: "subscribe",
      resource: "/feeds/" // Пример подписки на все обновления меток
    };
    this.ws.send(JSON.stringify(subscribeMessage));
    console.log('Подписаны на обновления меток');
  }

  unsubscribe(resource) {
    const unsubscribeMessage = {
      headers: { "X-ApiKey": this.apiKey },
      method: "unsubscribe",
      resource: resource
    };
    this.ws.send(JSON.stringify(unsubscribeMessage));
    console.log(`Отписаны от ${resource}`);
  }
}

module.exports = WebSocketService;
