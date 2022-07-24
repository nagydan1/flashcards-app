import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import PlayCards from '../components/PlayCards';
import { DEMOCARDS_URL } from '../constants';

function HomePage() {
  const { user } = useContext(AuthContext);
  const [hasDeck, setHasDeck] = useState(true);

  return (
    <main>
      <section className="vh-100">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-start h-100">
            <div className="col-lg-12 col-xl-11">
              <p className="text-center h1 fw-bold mx-1 mb-4 mx-md-4 mt-4">
                Flash Cards
                <br />
                The vocabulary app
              </p>
              {!user
                ? (
                  <>
                    <div className="col d-flex justify-content-center align-items-center mb-5">
                      <Link to="/login" className="btn btn-warning mb-3 mx-4">Login</Link>
                      <Link to="/register" className="btn btn-dark mb-3 mx-4">Register</Link>
                    </div>
                    {hasDeck
                      && (
                        <PlayCards
                          resourceURL={DEMOCARDS_URL}
                          title="Try the app: type in the words in Spanish!"
                          setHasDeck={setHasDeck}
                        />
                      )}
                  </>
                ) : (
                  <div className="col d-flex justify-content-center align-items-center mb-5">
                    <Link to="/manage-cards" className="btn btn-warning mb-3 mx-4">Create cards</Link>
                    <Link to="/play-cards" className="btn btn-dark mb-3 mx-4">Play with cards</Link>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
