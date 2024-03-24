import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';


function App() {
  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   axios.get("/Users/user1/documents/test/testapp/server/data") // Assuming your Express backend is running on the same host
  //     .then(response => setData(response.data))
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);

  return (
    <div>
      <h1>My App</h1>
      {JSON.stringify(axios.get("https://localhost:4000/api/data"))
      }
      {"hi"}
      {/* {data && <pre>{JSON.stringify(data, null, 2)}</pre>} */}
    </div>
  );
}
{/* <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React {(axios.get('/api/data')).test}
        </a>
      </header>
    </div> */}

export default App;
