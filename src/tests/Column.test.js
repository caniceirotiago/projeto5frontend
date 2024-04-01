import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Column from '../components/SecundaryComponents/MainTaskViewer/TertiaryComponents/Column.jsx';
import { taskService } from '../services/taskService'; 

beforeEach(() => {
  taskService.editTask = jest.fn().mockResolvedValue(true); 
});

describe('Column', () => {
  it('calls handleDrop when a task is dropped', async () => { 
    const mockOnAddTaskClick = jest.fn();
    const updateTasks = jest.fn(); 

    const { getByRole } = render(
      <Column 
        title="Todo" 
        children={[]} 
        taskCount={0} 
        status="100" 
        updateTasks={updateTasks} 
        onAddTaskClick={mockOnAddTaskClick}
      />
    );

    const dataTransferMock = {
      data: {},
      setData(type, val) {
        this.data[type] = val;
      },
      getData(type) {
        return this.data[type];
      }
    };

    dataTransferMock.setData('application/reactflow', '123'); 

    const droppableArea = getByRole('list');
    
    fireEvent.dragOver(droppableArea, { preventDefault: () => {} });
    
    fireEvent.drop(droppableArea, { 
      preventDefault: () => {},
      dataTransfer: dataTransferMock 
    });

    await waitFor(() => {
        expect(updateTasks).toHaveBeenCalled();
        console.log('Success: handleDrop was called, and updateTasks was triggered.');
      });

  });
});
