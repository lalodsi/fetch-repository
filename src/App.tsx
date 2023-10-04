import React from 'react';
import './App.css';
import LoginScreen from './containers/Login';
import SearchMenu from './containers/Search';
import ResultsComponent from './containers/ResultsBox';

function App() {
  const[searchText, setSearchText] = React.useState<string>("");
  const [authenticated, setAuthenticated] = React.useState<boolean>(false);
  const[results, setResults] = React.useState<string[]>([]);

  function getDogsBreads(authenticated: boolean) {
    if (authenticated) {
      const data = null;
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          const Json: string[] = JSON.parse(this.response);
          setResults(Json);
        }
      });

      xhr.open("GET", "https://frontend-take-home-service.fetch.com/dogs/breeds?=");
      xhr.setRequestHeader("Authorization", "Bearer undefined");
      xhr.send(data);
    }
  }

  return (
    <div className="App">
      {
        !authenticated &&
        <LoginScreen setAutenticated={setAuthenticated} />
      }
      {
        authenticated &&
        <div>
          Autenticado
          <SearchMenu
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={() => getDogsBreads(authenticated)}
          />
          <ResultsComponent options={results} clickHandler={() => {}} />
        </div>
      }
    </div>
  );
}

export default App;
