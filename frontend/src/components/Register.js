import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import validator from 'validator';

import { REGISTER_URL } from '../constants';
import Input from './Input';

function Registration() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matchPassword, setMatchPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setErrorMessage('');
  }, [firstName, lastName, email, password, matchPassword]);

  const requestRegister = async () => {
    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });
      if (response.ok) setSuccess(true);
      if (response.status === 400) {
        const parsedResponse = await response.json();
        setErrorMessage(parsedResponse.message);
      }
    } catch (error) {
      setErrorMessage('Error:', error);
      if (!error?.response) {
        setErrorMessage('The server is unavailable. Try again later.');
      } else {
        setErrorMessage('Registration unsuccessful.');
      }
    }
  };

  const validaton = () => {
    setErrorMessage('');

    if (firstName === '' || lastName === '' || email === '' || password === '') {
      setErrorMessage('Name, e-mail address and password can\'t remain empty.');
      return false;
    }
    if (!validator.isLength(firstName, { max: 20 })) {
      setErrorMessage('First name can be max. 20 characters.');
      return false;
    }
    if (!validator.isLength(lastName, { max: 20 })) {
      setErrorMessage('Last name can be max. 20 characters.');
      return false;
    }
    if (!validator.isEmail(email)) {
      setErrorMessage('Invalid e-mail address.');
      return false;
    }
    if (!validator.isStrongPassword(password, { minSymbols: 0, maxLength: 100 })) {
      setErrorMessage(
        'Password must be between 8-100 characters, incl. 1 number, 1 uppercase and 1 lowercase letter.',
      );
      return false;
    }
    if (password !== matchPassword) {
      setErrorMessage('Passwords don\'t match. Try again.');
      return false;
    }
    return true;
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (validaton()) {
      requestRegister();
    }
  };

  return (
    <>
      {success && <Navigate replace to="/" />}

      <section className="vh-100">

        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black rounded-25px">
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-1 order-lg-1">

                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Register
                      </p>

                      <form
                        id="registration-form"
                        onSubmit={handleOnSubmit}
                        className="mx-1 mx-md-4"
                        noValidate
                      >
                        <Input
                          icon={<Icon.PersonCircle color="cadetblue" className="me-3" size={30} />}
                          type="text"
                          id="firstName"
                          setter={setFirstName}
                          placeholder="First name"
                        />
                        <Input
                          icon={<Icon.PersonCircle color="coral" className="me-3" size={30} />}
                          type="text"
                          id="lastName"
                          setter={setLastName}
                          placeholder="Last name"
                        />
                        <Input
                          icon={<Icon.EnvelopeFill color="gold" className="me-3" size={30} />}
                          type="email"
                          id="email"
                          setter={setEmail}
                          placeholder="E-mail address"
                        />

                        <Input
                          icon={<Icon.LockFill className="me-3" color="grey" size={30} />}
                          type="password"
                          id="password"
                          setter={setPassword}
                          placeholder="Password"
                        />
                        <Input
                          icon={<Icon.KeyFill color="skyblue" className="me-3" size={30} />}
                          type="password"
                          id="matchpassword"
                          setter={setMatchPassword}
                          placeholder="Confirm password"
                        />

                        <div className="d-flex justify-content-center mx-4 my-3 mb-lg-4">
                          <button type="submit" className="btn btn-primary btn-lg">Register</button>
                        </div>

                      </form>

                      <div className={errorMessage
                        ? 'd-block'
                        : 'd-none'}
                      >
                        <p
                          className="alert alert-danger"
                          role="alert"
                          aria-live="assertive"
                        >
                          {errorMessage}
                        </p>
                      </div>
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
    </>
  );
}

export default Registration;
