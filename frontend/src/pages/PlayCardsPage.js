import PlayCards from '../components/PlayCards';
import { CARDS_URL } from '../constants';

function PlayCardsPage() {
  return (
    <main>
      <section className="my-3 my-lg-4">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <PlayCards
                resourceURL={CARDS_URL}
                title="Type in the translation"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PlayCardsPage;
