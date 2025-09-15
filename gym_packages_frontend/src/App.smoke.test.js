import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hero heading', () => {
  render(<App />);
  expect(screen.getByText(/Find Your Perfect Plan/i)).toBeInTheDocument();
});

test('renders header nav links', () => {
  render(<App />);
  expect(screen.getByText(/Packages/i)).toBeInTheDocument();
  expect(screen.getByText(/About/i)).toBeInTheDocument();
  expect(screen.getByText(/Contact/i)).toBeInTheDocument();
});
