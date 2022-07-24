import {
  useState, useContext, useEffect, useRef,
} from 'react';
import * as Icon from 'react-bootstrap-icons';
import Alert from './Alert';
import InputField from './InputField';
import { AuthContext } from '../contexts/AuthContext';
import { CARDS_URL } from '../constants';

function CardForm({ setCreateToggle }) {
  const { user, token } = useContext(AuthContext);

  const defaultFormData = {
    nativeText: '',
    foreignText: '',
    userId: user,
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [alertMessage, setAlertMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const inputRef = useRef(null);

  function handleValidation() {
    setAlertMessage('');
    setSuccess(false);
    let isValid = true;
    if (formData.nativeText === '' || formData.nativeText === undefined || formData.foreignText === '' || formData.foreignText === undefined) {
      setAlertMessage('All fields are required.');
      isValid = false;
    }
    return isValid;
  }

  const handleOnChange = ({ target: { name, value } }) => {
    setAlertMessage('');
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const formElement = event.target;

      try {
        const response = await fetch(CARDS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setSuccess(true);
          setAlertMessage('Saved successfully.');
        }
      } catch (error) {
        if (!error.response) {
          setAlertMessage('The server is unavailable. Try again later.');
        } else {
          setAlertMessage('Unsuccessful save.');
        }
      }

      setFormData(defaultFormData);
      formElement.reset();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [success]);

  return (
    <div className="col-md-10 col-lg-6 col-xl-5 text-center">
      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">New card</p>

      <form onSubmit={handleSubmit} className="mx-1 mx-md-4" noValidate>
        <InputField
          ref={inputRef}
          icon={<Icon.ChatLeftDots color="coral" className="me-3" size={30} />}
          type="text"
          id="nativeText"
          name="nativeText"
          placeholder="Native word"
          value={formData.nativeText}
          handleOnChange={handleOnChange}
        />
        <InputField
          icon={<Icon.ChatRightDots color="cadetblue" className="me-3" size={30} />}
          type="text"
          id="foreignText"
          name="foreignText"
          placeholder="Foreign word"
          value={formData.foreignText}
          handleOnChange={handleOnChange}
        />
        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
          <button type="submit" data-testid="save-button" className="btn btn-primary mx-2">Save</button>
          <button type="button" data-testid="back-button" className="btn btn-danger mx-2" onClick={() => setCreateToggle(false)}>Back</button>
        </div>
      </form>

      {(alertMessage !== '')
        && (
          <Alert
            success={success}
            alertMessage={alertMessage}
          />
        )}
    </div>
  );
}

export default CardForm;
