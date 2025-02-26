import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import App from './App';


describe('App', () => {
  it('renders login page', async () => {
    render(<App />);

    userEvent.click(screen.getByRole('link', { name: 'TITLE' }));

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create an account' })).toBeInTheDocument();
  });

  it('renders register page', async () => {
    render(<App />);

    userEvent.click(screen.getByRole('link', { name: 'TITLE' }));
    userEvent.click(screen.getByRole('link', { name: 'Create an account' }));

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Have an account?' })).toBeInTheDocument();
  });

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