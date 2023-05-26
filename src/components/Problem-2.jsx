import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import css from './Problem-2.module.scss';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const Problem2 = () => {
  const navigate = useNavigate();

  return (
    <div className='container'>
      <div className='row justify-content-center mt-5'>
        <h4 className='text-center text-uppercase mb-5'>Problem-2</h4>

        <div className='d-flex justify-content-center gap-3'>
          <button
            className='btn btn-lg btn-outline-primary'
            type='button'
            onClick={() => navigate('/problem-2/all')}
          >
            All Contacts
          </button>
          <button
            className='btn btn-lg btn-outline-warning'
            type='button'
            onClick={() => navigate('/problem-2/us')}
          >
            US Contacts
          </button>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export const Modal = () => {
  const [isEven, setIsEven] = useState(false);
  const [api, { setQuery, nextPage }] = useContactData();
  const [activeContact, setActiveContact] = useState(null);
  const props = useSearch(setQuery);

  function handleScroll(e) {
    const target = e.target;

    const scrollBottom = target.scrollTop + target.clientHeight;
    if (scrollBottom === target.scrollHeight) {
      nextPage();
    }
  }

  const results = useMemo(() => {
    const contacts = api.data ?? [];
    const step1 = isEven
      ? contacts.filter((_, i) => {
          const number = i + 1;
          return number !== 0 && number % 2 === 0;
        })
      : contacts;

    if (api.type === 'us') {
      return step1.filter(({ country }) => country.name === 'United States');
    }

    return step1;
  }, [api.type, api.data, isEven]);

  return (
    <Dialog className={css.dialog} onScroll={handleScroll}>
      <div className={css.wrapper}>
        <div className={css.header}>
          <div className={css.onlyEven}>
            <label htmlFor='only-even'>Only even</label>
            <input
              id='only-even'
              type='checkbox'
              checked={isEven}
              onChange={() => setIsEven((p) => !p)}
            />
          </div>

          <div>
            <Link className={css.buttonA} to='/problem-2/all'>
              All Contacts
            </Link>
            <Link className={css.buttonB} to='/problem-2/us'>
              US Contacts
            </Link>
            <Link className={css.buttonC} to='..'>
              Close
            </Link>
          </div>
        </div>

        <div className={css.search}>
          <input
            className='rounded p-2 border border-primary form-control'
            type='text'
            placeholder='Search any contact here...'
            {...props}
          />
        </div>

        <div className={css.content}>
          {api.isLoading ? (
            'Loading contacts...'
          ) : (
            <table className={css.table}>
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Phone</th>
                  <th>Country</th>
                </tr>

                {results.map((contact) => {
                  const { id, phone, country } = contact;
                  return (
                    <tr
                      key={id}
                      className={css.pointer}
                      onClick={() => setActiveContact(contact)}
                    >
                      <td>{id}</td>
                      <td>{phone}</td>
                      <td>{country.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {activeContact && (
        <NestedContact
          contact={activeContact}
          close={() => setActiveContact(false)}
        />
      )}
    </Dialog>
  );
};

const NestedContact = ({ contact, close }) => {
  return (
    <Dialog className={css.nestedDialog}>
      <div className={css.nestedHeader}>
        <h4>{contact.phone}</h4>
        <button className={css.buttonC} onClick={close}>
          Close
        </button>
      </div>

      <p>Phome: {contact.phone}</p>
      <p>Country: {contact.country.name}</p>

      <br />

      <p>Eos vitae et distinctio dolor a modi fugit deleniti reiciendis?</p>
      <p>Tenetur eos nesciunt fugit neque minus natus reiciendis dicta cum.</p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Unde, atque.
      </p>
      <p>
        Fuga voluptas quod quibusdam voluptatum minus laboriosam maxime
        excepturi eum.
      </p>
      <p>
        Assumenda ullam neque aliquid recusandae corrupti deserunt nihil
        quibusdam impedit.
      </p>
    </Dialog>
  );
};

const initialUrl = 'https://contact.mediusware.com/api/contacts/?format=json';
function useContactData() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(initialUrl);
  const type = useLocation().pathname.split('/').at(-1).toLowerCase();

  async function loadData(url, { resetPage = false, useLoading = true } = {}) {
    useLoading && setIsLoading(true);
    const res = await fetch(url);
    const data = await res.json();
    useLoading && setIsLoading(false);

    setNextPageUrl(data.next);
    resetPage
      ? setData(data.results)
      : setData((prev) => [...prev, ...data.results]);
  }

  useEffect(() => {
    loadData(initialUrl);
  }, []);

  return [
    { isLoading, data, loadData, type },
    {
      nextPage() {
        nextPageUrl && loadData(nextPageUrl, { useLoading: false });
      },
      setQuery(query) {
        loadData(initialUrl + `&search=${query}`, { resetPage: true });
      },
    },
  ];
}

function useSearch(onChange) {
  const [_search, _setSearch] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(_search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [_search]);

  useEffect(() => {
    onChange(search);
  }, [search]);

  return {
    value: _search,
    onChange: (e) => _setSearch(e.target.value),
    onKeyDown: (e) => e.key === 'Enter' && setSearch(_search),
  };
}

const Dialog = (props) => {
  const ref = useRef();

  useLayoutEffect(() => {
    ref.current.close();
    ref.current.showModal();
  }, []);

  return <dialog {...props} ref={ref} />;
};

export default Problem2;
