import React from 'react';
import './App.css';
import LoginScreen from './containers/Login';
import SearchMenu from './containers/Search';
import ResultsComponent from './containers/ResultsBox';
import Loading from './components/LoadingComponent';
import { Dog } from './types/Dog';
import { DogsSearchProps } from './types/DogsSearch';
import MultiSelectionComponent from './components/MultiselectionComponent';

interface SearchParameters{
  breeds?: string[],
  zipCodes?: string[],
  ageMin?: number,
  ageMax?: number,
}

const requestIDs = (direction: string, data: SearchParameters): Promise<string> => {
  return new Promise<string>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        res(this.response)
      }
    });

    // Get data
    const breeds = data.breeds;
    const ageMin = data.ageMin;
    const ageMax = data.ageMax;
    let breedsURL = ''
    if (breeds) {
      const arrayValues = breeds.map(breed => `breeds=${breed}`)
      breedsURL += arrayValues.join('&')
    }

    let ageMinURL = ''
    if (ageMin) {
      ageMinURL += `ageMin=${ageMin}`
    }

    let ageMaxURL = ''
    if (ageMax) {
      ageMaxURL += `ageMax=${ageMax}`
    }

    const arrayTotal = [breedsURL,ageMinURL,ageMaxURL].filter(url => url)
    const totalURL = arrayTotal.join('&')
    console.log(`https://frontend-take-home-service.fetch.com${direction}?${totalURL}`);
    
    xhr.open("GET", `https://frontend-take-home-service.fetch.com${direction}?${totalURL}`);
    xhr.setRequestHeader("Authorization", "Bearer undefined");
    xhr.send();
  })
}

const buildPostQuery = (direction: string, data: any = null): Promise<string> => {
  return new Promise<string>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        // console.log(data);
        // console.log(this.responseText);
        res(this.responseText)
        
      }
    });
  
    xhr.open("POST", `https://frontend-take-home-service.fetch.com${direction}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer undefined");
    xhr.send(JSON.stringify(data));
  })
}

const requestBreads = (): Promise<string> => {
  return new Promise<string>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        res(this.response)
      }
    });

    xhr.open("GET", `https://frontend-take-home-service.fetch.com/dogs/breeds`);
    xhr.setRequestHeader("Authorization", "Bearer undefined");
    xhr.send();
  })
}

function App() {
  const [searchText, setSearchText] = React.useState<string>("");
  const [loading, setLoading] = React.useState<string>("");
  const [authenticated, setAuthenticated] = React.useState<boolean>(false);
  const [results, setResults] = React.useState<DogsSearchProps>();
  const [dogsFound, setDogsFound] = React.useState<Dog[]>([]);
  const [breads, setBreads] = React.useState<string[]>([]);
  const [breadsSelection, setBreadsSelection] = React.useState<string[]>([]);
  const [minValue, setMinValue] = React.useState<number|undefined>(undefined);
  const [maxValue, setMaxValue] = React.useState<number|undefined>(undefined);

  async function searchDogsID(parameters: SearchParameters, link: string) {
    if (authenticated) {
      const raw = await requestIDs(link, parameters)
      const destructure: DogsSearchProps = JSON.parse(raw);
      setResults(destructure)
      const rawDogsData = await buildPostQuery('/dogs/?=', destructure.resultIds);
      const Dogs: Dog[] = JSON.parse(rawDogsData);
      setDogsFound(Dogs);
    }
  }

  async function getBreads() {
    const raw = await requestBreads();
    console.log("Getting breads");
    try {
      const destructured: string[] = JSON.parse(raw)
      setBreads(destructured)
    } catch (error) {
      setBreads([])
    }
  }

  React.useEffect(() => {
    if (authenticated) {
      getBreads();
    }
  }, [authenticated])


  const handleNext = () => {
    if (results?.next) {
      const data: SearchParameters = {
      }
      searchDogsID(data, results?.next)
    }
  }
  const handlePrev = () => {
    if (results?.prev) {
      const data: SearchParameters = {
      }
      searchDogsID(data, results?.prev)
    }
  }

  const handleSearch = async (link: string) => {
    setLoading("Loading")
    const data: SearchParameters = {
      breeds: breadsSelection,
      ageMin: minValue,
      ageMax: maxValue
    }
    console.log(data);
    
    await searchDogsID(data, link);
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
          <SearchMenu
            breads={breads}
            min={minValue}
            max={maxValue}
            setMin={setMinValue}
            setMax={setMaxValue}
            setBreadsSelection={setBreadsSelection}
            handleSearch={() => handleSearch('/dogs/search')}
          />
          {
            results !== undefined &&
            <p>Total {results.total} results</p>
          }
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
