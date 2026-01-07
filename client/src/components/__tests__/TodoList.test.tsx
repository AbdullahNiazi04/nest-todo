import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';

test('renders add button', () => {
  render(<TodoList />);
  expect(screen.getByText(/Add/i)).toBeInTheDocument();
});