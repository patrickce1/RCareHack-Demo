import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";
import { useState, useEffect } from "react";

// const fetch = require('node-fetch')

// async function fetchData() {

//   try {
//     const response = await fetch("http://localhost:8001")
//     const body = await response.text();
//     console.log(body)
//   }
//   catch (error) {
//     console.error("Error fetching data:", error)
//   }

// }

// fetchData()



// import './App.css';
import './styles.css';

function App() {
  const [response, setResponse] = useState('Answer1');
  const [bitbalance, setbitbalance] = useState(10);
  const [stable, setStable] = useState("Stable coin")

  const handleChangeBit = async () => {
    try {

      const bitChange = await fetch('http://localhost:8001/todos')
      const data = await bitChange.json();
      setbitbalance(data);
    }
    catch {

      console.error("Patrick error");

    }
  }


  const handleInputChange = async (event) => {
    // Handle user input here
    const userInput = event.target.value;
    console.log("this is user input", userInput);
    try {
      console.log("In handleinputchange");
      console.log(response, "this is response");
      const fetchResponse = await fetch('http://localhost:8001/updatePrompt', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userInput })
      });

      console.log("put has been sent");


      console.log("before await respons");
      const data = await fetchResponse.json();



      console.log("this is data", data);

      if (data.response !== undefined) {
        setResponse(data.response);
        console.log('Response from server:', data.response);
      } else {
        console.error('Invalid server response:', data);
      }
    } catch (error) {
      console.error('Error:', error);


      // window.location.reload();
      // Handle response from server
    }
  };

  const handleStableChange = async (event) => {
    const userInput = event.target.value;
    try {

      const fetchResponse = await fetch('http://localhost:8001/stable', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userInput })
      });

      console.log("put has been sent");


      console.log("before await respons");
      const data = await fetchResponse.json();



      console.log("this is data", data);

      if (data.response !== undefined) {
        setStable(data.response);
        console.log('Response from server:', data.response);
      } else {
        console.error('Invalid server response:', data);
      }
    } catch (error) {
      console.error('Error:', error);


      // window.location.reload();
      // Handle response from server
    }

  }
  // Function to generate random percentage between -5% to 5%
  const generateRandomPercentage = () => {
    return (Math.random() * 10 - 5).toFixed(2);
  };

  // Dummy data for currency rates
  const cryptocurrencies = [
    {
      "name": "Bitcoin",
      "symbol": "BTC",
      "value": 64229.31,
      "change": 0.56
    },
    {
      "name": "Ethereum",
      "symbol": "ETH",
      "value": 3324.85,
      "change": 0.21
    },
    {
      "name": "Tether",
      "symbol": "USDT",
      "value": 1.00,
      "change": -0.12
    },
    {
      "name": "BNB",
      "symbol": "BNB",
      "value": 552.83,
      "change": -0.08
    },
    {
      "name": "Solana",
      "symbol": "SOL",
      "value": 172.36,
      "change": -0.40
    },
    {
      "name": "XRP",
      "symbol": "XRP",
      "value": 0.6174,
      "change": 0.93
    },
    {
      "name": "USD Coin",
      "symbol": "USDC",
      "value": 1.00,
      "change": -0.07
    },
    {
      "name": "Dogecoin",
      "symbol": "DOGE",
      "value": 0.1701,
      "change": 6.98
    },
    {
      "name": "Cardano",
      "symbol": "ADA",
      "value": 0.6301,
      "change": 1.65
    },
    {
      "name": "Avalanche",
      "symbol": "AVAX",
      "value": 53.52,
      "change": -0.05
    }
  ];

  return (
    <div className="container">
      <header>
        <h1>Cryptonite</h1>
        <p>Your ultimate crypto destination</p>
      </header>
      <main>
        <section className="welcome">
          <h2>Welcome</h2>
        </section>
        <hr /> {/* Horizontal line to divide sections */}
        <section className="user-section">
          <div className="user-balance">
            <h2>User Balance</h2>
            <p>$ balance: $100</p>
            <p>Stable Coin balance:</p>
            <ul>
              <li>Bitcoin - {bitbalance}</li>
              <li>{stable} - 1.2</li>
              <input type="text" id="userQuestion" placeholder="Type your question" />
              <button onClick={() => handleStableChange({ target: { value: document.getElementById("userQuestion").value } })}>Submit</button>

            </ul>
          </div>
          <div className="transactions">
            <h2>Transactions</h2>
            <label htmlFor="recipient">Recipient:</label>
            <input type="text" id="recipient" placeholder="Type recipient" />

            <div className="transaction-box">
              <label htmlFor="sentCurrency">Sent Currency:</label>
              <input type="text" id="sentCurrency" placeholder="Type sent currency" />
            </div>
            <div className="transaction-box">
              <label htmlFor="amount">Amount:</label>
              <input type="number" id="amount" placeholder="Type amount" />
            </div>
            <button>Enter</button>
          </div>
        </section>
        <hr /> {/* Horizontal line to divide sections */}
        <section className="currency-rates">
          <div className="currency-rates-box">
            <h2>Currency Rates</h2>
            <ul>
              {cryptocurrencies.map(({ name, value, change }) => (
                <li key={name}>
                  {name} - {value.toFixed(2)} USD {"("}{change.toFixed(2)} {"%)"}
                </li>
              ))}
            </ul>
          </div>
          <div className="chatbot">
            <h2>Chatbot</h2>
            <div className="chat-input">
              <label htmlFor="userQuestion">Your Question:</label>
              <input type="text" id="userQuestion" placeholder="Type your question" />
              <button onClick={() => handleInputChange({ target: { value: document.getElementById("userQuestion").value } })}>Submit</button> {/* Button to trigger API call */}
              <button onClick={() => handleChangeBit()}>Pat button</button>
            </div>
            <div className="chat-response">
              <p>{response}</p>
            </div>
          </div>
        </section>

        <section className="cta">
          <h2>Join Cryptonite now and unlock the future of finance!</h2>
          <button>Sign Up</button>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 Cryptonite. All rights reserved.</p>
      </footer>
    </div >
  );
}


export default App;
