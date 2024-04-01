// StatisticsBar.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import StatisticsBar from '../components/SecundaryComponents/MainTaskViewer/StatisticsBar.jsx';
import * as taskCountStoreModule from '../stores/taskCountStore';

jest.mock('../stores/taskCountStore', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('StatisticsBar', () => {
    it('renders correctly with non-zero counts', () => {
        taskCountStoreModule.default.mockImplementation((selector) => selector({
            newTodoCount: 1,
            newDoingCount: 2,
            newDoneCount: 3,
        }));

        render(<StatisticsBar />);
        expect(screen.getByTestId('todo-bar')).toBeInTheDocument();
        expect(screen.getByTestId('doing-bar')).toBeInTheDocument();
        expect(screen.getByTestId('done-bar')).toBeInTheDocument();
    });

    it('does not render when all counts are zero', () => {
        taskCountStoreModule.default.mockImplementation((selector) => selector({
            newTodoCount: 0,
            newDoingCount: 0,
            newDoneCount: 0,
        }));

        const { container } = render(<StatisticsBar />);
        expect(container.firstChild).toBeNull();
    });
    it('calculates the correct widths for bars based on counts', () => {
      const todoCount = 1;
      const doingCount = 2;
      const doneCount = 3;
      const totalCount = todoCount + doingCount + doneCount;

      const expectedTodoWidth = `${(todoCount / totalCount) * 100}%`;
      const expectedDoingWidth = `${(doingCount / totalCount) * 100}%`;
      const expectedDoneWidth = `${(doneCount / totalCount) * 100}%`;

      taskCountStoreModule.default.mockImplementation((selector) => selector({
          newTodoCount: todoCount,
          newDoingCount: doingCount,
          newDoneCount: doneCount,
      }));

      render(<StatisticsBar />);

      const todoBar = screen.getByTestId('todo-bar');
      const doingBar = screen.getByTestId('doing-bar');
      const doneBar = screen.getByTestId('done-bar');

      expect(todoBar).toHaveStyle(`width: ${expectedTodoWidth}`);
      expect(doingBar).toHaveStyle(`width: ${expectedDoingWidth}`);
      expect(doneBar).toHaveStyle(`width: ${expectedDoneWidth}`);

      console.log('todoBar', todoBar.style.width);
      console.log('doingBar', doingBar.style.width);
      console.log('doneBar', doneBar.style.width);
  });
});
