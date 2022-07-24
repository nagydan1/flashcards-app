import { useState } from 'react';
import CardsTable from '../components/CardsTable';
import CardForm from '../components/CardForm';

function ManageCardsPage() {
  const [createToggle, setCreateToggle] = useState(false);
  return (
    <main>
      <section className="my-3 my-lg-4">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black rounded-25px">
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    {createToggle
                      ? <CardForm setCreateToggle={setCreateToggle} />
                      : <CardsTable setCreateToggle={setCreateToggle} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ManageCardsPage;
