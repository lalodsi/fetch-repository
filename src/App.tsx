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
import TabComponent from './components/TabComponent';

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
      if (this.status === 401) {
        rej(this.responseText)
      }
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
      if (this.status === 401) {
        rej(this.responseText)
      }
      if (this.readyState === this.DONE) {
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
      if (this.status === 401) {
        rej(this.responseText)
      }
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
  const [loading, setLoading] = React.useState<string>("");
  const [authenticated, setAuthenticated] = React.useState<boolean>(false);
  const [results, setResults] = React.useState<DogsSearchProps>();
  const [dogsFound, setDogsFound] = React.useState<Dog[]>([]);
  const [breads, setBreads] = React.useState<string[]>([]);
  const [breadsSelection, setBreadsSelection] = React.useState<string[]>([]);
  const [minValue, setMinValue] = React.useState<number|undefined>(undefined);
  const [maxValue, setMaxValue] = React.useState<number|undefined>(undefined);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [menu, setMenu] = React.useState<string>("Search");
  const [selectedDogs, setSelectedDogs] = React.useState<Dog[]>([]);
  const [match, setMatch] = React.useState<Dog>();

  async function searchDogsID(parameters: SearchParameters, link: string) {
    if (authenticated) {
      try {
        const raw = await requestIDs(link, parameters)
        const destructure: DogsSearchProps = JSON.parse(raw);
        setResults(destructure)
        const rawDogsData = await buildPostQuery('/dogs/?=', destructure.resultIds);
        const Dogs: Dog[] = JSON.parse(rawDogsData);
        await searchDogsLocations(Dogs)
        setDogsFound(Dogs);
      } catch (error) {
        setAuthenticated(false)
      }
    }
  }

  async function searchDogsLocations(dogs: Dog[]) {
    if (authenticated) {
      try {
        const zipCodes = dogs.map(dog => dog.zip_code);
        const LocationsRaw = await buildPostQuery('/locations', zipCodes)
        const locations: Location[] = JSON.parse(LocationsRaw);
        setLocations(locations);
      } catch (error) {
        setAuthenticated(false)
      }
    }
  }

  async function getBreads() {
    try {
      const raw = await requestBreads();
      const destructured: string[] = JSON.parse(raw)
      setBreads(destructured)
    } catch (error) {
      setBreads([])
      setAuthenticated(false)
    }
  }

  React.useEffect(() => {
    if (authenticated) {
      getBreads();
    }
    setLoading("")
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
    setDogsFound([])
    const data: SearchParameters = {
      breeds: breadsSelection,
      ageMin: minValue,
      ageMax: maxValue
    }
    await searchDogsID(data, link);
    setLoading("")
  }

  const handleSelectDog = (data: {index: number, dog: Dog}) => {
    const IDs = selectedDogs.map(dog => dog.id);
    const realIndex = IDs.indexOf(data.dog.id)
    if (realIndex !== -1) {
      const selectedList = [...selectedDogs]
      selectedList.splice(realIndex, 1)
      setSelectedDogs([
        ...selectedList
      ])
    }
    else{
      setSelectedDogs([
        ...selectedDogs,
        data.dog
      ])
    }
    setMatch(undefined)
  }

  const handleSetMenu = (menuText: string) => {
    setMenu(menuText)
  }

  const handleGenerateMatch = async () => {
    setLoading("Generating a match")
    const ids = selectedDogs.map(dog => dog.id);
    const response = await buildPostQuery("/dogs/match", ids)
    const matchId: {match: string} = JSON.parse(response)
    const rawDogData = await buildPostQuery('/dogs/?=', [matchId.match]);
    const DogsData: Dog[] = JSON.parse(rawDogData);
    // await searchDogsLocations(DogsData)
    setMatch(DogsData[0])
    setLoading("")
  }
  const tabOptions = match? [
    "Search",
    "Show Results",
    "Match",
  ] : [
    "Search",
    "Show Results",
  ]

  return (
    <div className="App">
      {
        loading &&
        <>
          <Loading />
          <p>{loading}</p>
        </>
      }
      {
        !authenticated &&
        <LoginScreen
          setAutenticated={setAuthenticated}
          setLoading={setLoading}
        />
      }
      {
        authenticated &&
        <>
          <TabComponent handleClick={handleSetMenu} options={tabOptions} current={menu} />
          {
            menu === "Search" &&
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
                <p className='Message'>
                  Total {results.total} friendly results!
                  Click on a dog to add it to your favourite list
                </p>
              }
              <ResultsComponent
                results={results}
                selectedDogs={selectedDogs}
                locations={locations}
                options={dogsFound}
                handleNext={handleNext}
                handlePrev={handlePrev}
                clickHandler={handleSelectDog}
              />
            </>
          }
          {
            menu === "Show Results" &&
            <>
              {
                match &&
                <div className='Message'>
                  We have a new match for you!
                  Check the new Match section
                </div>
              }
              <div className='ResultBox col-9 col-s-6'>
                {
                  selectedDogs.map(dog => <Result className='Result_Selected col-5 col-s-4' selected value={dog} handleClick={() => {}}/>)
                }
              </div>
              {
                (!match && selectedDogs.length === 0) && 
                <p className='Message'>
                  You haven't selected any dog. Go to search section and select your next friend ❤️
                </p>
              }
              {
                (!match && selectedDogs.length !== 0) && 
                <ButtonComponent text='generate match' handleClick={handleGenerateMatch} />
              }
            </>
          }
          {
            menu === "Match" && match &&
            <>
              <div className='Message'>
                This is your new friend!
              </div>
              <div className='ResultBox col-9 col-s-6'>
                <Result className='Result_Selected col-5 col-s-4' selected value={match} handleClick={() => {}}/>
              </div>
            </>
          }
        </>
      }
    </div>
  );
}

export default App;
