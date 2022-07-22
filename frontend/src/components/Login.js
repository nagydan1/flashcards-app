import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import InputField from './InputField';
import Alert from './Alert';
import { isFormValid, getFormErrorMessages } from './validation';
import { AuthContext, loginUser, resetLoginFailed } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const defaultFormData = {
    email: '',
    password: '',
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [errorMessages, setErrorMessages] = useState(defaultFormData);
  const [wasValidated, setWasValidated] = useState(false);

  const {
    loginFailed, errorMessage, loading, dispatch, user,
  } = useContext(AuthContext);

  const handleOnChange = ({ target: { name, value } }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setWasValidated(false);
    resetLoginFailed(dispatch);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const errorMessageList = getFormErrorMessages(defaultFormData, formData);
    setErrorMessages(errorMessageList);
    setWasValidated(true);
    if (isFormValid(errorMessageList)) {
      await loginUser(dispatch, formData);
      setWasValidated(false);
    }
  };

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  return (
    <section className="my-3 my-lg-5">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black rounded-25px">
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-1 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Login
                    </p>
                    <form
                      onSubmit={handleOnSubmit}
                      className="mx-1 mx-md-4"
                      noValidate
                    >
                      <InputField
                        icon={<Icon.EnvelopeFill color="gold" className="me-3" size={30} />}
                        type="text"
                        id="email"
                        name="email"
                        placeholder="E-mail address"
                        value={formData.email}
                        wasValidated={wasValidated}
                        handleOnChange={handleOnChange}
                        errorMessages={errorMessages.email}
                      />
                      <InputField
                        icon={<Icon.LockFill color="grey" className="me-3" size={30} />}
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        wasValidated={wasValidated}
                        handleOnChange={handleOnChange}
                        errorMessages={errorMessages.password}
                      />
                      <div className="d-flex justify-content-center mx-4 my-2 mb-lg-3">
                        <button type="submit" className="btn btn-primary btn-lg mt-2" disabled={loading}>
                          Login
                        </button>
                      </div>
                    </form>
                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <Link to="/register" className="text-decoration-none text-center">
                        Register
                      </Link>
                    </div>
                    {(loginFailed)
                      && (<Alert success={false} alertMessage={errorMessage.message} />)}
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-2 order-lg-2">
                    <img
                      src="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/127090580/original/ef214546a3079c348edaa1c936373c3185223fe5/design-word-cloud-art-poster.png"
                      className="img-fluid"
                      alt="Flash cards app"
                    />
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

export default Login;
