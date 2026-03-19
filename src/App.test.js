import { render, screen } from '@testing-library/react';
import App from './App';

test('renders office food ordering heading', () => {
  render(<App />);
  const heading = screen.getByText(/office food ordering/i);
  expect(heading).toBeInTheDocument();
});
