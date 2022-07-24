import { useContext, useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Alert from './Alert';
import TableItem from './TableItem';
import { AuthContext } from '../contexts/AuthContext';

import { CARDS_URL } from '../constants';

export default function CardsTable({ setCreateToggle }) {
  const { token } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function getCards() {
      try {
        const getHeader = new Headers();
        getHeader.append('Authorization', `Bearer ${token}`);
        const response = await fetch(CARDS_URL, {
          method: 'GET',
          headers: getHeader,
        });
        const cardObject = await response.json();
        setCards(cardObject.cards);
      } catch (error) {
        if (!error.response) {
          setAlertMessage('The server is unavailable. Try again later.');
        }
      }
    }
    getCards();
  }, [success]);

  return (
    <div className="col-md-12 col-lg-10 col-xl-9 text-center">
      <div className="col d-flex justify-content-center align-items-center mb-5">
        <button
          type="button"
          data-testid="create-button"
          className="btn btn-primary btn-md mb-3"
          onClick={() => setCreateToggle(true)}
        >
          Create new card
        </button>
        {(cards.length !== 0) && <Link to="/play-cards" className="btn btn-warning mb-3 mx-4">Play with cards</Link>}
      </div>
      <Table striped>
        <thead>
          <tr>
            <th>Native words</th>
            <th>Foreign words</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <TableItem
              key={card._id}
              cardId={card._id}
              nativeText={card.nativeText}
              foreignText={card.foreignText}
              token={token}
              setAlertMessage={setAlertMessage}
              setSuccess={setSuccess}
            />
          ))}
        </tbody>
      </Table>
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
