import { render, screen } from '@testing-library/react';
import App from './App';

test('renders links', () => {
  render(<App />);
  const linkElement = screen.getByText(/CV/i);
  expect(linkElement).toBeInTheDocument();
});
