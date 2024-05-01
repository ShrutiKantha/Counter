import React, { useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BaseUrl= 'https://famous-zuccutto-6c2bd5.netlify.app/';

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { count: action.count, myCount: action.myCount };  
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'INCREMENT_MY_COUNT':
      return { ...state, myCount: state.myCount + 1 };
    case 'DECREMENT_MY_COUNT':
      return { ...state, myCount: state.myCount - 1 };
    default:
      return state;
  }
};

const Home = () => {
  const { state } = useContext(CounterContext);

  return (
    <div>
      <h1>Counter : {state.count}</h1>
      <h1>MyCounter : {state.myCount}</h1>
      <Link to="/counter">Counter</Link><br></br>
      <Link to="/MyCounter">myCounter</Link>
    </div>
  );
};

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/counter`);
      dispatch({ type: 'SET', count: response.data.count, myCount: response.data.myCount });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post(`${BaseUrl}/api/counter/increment`);
      dispatch({ type: 'INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post(`${BaseUrl}/api/counter/decrement`);
      dispatch({ type: 'DECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <button onClick={incrementCounter}>Increment Count</button>
      <button onClick={decrementCounter}>Decrement Count</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const incrementMyCount = useCallback(async () => {
    try {
      await axios.post(`${BaseUrl}/api/counter/Myincrement`);
      dispatch({ type: 'INCREMENT_MY_COUNT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementMyCount = useCallback(async () => {
    try {
      await axios.post(`${BaseUrl}/api/counter/Mydecrement`);
      dispatch({ type: 'DECREMENT_MY_COUNT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>MyCounter</h2>
      <p>MyCount: {state.myCount}</p>
      <button onClick={incrementMyCount}>Increment MyCount</button>
      <button onClick={decrementMyCount}>Decrement MyCount</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, myCount: 0 });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/mycounter">MyCounter</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mycounter" element={<MyCounter />} />
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
