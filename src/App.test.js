import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import App from './App';


describe('App', () => {
  it('renders navbar', async () => {
    render(<App />);

    const links = [
      'TITLE',
      'Dashboard',
      'Masterhead',
      'Submissions',
      'About',
      'My Account',
      'View All People',
    ];

    links.forEach((link) => {
      expect(screen.getByRole('link', { name: link })).toBeInTheDocument();
    });
  });

  it('switches to Dashboard view', async () => {
    render(<App />);

    userEvent.click(screen.getByText('Dashboard'));

    expect(screen.getByRole('heading', { name: 'To Do' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My Submissions' })).toBeInTheDocument();
  });

  it('switches to Masthead view', async () => {
    render(<App />);

    userEvent.click(screen.getByText('Masterhead'));

    expect(screen.getByRole('heading', { name: 'Editors' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Managing Editors' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Consulting Editors' })).toBeInTheDocument();
  });

  it('switches to People view', async () => {
    render(<App />);

    userEvent.click(screen.getByText('View All People'));

    expect(screen.getByRole('button', { name: 'Add a Person' })).toBeInTheDocument();
  });
});