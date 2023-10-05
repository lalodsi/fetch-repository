import React from 'react';
import './App.css';
import LoginScreen from './containers/Login';
import SearchMenu from './containers/Search';
import ResultsComponent from './containers/ResultsBox';
import Loading from './components/LoadingComponent';
import { Dog } from './types/Dog';
import { DogsSearchProps } from './types/DogsSearch';

const buildGetQuery = (direction: string, data: any = null): Promise<string> => {
  return new Promise<string>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        res(this.response)
      }
    });
  
    xhr.open("GET", `https://frontend-take-home-service.fetch.com${direction}`);
    xhr.setRequestHeader("Authorization", "Bearer undefined");
    xhr.send(data);
  })
}

const buildPostQuery = (direction: string, data: any = null): Promise<string> => {
  return new Promise<string>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        // console.log(data);
        console.log(this.responseText);
        res(this.responseText)
        
      }
    });
  
    xhr.open("POST", `https://frontend-take-home-service.fetch.com${direction}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer undefined");
    xhr.send(JSON.stringify(data));
  })
}

function App() {
  const [searchText, setSearchText] = React.useState<string>("");
  const [loading, setLoading] = React.useState<string>("");
  const [authenticated, setAuthenticated] = React.useState<boolean>(false);
  const [results, setResults] = React.useState<DogsSearchProps>();
  const [dogsFound, setDogsFound] = React.useState<Dog[]>([]);

  // function getDogsBreads(authenticated: boolean) {
  //   if (authenticated) {
  //     buildGetQuery('dogs/breeds')
  //   }
  // }

  async function searchDogsID(breed: string, link: string) {
    if (authenticated) {
      // console.log(link);
      
      const raw = await buildGetQuery(link, {breeds: breed})
      const destructure: DogsSearchProps = JSON.parse(raw);
      setResults(destructure)
      const rawDogsData = await buildPostQuery('/dogs/?=', destructure.resultIds);
      const Dogs: Dog[] = JSON.parse(rawDogsData);
      setDogsFound(Dogs);
    }
  }

  const handleNext = () => {
    if (results?.next) {
      searchDogsID(searchText, results?.next)
    }
  }
  const handlePrev = () => {
    if (results?.prev) {
      searchDogsID(searchText, results?.prev)
    }
  }

  const handleSearch = async (link: string) => {
    setLoading("Loading")
    await searchDogsID(searchText, link);
    setLoading("")
  }

  return (
    <div className="App">
      {
        !authenticated &&
        <LoginScreen setAutenticated={setAuthenticated} />
      }
      {
        loading &&
        <Loading />
      }
      {
        authenticated &&
        <>
          Autenticado
          <SearchMenu
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={() => handleSearch('/dogs/search')}
          />
          <ResultsComponent
            results={results}
            options={dogsFound}
            handleNext={handleNext}
            handlePrev={handlePrev}
            clickHandler={() => {}}
          />
        </>
      }
    </div>
  );
}

export default App;
