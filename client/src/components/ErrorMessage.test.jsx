import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders nothing when message is falsy', () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('shows a retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Oops" onRetry={onRetry} />);
    const btn = screen.getByText('Retry');
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('hides retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Oops" />);
    expect(screen.queryByText('Retry')).toBeNull();
  });
});
