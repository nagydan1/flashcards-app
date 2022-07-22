import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import Register from './Register';
import { REGISTER_URL } from '../constants';

describe('Upon rendering', () => {
  it('the component is rendered', () => {
    const { getAllByText } = render(<Register />, { wrapper: MemoryRouter });
    expect(getAllByText('Register')[0]).toBeTruthy();
  });

  it('the form is rendered', () => {
    const { getByPlaceholderText } = render(<Register />, { wrapper: MemoryRouter });
    expect(getByPlaceholderText('First name')).toBeTruthy();
  });

  it('the login link is rendered', () => {
    const { getByText } = render(<Register />, { wrapper: MemoryRouter });
    expect(getByText('Login')).toHaveAttribute('href', '/login');
  });
});

describe('Input values', () => {
  it('update on change', () => {
    const { getByPlaceholderText } = render(<Register />, { wrapper: MemoryRouter });
    const firstNameInput = getByPlaceholderText('First name');
    fireEvent.change(firstNameInput, { target: { value: 'Tom' } });
    expect(firstNameInput.value).toBe('Tom');
  });
});

describe('As part of form validation', () => {
  it('empty field triggers correct feedback', () => {
    const { getAllByText, getByTestId } = render(<Register />, { wrapper: MemoryRouter });
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Field is required.')[0]).toBeTruthy();
  });

  it('long input triggers correct feedback', () => {
    const {
      getAllByText, getByTestId, getByPlaceholderText,
    } = render(<Register />, { wrapper: MemoryRouter });
    const input = getByPlaceholderText('Last name');
    fireEvent.change(input, { target: { value: 'ihaveaweirdlylongnameorimspammingtheserver' } });
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Max. 20 characters.')[0]).toBeTruthy();
  });

  it('invalid e-mail triggers correct feedback', () => {
    const {
      getAllByText, getByTestId, getByPlaceholderText,
    } = render(<Register />, { wrapper: MemoryRouter });
    const input = getByPlaceholderText('E-mail address');
    fireEvent.change(input, { target: { value: 'tom.test@tmail' } });
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Invalid e-mail address.')[0]).toBeTruthy();
  });

  it('weak password triggers correct feedback', () => {
    const {
      getAllByText, getByTestId, getByPlaceholderText,
    } = render(<Register />, { wrapper: MemoryRouter });
    const input = getByPlaceholderText('Password');
    fireEvent.change(input, { target: { value: '1234qwert' } });
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Min. 8 characters, incl. 1 number, 1 uppercase and 1 lowercase letter.')[0]).toBeTruthy();
  });

  it('not matching passworda trigger correct feedback', () => {
    const {
      getAllByText, getByTestId, getByPlaceholderText,
    } = render(<Register />, { wrapper: MemoryRouter });
    const pwInput = getByPlaceholderText('Password');
    const pw2Input = getByPlaceholderText('Confirm password');
    fireEvent.change(pwInput, { target: { value: '1234qwertY' } });
    fireEvent.change(pw2Input, { target: { value: '1234qwerT' } });
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Passwords don\'t match. Try again.')[0]).toBeTruthy();
  });

  it('correct values do\'not trigger feedback', () => {
    const {
      queryByText, getByTestId, getByPlaceholderText,
    } = render(<Register />, { wrapper: MemoryRouter });
    fireEvent.change(getByPlaceholderText('First name'), { target: { value: 'Tom' } });
    fireEvent.change(getByPlaceholderText('Last name'), { target: { value: 'Test' } });
    fireEvent.change(getByPlaceholderText('E-mail address'), { target: { value: 'tom-test@tmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1212qwQW' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: '1212qwQW' } });
    fireEvent.click(getByTestId('submit'));
    expect(queryByText('Field is required.')).toBeNull();
    expect(queryByText('Max. 20 characters.')).toBeNull();
    expect(queryByText('Invalid e-mail address.')).toBeNull();
    expect(queryByText('Passwords don\'t match. Try again.')).toBeNull();
    expect(queryByText('Min. 8 characters, incl. 1 number, 1 uppercase and 1 lowercase letter.')).toBeNull();
  });
});

describe('After submitting a valid form', () => {
  it('calls fetch with correct data', async () => {
    expect.assertions(2);
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    const body = JSON.stringify({
      firstName: 'Tom',
      lastName: 'Test',
      email: 'tom-test@tmail.com',
      password: '1212qwQW',
      confirmPassword: '1212qwQW',
    });

    const { getByTestId, getByPlaceholderText } = render(<Register />, { wrapper: MemoryRouter });
    fireEvent.change(getByPlaceholderText('First name'), { target: { value: 'Tom' } });
    fireEvent.change(getByPlaceholderText('Last name'), { target: { value: 'Test' } });
    fireEvent.change(getByPlaceholderText('E-mail address'), { target: { value: 'tom-test@tmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1212qwQW' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: '1212qwQW' } });
    fireEvent.click(getByTestId('submit'));
    expect(mockFetch).toBeCalledTimes(1);
    expect(mockFetch).toBeCalledWith(REGISTER_URL, { body, headers: { 'Content-Type': 'application/json' }, method: 'POST' });
  });

  it('shows success alert if response is ok', async () => {
    expect.assertions(0);
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({}),
    });
    global.fetch = mockFetch;

    const {
      findByText, getByTestId, getByPlaceholderText,
    } = render(<Register />, { wrapper: MemoryRouter });
    fireEvent.change(getByPlaceholderText('First name'), { target: { value: 'Tom' } });
    fireEvent.change(getByPlaceholderText('Last name'), { target: { value: 'Test' } });
    fireEvent.change(getByPlaceholderText('E-mail address'), { target: { value: 'tom-test@tmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1212qwQW' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: '1212qwQW' } });
    fireEvent.click(getByTestId('submit'));
    await findByText('Successful registration. Now you can log in.');
  });

  it('shows error alert if response is 401', async () => {
    expect.assertions(0);
    const mockFetch = jest.fn().mockResolvedValueOnce({
      status: 401,
      json: jest.fn().mockResolvedValueOnce({
        message: 'E-mail or password is incorrect.',
      }),
    });
    global.fetch = mockFetch;

    const {
      findByText, getByTestId, getByPlaceholderText,
    } = render(<Register />, { wrapper: MemoryRouter });
    fireEvent.change(getByPlaceholderText('First name'), { target: { value: 'Tom' } });
    fireEvent.change(getByPlaceholderText('Last name'), { target: { value: 'Test' } });
    fireEvent.change(getByPlaceholderText('E-mail address'), { target: { value: 'tom-test@tmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1212qwQW' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: '1212qwQW' } });
    fireEvent.click(getByTestId('submit'));
    await findByText('E-mail or password is incorrect.');
  });

  it('shows error alert if error is cought', async () => {
    expect.assertions(0);
    const mockFetch = jest.fn().mockRejectedValueOnce({});
    global.fetch = mockFetch;

    const {
      findByText, getByTestId, getByPlaceholderText,
    } = render(<Register />, { wrapper: MemoryRouter });
    fireEvent.change(getByPlaceholderText('First name'), { target: { value: 'Tom' } });
    fireEvent.change(getByPlaceholderText('Last name'), { target: { value: 'Test' } });
    fireEvent.change(getByPlaceholderText('E-mail address'), { target: { value: 'tom-test@tmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1212qwQW' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: '1212qwQW' } });
    fireEvent.click(getByTestId('submit'));
    await findByText('The server is unavailable. Try again later.');
  });
});
