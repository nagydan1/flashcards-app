import { fireEvent, act } from '@testing-library/react';
import Login from './Login';
import { LOGIN_URL } from '../constants';
import renderWithAllProviders from '../test-utils';

describe('Upon rendering Login component', () => {
  it('the component is rendered', () => {
    const { getAllByText } = renderWithAllProviders(<Login />);
    expect(getAllByText('Login')[0]).toBeInTheDocument();
  });

  it('the form is rendered', () => {
    const { getByPlaceholderText } = renderWithAllProviders(<Login />);
    expect(getByPlaceholderText('E-mail address')).toBeInTheDocument();
  });

  it('the register link is rendered', () => {
    const { getByText } = renderWithAllProviders(<Login />);
    expect(getByText('Register')).toHaveAttribute('href', '/register');
  });
});

describe('Input values on Login component', () => {
  it('update on change', () => {
    const { getByPlaceholderText } = renderWithAllProviders(<Login />);
    const emailInput = getByPlaceholderText('E-mail address');
    fireEvent.change(emailInput, { target: { value: 'test@tom.com' } });
    expect(emailInput.value).toBe('test@tom.com');
  });
});

describe('As part of form validation on Login component', () => {
  it('empty field triggers correct feedback', () => {
    const { getAllByText, getByTestId } = renderWithAllProviders(<Login />);
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Field is required.')[0]).toBeInTheDocument();
  });

  it('invalid e-mail triggers correct feedback', () => {
    const {
      getAllByText, getByTestId, getByPlaceholderText,
    } = renderWithAllProviders(<Login />);
    const input = getByPlaceholderText('E-mail address');
    fireEvent.change(input, { target: { value: 'tom.test@tmail' } });
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Invalid e-mail address.')[0]).toBeInTheDocument();
  });

  it('long input triggers correct feedback', () => {
    const {
      getAllByText, getByTestId, getByPlaceholderText,
    } = renderWithAllProviders(<Login />);
    const input = getByPlaceholderText('Password');
    fireEvent.change(input, { target: { value: '1212qwqwQWQW1212qwqw1212qwqwQWQW1212qwqw1212qwqwQWQW1212qwqw1212qwqwQWQW1212qwqw1212qwqwQWQW1212qwqw1212qwqwQWQW1212qwqw1212qwqwQWQW1212qwqw1212qwqwQWQW1212qwqw1212qwqwQWQW1212qwqw1212qwqwQWQW1212qwqw1212qwqwQWQW1212qwqw1212qwqwQWQW1212qwqw' } });
    fireEvent.click(getByTestId('submit'));
    expect(getAllByText('Max. 100 characters.')[0]).toBeInTheDocument();
  });

  it('correct values do\'not trigger feedback', () => {
    const {
      queryByText, getByTestId, getByPlaceholderText,
    } = renderWithAllProviders(<Login />);
    fireEvent.change(getByPlaceholderText('E-mail address'), { target: { value: 'tom-test@tmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1212qwQW' } });
    fireEvent.click(getByTestId('submit'));
    expect(queryByText('Field is required.')).toBeNull();
    expect(queryByText('Max. 100 characters.')).toBeNull();
    expect(queryByText('Invalid e-mail address.')).toBeNull();
    expect(queryByText('Min. 8 characters, incl. 1 number, 1 uppercase and 1 lowercase letter.')).toBeNull();
  });
});

describe('After submitting a valid form on Login component', () => {
  it('calls fetch with correct data', async () => {
    expect.assertions(2);
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    const body = JSON.stringify({
      email: 'tom-test@tmail.com',
      password: '1212qwQW',
    });

    const { getByTestId, getByPlaceholderText } = renderWithAllProviders(<Login />);
    fireEvent.change(getByPlaceholderText('E-mail address'), { target: { value: 'tom-test@tmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1212qwQW' } });
    fireEvent.click(getByTestId('submit'));
    await act(() => {
      expect(mockFetch).toBeCalledTimes(1);
      expect(mockFetch).toBeCalledWith(LOGIN_URL, { body, headers: { 'Content-Type': 'application/json' }, method: 'POST' });
    });
  });
});
