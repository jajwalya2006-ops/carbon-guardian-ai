import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '@/components/layout/Sidebar';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    usePathname.mockReset();
    // Default pathname
    usePathname.mockReturnValue('/dashboard');
    // Clear localStorage
    localStorage.clear();
  });

  test('renders all navigation items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Carbon Twin')).toBeInTheDocument();
    expect(screen.getByText('AI Coach')).toBeInTheDocument();
    expect(screen.getByText('Simulator')).toBeInTheDocument();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('highlights the active page', () => {
    usePathname.mockReturnValue('/twin');
    render(<Sidebar />);
    
    // Find the Carbon Twin link wrapper and check for active styles/indicators
    const activeItem = screen.getByText('Carbon Twin').closest('div');
    expect(activeItem).toHaveStyle({ color: 'rgb(255, 255, 255)' });
    
    // Inactive items should not be white
    const inactiveItem = screen.getByText('Dashboard').closest('div');
    expect(inactiveItem).not.toHaveStyle({ color: 'rgb(255, 255, 255)' });
  });

  test('collapses and expands when toggle is clicked', () => {
    render(<Sidebar />);
    
    // Initially expanded
    expect(screen.getByText('Carbon')).toBeInTheDocument();
    expect(screen.getByText('Guardian')).toBeInTheDocument();
    
    // Click collapse
    const collapseBtn = screen.getByRole('button', { name: /collapse sidebar/i });
    fireEvent.click(collapseBtn);
    
    // Brand text should be hidden
    expect(screen.queryByText('Carbon')).not.toBeInTheDocument();
    expect(screen.queryByText('Guardian')).not.toBeInTheDocument();
    expect(localStorage.getItem('sidebar-collapsed')).toBe('true');
    
    // Click expand
    const expandBtn = screen.getByRole('button', { name: /expand sidebar/i });
    fireEvent.click(expandBtn);
    
    // Brand text should be visible again
    expect(screen.getByText('Carbon')).toBeInTheDocument();
    expect(screen.getByText('Guardian')).toBeInTheDocument();
    expect(localStorage.getItem('sidebar-collapsed')).toBe('false');
  });

  test('loads collapse state from localStorage', () => {
    localStorage.setItem('sidebar-collapsed', 'true');
    render(<Sidebar />);
    
    // Should be collapsed initially
    expect(screen.queryByText('Carbon')).not.toBeInTheDocument();
    expect(screen.queryByText('Guardian')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();
  });
});
