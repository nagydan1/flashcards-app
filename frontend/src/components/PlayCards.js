import {
  useState, useContext, useEffect, useRef,
} from 'react';
import * as Icon from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import InputField from './InputField';
import { AuthContext } from '../contexts/AuthContext';

function PlayCards({ resourceURL, title, setHasDeck }) {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [answer, setAnswer] = useState('');
  const [remainingCards, setRemainingCards] = useState();
  const [activeCard, setActiveCard] = useState();
  const [alertMessage, setAlertMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);

  const inputRef = useRef(null);

  const flipCard = (deck) => {
    const randomIndex = Math.floor(Math.random() * deck.length);
    setActiveCard(deck[randomIndex]);
    setRemainingCards(deck.filter(
      (card) => card._id !== deck[randomIndex]._id,
    ));
  };

  useEffect(() => {
    if (remainingCards !== undefined) {
      if (remainingCards.length === 0) {
        if (alertMessage !== '') {
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      }
    }
  }, [remainingCards, alertMessage]);

  useEffect(() => {
    async function getCards() {
      try {
        const getHeader = new Headers();
        getHeader.append('Authorization', `Bearer ${token}`);
        const response = await fetch(resourceURL, {
          method: 'GET',
          headers: getHeader,
        });
        const cardObject = await response.json();
        if (cardObject.cards.length === 0) {
          setAlertMessage('First you need to create cards.');
          if (setHasDeck) setHasDeck(false);
        }
        flipCard(cardObject.cards);
      } catch (error) {
        if (!error.response) {
          setAlertMessage('The server is unavailable. Try again later.');
        }
      }
    }
    getCards();
  }, []);

  const handleOnChange = ({ target: { value } }) => {
    setAlertMessage('');
    setIsWrongAnswer(false);
    setAnswer(value);
  };

  const handlePass = () => {
    setSuccess(false);
    if (remainingCards.length !== 0) {
      flipCard(remainingCards);
    } else {
      setAlertMessage('You have played all cards :)');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeCard.foreignText === answer) {
      setSuccess(true);
      setTimeout(() => {
        if (remainingCards.length !== 0) {
          flipCard(remainingCards);
          setSuccess(false);
          setAnswer('');
        } else {
          setAlertMessage('Congratulations! You have played all cards :)');
        }
      }, 700);
    } else {
      setIsWrongAnswer(true);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [success]);

  return (
    <div className="card text-black rounded-25px my-2">
      <div className="card-body p-md-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-6 col-xl-5 text-center">
            <p className="text-center h2 fw-bold mb-5 mx-1 mx-md-4 mt-4">
              {title}
            </p>

            <form onSubmit={handleSubmit} className="mx-1 mx-md-4" noValidate>

              <div className="d-flex flex-row align-items-center mb-4">
                <Icon.ChatLeftDots color="gold" className="me-3" size={30} />
                <div className="text-left mb-0">
                  {activeCard?.nativeText}
                </div>
              </div>

              {!success ? (
                <InputField
                  ref={inputRef}
                  icon={!isWrongAnswer
                    ? <Icon.ChatRightDots color="skyblue" className="me-3" size={30} />
                    : <Icon.XCircle color="coral" className="me-3" size={30} />}
                  type="text"
                  id="foreignText"
                  name="foreignText"
                  placeholder="Foreign word"
                  value={answer}
                  handleOnChange={handleOnChange}
                />
              ) : (
                <div className="d-flex flex-row align-items-center mb-4">
                  <Icon.CheckCircle color="cadetblue" className="me-3" size={30} />
                  <div className="text-left mb-0">
                    {activeCard?.foreignText}
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                <button type="submit" data-testid="save-button" className="btn btn-primary mx-2">Check</button>
                <button type="button" data-testid="back-button" className="btn btn-danger mx-2" onClick={handlePass}>Pass</button>
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
        </div>
      </div>
    </div>
  );
}

export default PlayCards;
