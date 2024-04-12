import statisticsStore from '../../stores/statisticsStore';

export function handleWebSocketMessage(data) {
    const stats = JSON.parse(data);
    console.log('Received WebSocket message:', stats);
    if (stats.type === 'userStatistics') {
      statisticsStore.getState().updateUserStatistics(stats.data);
    } else if (stats.type === 'taskStatistics') {
      statisticsStore.getState().updateTaskStatistics(stats.data);
    } else if (stats.type === 'categoryStatistics') {
      statisticsStore.getState().updateCategoriesStatistics(stats.data.categories);
    }
  }
  