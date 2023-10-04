import React from 'react';
import './App.css';
import LoginScreen from './containers/Login';
import SearchMenu from './containers/Search';
import ResultsComponent from './containers/ResultsBox';

const buildGetQuery = (callback: (response: any) => void, direction: string, data: any = null) => {
  // const data = null;
  console.log(data);
  
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      callback(this.response);
    }
  });

  xhr.open("GET", `https://frontend-take-home-service.fetch.com/${direction}`);
  xhr.setRequestHeader("Authorization", "Bearer undefined");
  xhr.send(data);
}

function App() {
  const [searchText, setSearchText] = React.useState<string>("");
  const [authenticated, setAuthenticated] = React.useState<boolean>(false);
  const [results, setResults] = React.useState<string[]>([]);

  function getDogsBreads(authenticated: boolean) {
    if (authenticated) {
      buildGetQuery((response) => {
        const Json: string[] = JSON.parse(response);
        setResults(Json);
      }, 'dogs/breeds')
    }
  }

  function searchDogs(breed: string) {
    if (authenticated) {
      buildGetQuery((response) => {
        if (response === 'Not Found') {
          console.log("There is no dogs");
        }
        else{
          console.log(response);
        }
        // console.log(JSON.parse(response));
      },
      'dogs/search',
      {breeds: breed}
      )
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
            handleSearch={() => searchDogs(searchText)}
          />
          <ResultsComponent options={results} clickHandler={() => {}} />
        </div>
      }
    </div>
  );
}

export default App;
