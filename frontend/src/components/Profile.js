import { useState, useEffect, useContext } from 'react';
import * as Icon from 'react-bootstrap-icons';
import InputField from './InputField';
import Alert from './Alert';
import { getFormErrorMessages, isFormValid } from './validation';
import { AuthContext } from '../contexts/AuthContext';
import { USERS_URL } from '../constants';

function Profile() {
  const { token } = useContext(AuthContext);
  const defaultFormData = {
    firstName: '',
    lastName: '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [userData, setUserData] = useState({});
  const [errorMessages, setErrorMessages] = useState(defaultFormData);
  const [wasValidated, setWasValidated] = useState(false);
  const [modifyPassword, setModifyPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [disableSave, setDisableSave] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(USERS_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const parsedResponse = await response.json();
        setUserData(parsedResponse);
        setFormData({
          ...formData,
          firstName: parsedResponse.firstName,
          lastName: parsedResponse.lastName,
        });
      } catch (error) {
        if (!error.response) {
          setAlertMessage('The server is unavailable. Try again later.');
        }
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (formData.firstName !== userData.firstName || formData.lastName !== userData.lastName
      || formData.oldPassword !== '' || formData.newPassword !== '' || formData.confirmNewPassword !== '') {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  }, [formData]);

  const handleOnChange = ({ target: { name, value } }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setWasValidated(false);
    setAlertMessage('');
    setSuccess(false);
  };

  const handleOnCancel = () => {
    setFormData({
      ...userData, oldPassword: '', newPassword: '', confirmNewPassword: '',
    });
    setModifyPassword(false);
    setWasValidated(false);
    setAlertMessage('');
  };

  const handleModifyPassword = () => {
    setModifyPassword(true);
    setWasValidated(false);
    setAlertMessage('');
    setFormData({
      ...userData, oldPassword: '', newPassword: '', confirmNewPassword: '',
    });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const errorMessageList = getFormErrorMessages(defaultFormData, formData);
    setErrorMessages(errorMessageList);
    setWasValidated(true);
    if (isFormValid(errorMessageList)) {
      try {
        const response = await fetch(USERS_URL, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setSuccess(true);
          setAlertMessage('Updated successfully.');
          setUserData({
            firstName: formData.firstName,
            lastName: formData.lastName,
          });
        } else {
          const parsedResponse = await response.json();
          setSuccess(false);
          setWasValidated(false);
          setAlertMessage(parsedResponse.message);
        }
      } catch (error) {
        setWasValidated(false);
        if (!error.response) {
          setAlertMessage('The server is unavailable. Try again later.');
        } else {
          setAlertMessage('Unsuccessful profile update.');
        }
      }
    }
  };

  return (
    <section className="my-3 my-lg-4 container-fluid">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black rounded-25px">
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-1 order-lg-1">
                    <h2 className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Profile
                    </h2>
                    <form
                      onSubmit={handleOnSubmit}
                      className="mx-1 mx-md-4"
                      noValidate
                    >
                      {(!modifyPassword) ? (
                        <div>
                          <InputField
                            icon={<Icon.PersonCircle color="cadetblue" className="me-3" size={30} />}
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="First name"
                            value={formData.firstName}
                            wasValidated={wasValidated}
                            handleOnChange={handleOnChange}
                            errorMessages={errorMessages.firstName}
                          />
                          <InputField
                            icon={<Icon.PersonCircle color="coral" className="me-3" size={30} />}
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            wasValidated={wasValidated}
                            handleOnChange={handleOnChange}
                            errorMessages={errorMessages.lastName}
                          />
                          <div className="text-center my-4">
                            <button type="button" className="btn btn-warning" onClick={handleModifyPassword}>Modify password</button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-1">
                          <InputField
                            icon={<Icon.LockFill color="grey" className="me-3" size={30} />}
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            placeholder="Old password"
                            value={formData.oldPassword}
                            wasValidated={wasValidated}
                            handleOnChange={handleOnChange}
                            errorMessages={errorMessages.oldPassword}
                          />
                          <InputField
                            icon={<Icon.KeyFill color="gold" className="me-3" size={30} />}
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            placeholder="New password"
                            value={formData.newPassword}
                            wasValidated={wasValidated}
                            handleOnChange={handleOnChange}
                            errorMessages={errorMessages.newPassword}
                          />
                          <InputField
                            icon={<Icon.KeyFill color="skyblue" className="me-3" size={30} />}
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            placeholder="Confirm new password"
                            value={formData.confirmNewPassword}
                            wasValidated={wasValidated}
                            handleOnChange={handleOnChange}
                            errorMessages={errorMessages.confirmNewPassword}
                          />
                        </div>
                      )}
                      <div className="text-center mt-4">
                        <button
                          type="button"
                          className="btn btn-secondary me-2 cancel-button"
                          onClick={handleOnCancel}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary modify-button"
                          disabled={disableSave}
                        >
                          Save
                        </button>
                      </div>
                    </form>
                    {(alertMessage !== '')
                      && (<Alert success={success} alertMessage={alertMessage} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
