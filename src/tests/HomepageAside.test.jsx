import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomepageAside from '../components/Asides/HomepageAside';
import useLayoutStore from '../stores/layoutStore';
import useTranslationsStore from '../stores/useTranslationsStore';
import '@testing-library/jest-dom';


jest.mock('../stores/layoutStore.jsx');
jest.mock('../stores/useTranslationsStore');
jest.mock('react-intl', () => ({
    IntlProvider: ({ children }) => children,
    FormattedMessage: ({ id }) => <span>{id}</span>
  }));
  jest.mock('../components/Auth/AcessControl.jsx', () => ({
    __esModule: true, 
    default: ({ children }) => <>{children}</>, 
    AccessControl: ({ children }) => <>{children}</> 
}));

  

describe('HomepageAside Component Navigation', () => {
    beforeEach(() => {
        useLayoutStore.mockReturnValue({
            isAsideExpanded: true,
            toggleAside: jest.fn()
        });
        useTranslationsStore.mockReturnValue({
            locale: 'en'
        });
    });

    it('navigates to home when clicking the Task Board link', () => {
        const { getByText } = render(<Router><HomepageAside /></Router>);
        const taskBoardLink = getByText('taskBoard');
        fireEvent.click(taskBoardLink);
        expect(window.location.pathname).toBe('/home');
    });

    it('navigates to users when clicking the Users link', () => {
        const { getByText } = render(<Router><HomepageAside /></Router>);
        const usersLink = getByText('users');
        fireEvent.click(usersLink);
        expect(window.location.pathname).toBe('/users');
    });
    it('navigates to users when clicking the Users link', () => {
        const { getByText } = render(<Router><HomepageAside /></Router>);
        const usersLink = getByText('deletedTasks');
        fireEvent.click(usersLink);
        expect(window.location.pathname).toBe('/tasks');
    });
    it('navigates to users when clicking the Users link', () => {
        const { getByText } = render(<Router><HomepageAside /></Router>);
        const usersLink = getByText('categories');
        fireEvent.click(usersLink);
        expect(window.location.pathname).toBe('/categories');
    });
    it('navigates to users when clicking the Users link', () => {
        const { getByText } = render(<Router><HomepageAside /></Router>);
        const usersLink = getByText('dashboard');
        fireEvent.click(usersLink);
        expect(window.location.pathname).toBe('/dashboard');
    });
    it('navigates to users when clicking the Users link', () => {
        const { getByText } = render(<Router><HomepageAside /></Router>);
        const usersLink = getByText('settings');
        fireEvent.click(usersLink);
        expect(window.location.pathname).toBe('/settings');
    });
});

