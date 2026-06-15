import React from 'react';
import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

describe('AnimatedCounter Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders from to to values', () => {
    const { getByText } = render(<AnimatedCounter from={0} to={100} duration={1} />);
    
    // Initially renders the from value (or very close to it)
    expect(getByText('0')).toBeInTheDocument();

    // Fast forward to end of animation
    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(getByText('100')).toBeInTheDocument();
  });
  
  test('respects prefix and suffix', () => {
    const { getByText } = render(<AnimatedCounter from={0} to={50} prefix="$" suffix="%" duration={1} />);
    
    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(getByText('$50%')).toBeInTheDocument();
  });
});
