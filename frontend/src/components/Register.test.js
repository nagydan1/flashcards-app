import { fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';
import { REGISTER_URL } from '../constants';
import renderWithAllProviders from '../test-utils';

describe('Upon rendering Register component', () => {
  it('the component is rendered', () => {
    const { getAllByText } = renderWithAllProviders(<Register />);
    expect(getAllByText('Register')[0]).toBeInTheDocument();
  });

  it('the form is rendered', () => {
    const { getByPlaceholderText } = renderWithAllProviders(<Register />);
    expect(getByPlaceholderText('First name')).toBeInTheDocument();
  });

  it('the login link is rendered', () => {
    const { getByText } = renderWithAllProviders(<Register />);
    expect(getByText('Login')).toHaveAttribute('href', '/login');
  });
});

describe('Input values on Register component', () => {
  it('update on change', () => {
    const { getByPlaceholderText } = renderWithAllProviders(<Register />);
    const firstNameInput = getByPlaceholderText('First name');
    fireEvent.change(firstNameInput, { target: { value: 'Tom' } });
    expect(firstNameInput.value).toBe('Tom');
  });
});

describe('As part of form validation on Register component', () => {
  it('empty field triggers correct feedback', () => {
    const { getAllByText, getByTestId } = renderWithAllProviders(<Register />);
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Field is required.')[0]).toBeInTheDocument();
  });

  it('long input triggers correct feedback', () => {
    const {
      getAllByText, getByTestId, getByPlaceholderText,
    } = renderWithAllProviders(<Register />);
    const input = getByPlaceholderText('Last name');
    fireEvent.change(input, { target: { value: 'ihaveaweirdlylongnameorimspammingtheserver' } });
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Max. 20 characters.')[0]).toBeInTheDocument();
  });

  it('invalid e-mail triggers correct feedback', () => {
    const {
      getAllByText, getByTestId, getByPlaceholderText,
    } = renderWithAllProviders(<Register />);
    const input = getByPlaceholderText('E-mail address');
    fireEvent.change(input, { target: { value: 'tom.test@tmail' } });
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Invalid e-mail address.')[0]).toBeInTheDocument();
  });

  it('weak password triggers correct feedback', () => {
    const {
      getAllByText, getByTestId, getByPlaceholderText,
    } = renderWithAllProviders(<Register />);
    const input = getByPlaceholderText('Password');
    fireEvent.change(input, { target: { value: '1234qwert' } });
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Min. 8 characters, incl. 1 number, 1 uppercase and 1 lowercase letter.')[0]).toBeInTheDocument();
  });

  it('not matching passworda trigger correct feedback', () => {
    const {
      getAllByText, getByTestId, getByPlaceholderText,
    } = renderWithAllProviders(<Register />);
    const pwInput = getByPlaceholderText('Password');
    const pw2Input = getByPlaceholderText('Confirm password');
    fireEvent.change(pwInput, { target: { value: '1234qwertY' } });
    fireEvent.change(pw2Input, { target: { value: '1234qwerT' } });
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Passwords don\'t match. Try again.')[0]).toBeInTheDocument();
  });

  it('correct values do\'not trigger feedback', () => {
    const {
      queryByText, getByTestId, getByPlaceholderText,
    } = renderWithAllProviders(<Register />);
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

describe('After submitting a valid form on Register component', () => {
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

    const { getByTestId, getByPlaceholderText } = renderWithAllProviders(<Register />);
    fireEvent.change(getByPlaceholderText('First name'), { target: { value: 'Tom' } });
    fireEvent.change(getByPlaceholderText('Last name'), { target: { value: 'Test' } });
    fireEvent.change(getByPlaceholderText('E-mail address'), { target: { value: 'tom-test@tmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1212qwQW' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: '1212qwQW' } });
    fireEvent.click(getByTestId('submit'));
    await waitFor(() =>{
      expect(mockFetch).toBeCalledTimes(1);
      expect(mockFetch).toBeCalledWith(REGISTER_URL, { body, headers: { 'Content-Type': 'application/json' }, method: 'POST' });
    });
  });

  it('shows success alert if response is ok', async () => {
    expect.assertions(1);
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({}),
    });
    global.fetch = mockFetch;

    const {
      findByText, getByTestId, getByPlaceholderText,
    } = renderWithAllProviders(<Register />);
    fireEvent.change(getByPlaceholderText('First name'), { target: { value: 'Tom' } });
    fireEvent.change(getByPlaceholderText('Last name'), { target: { value: 'Test' } });
    fireEvent.change(getByPlaceholderText('E-mail address'), { target: { value: 'tom-test@tmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1212qwQW' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: '1212qwQW' } });
    fireEvent.click(getByTestId('submit'));
    expect(await findByText("Successful registration. Now you can log in.")).toBeInTheDocument();
  });

  it('shows error alert if response is 401', async () => {
    expect.assertions(1);
    const mockFetch = jest.fn().mockResolvedValueOnce({
      status: 401,
      json: jest.fn().mockResolvedValueOnce({
        message: 'E-mail or password is incorrect.',
      }),
    });
    global.fetch = mockFetch;

    const {
      findByText, getByTestId, getByPlaceholderText,
    } = renderWithAllProviders(<Register />);
    fireEvent.change(getByPlaceholderText('First name'), { target: { value: 'Tom' } });
    fireEvent.change(getByPlaceholderText('Last name'), { target: { value: 'Test' } });
    fireEvent.change(getByPlaceholderText('E-mail address'), { target: { value: 'tom-test@tmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1212qwQW' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: '1212qwQW' } });
    fireEvent.click(getByTestId('submit'));
    expect(await findByText("E-mail or password is incorrect.")).toBeInTheDocument();
  });

  it('shows error alert if error is cought', async () => {
    expect.assertions(1);
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    const mockFetch = jest.fn().mockRejectedValueOnce({
      response: false,
    });
    global.fetch = mockFetch;

    const {
      findByText, getByTestId, getByPlaceholderText,
    } = renderWithAllProviders(<Register />);
    fireEvent.change(getByPlaceholderText('First name'), { target: { value: 'Tom' } });
    fireEvent.change(getByPlaceholderText('Last name'), { target: { value: 'Test' } });
    fireEvent.change(getByPlaceholderText('E-mail address'), { target: { value: 'tom-test@tmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1212qwQW' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: '1212qwQW' } });
    fireEvent.click(getByTestId('submit'));
    expect(await findByText("The server is unavailable. Try again later.")).toBeInTheDocument();
  });
});
