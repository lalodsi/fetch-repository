import React from 'react';
import './App.css';
import LoginScreen from './containers/Login';
import SearchMenu from './containers/Search';
import ResultsComponent from './containers/ResultsBox';
import Loading from './components/LoadingComponent';
import { Dog } from './types/Dog';
import { DogsSearchProps } from './types/DogsSearch';
import { Location } from './types/Location';
import ButtonComponent from './components/ButtonComponent';
import Result from './containers/ResultsBox/Result';

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
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [menu, setMenu] = React.useState<string>("");
  const [selectedDogs, setSelectedDogs] = React.useState<Dog[]>([]);
  const [match, setMatch] = React.useState<Dog>();

  async function searchDogsID(parameters: SearchParameters, link: string) {
    if (authenticated) {
      const raw = await requestIDs(link, parameters)
      const destructure: DogsSearchProps = JSON.parse(raw);
      setResults(destructure)
      const rawDogsData = await buildPostQuery('/dogs/?=', destructure.resultIds);
      const Dogs: Dog[] = JSON.parse(rawDogsData);
      await searchDogsLocations(Dogs)
      setDogsFound(Dogs);
    }
  }

  async function searchDogsLocations(dogs: Dog[]) {
    if (authenticated) {
      const zipCodes = dogs.map(dog => dog.zip_code);
      const LocationsRaw = await buildPostQuery('/locations', zipCodes)
      console.log(LocationsRaw);
      const locations: Location[] = JSON.parse(LocationsRaw);
      setLocations(locations);
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

  const handleSelectDog = (data: {index: number, dog: Dog}) => {
    console.log(`You have selected the ${data.index} dog, is ${data.dog.name}!`);
    setSelectedDogs([
      ...selectedDogs,
      data.dog
    ])
  }

  const handleSetMenu = (menuText: string) => {
    setMenu(menuText)
  }

  const handleGenerateMatch = async () => {
    console.log("Resultados");
    const ids = selectedDogs.map(dog => dog.id);
    const response = await buildPostQuery("/dogs/match", ids)
    
    const matchId: {match: string} = JSON.parse(response)
    console.log(response );
    const rawDogData = await buildPostQuery('/dogs/?=', [matchId.match]);
    console.log(rawDogData);
    const DogsData: Dog[] = JSON.parse(rawDogData);
    // await searchDogsLocations(DogsData)
    setMatch(DogsData[0])
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
          <ButtonComponent text='search' handleClick={() => handleSetMenu("search")} />
          <ButtonComponent text='list' handleClick={() => handleSetMenu("show")} />
          {
            menu === "search" &&
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
                locations={locations}
                options={dogsFound}
                handleNext={handleNext}
                handlePrev={handlePrev}
                clickHandler={handleSelectDog}
              />
            </>
          }
          {
            menu === "show" &&
            <>
              {
                selectedDogs.map(dog => <Result value={dog} handleClick={() => {}}/>)
              }
              <ButtonComponent text='generate match' handleClick={handleGenerateMatch} />
              {
                match &&
                <Result value={match} handleClick={() => {}}/>
              }
            </>
          }
        </>
      }
    </div>
  );
}

export default App;
