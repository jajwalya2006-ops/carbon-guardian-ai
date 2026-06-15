import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CarbonCalculator from '@/app/(dashboard)/assessment/page';

describe('Assessment Flow Integration', () => {
  test('completes the assessment wizard', async () => {
    render(<CarbonCalculator />);
    
    // Step 1: Transportation
    expect(screen.getByText('Transportation Habits')).toBeInTheDocument();
    
    // Change some values
    const distanceInput = screen.getByPlaceholderText('e.g. 15');
    fireEvent.change(distanceInput, { target: { value: '20' } });
    
    const flightsInput = screen.getByPlaceholderText('e.g. 2');
    fireEvent.change(flightsInput, { target: { value: '3' } });
    
    expect(screen.getByText('Live Estimation Preview')).toBeInTheDocument();
    
    // Go to next step
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    
    // Step 2: Home & Energy
    expect(await screen.findByText('Home Energy & Water')).toBeInTheDocument();
    
    const energyInput = screen.getByPlaceholderText('e.g. 80');
    fireEvent.change(energyInput, { target: { value: '100' } });
    
    // Go to next step
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    
    // Step 3: Food & Shopping
    expect(await screen.findByText('Food & Shopping')).toBeInTheDocument();
    
    // Complete assessment
    fireEvent.click(screen.getByRole('button', { name: /Complete Assessment/i }));
    
    // Completion Screen
    expect(await screen.findByText('Assessment Complete')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go to Dashboard/i })).toBeInTheDocument();
  });
});
