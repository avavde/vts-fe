import React, { useContext } from 'react';
import { WebSocketContext } from './WebSocketContext'; // Предполагается, что контекст уже создан
import '../styles.css'; // Импорт стилей

const CustomMap = () => {
    const { data } = useContext(WebSocketContext);
    

    // Предполагается, что данные уже адаптированы под необходимый формат
    return (
        <div className="map-container">
            {data.map(tag => {
    // Проверяем, существуют ли tag.body и tag.body.datastreams перед их использованием
    if (!tag.body || !tag.body.datastreams) {
        return null; // Если данных нет, пропускаем итерацию
    }

    const posX = tag.body.datastreams.find(ds => ds.id === 'posX')?.current_value;
    const posY = tag.body.datastreams.find(ds => ds.id === 'posY')?.current_value;
    
    // Дополнительно проверяем, получены ли posX и posY
    if (!posX || !posY) {
        return null; // Если координаты не определены, пропускаем итерацию
    }

    //const isInDangerOrRestrictedZone = tag.zones.some(zone => zone.type === 'danger' || zone.type === 'restricted');

    const xPixel = parseFloat(posX); // Преобразуем строку в число
    const yPixel = parseFloat(posY);

    return (
        <div
            key={tag.body.id}
            className="marker"
            style={{ left: `${xPixel}px`, top: `${yPixel}px` }}
        >
           
        </div>
    );
})}

        </div>
    );
};

export default CustomMap;
