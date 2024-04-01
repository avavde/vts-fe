// MapWithMarkers.js
import React, { useContext, useState } from 'react';
import { WebSocketContext } from './WebSocketContext';

const MapWithMarkers = () => {
    const { data } = useContext(WebSocketContext);
    const [filterPosZ, setFilterPosZ] = useState(null);

    // Фильтрация тегов по posZ, если задан фильтр
    const filteredData = filterPosZ !== null ? data.filter(tag => {
        const posZData = tag.body.datastreams.find(ds => ds.id === 'posZ');
        return posZData && parseFloat(posZData.current_value) === parseFloat(filterPosZ);
    }) : data;

    return (
        <div>
            {/* Примерный интерфейс для выбора фильтрации по posZ */}
            <input
                type="number"
                placeholder="Filter by posZ"
                onChange={e => setFilterPosZ(e.target.value)}
            />

            {/* Здесь может быть ваш компонент для отображения карты */}
            <div className="map-container">
                {filteredData.map(tag => (
                    <div
                        key={tag.body.id}
                        className="marker"
                        style={{
                            left: `${tag.body.datastreams.find(ds => ds.id === 'posX').current_value}px`,
                            top: `${tag.body.datastreams.find(ds => ds.id === 'posY').current_value}px`,
                        }}
                    >
                        {/* Маркер для тега */}
                        <span>🔵</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MapWithMarkers;
