import React , {useState , useEffect} from 'react';
import './App.css';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InfoBox from './InfoBox';
import Map from './Map';
import {Card , CardContent} from '@mui/material';
import Table from './Table';
import { sortData } from './util';
import LineGraph from './LineGraph';


const App = () => {
//  "https://disease.sh/v3/covid-19/countries"
const [countries , setCountries ] = useState([]);
const [country , setCountry] = useState('Worldwide');
const [countryInfo , setCountryInfo] = useState({});
const [tableData , setTableData ] = useState([]);


useEffect(() => {
  fetch("https://disease.sh/v3/covid-19/all")
  .then(response => response.json())
  .then(data => {
    setCountryInfo(data)
  })
},[]);

useEffect( () => {
  const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then((response) => response.json())      // i should try something over here
    .then((data) => {
      const countries = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
        flag: <img src={country.countryInfo.flag} alt="/" className="flag" />,
       
      }));
     const sortedData = sortData(data);
      setTableData(sortedData);
      setCountries(countries);
    });
  };
getCountriesData(countries)
} ,[]);

const onCountryChange = async (event) => {
  const countryCode = event.target.value;
  setCountry(countryCode);

  const url = countryCode === 'Worldwide' ? "https://disease.sh/v3/covid-19/all" 
  : `https://disease.sh/v3/covid-19/countries/${countryCode}` ;

  await fetch(url)
  .then(response => response.json())
  .then(data => {
    setCountry(countryCode);
     setCountryInfo(data);
  })
}
console.log("country info leak " , countryInfo )
  return (
    <div className="app">
      <div className='app__left'>
      <div className='app__header' >
      <h1 className='covidtitle'>COVID-19-TRACKER</h1>
      <FormControl className="app__dropdown" >
        <Select varient="outined" value={country} onChange={onCountryChange}  className="select" >
        <MenuItem value="Worldwide" className="text" >Worldwide</MenuItem>
          {countries.map( country => (
            <MenuItem value={country.value} > {country.flag} {country.name}</MenuItem>
          ) )}

      
        </Select> 
      </FormControl>
      </div>

      <div  className='app__stats'>
        <InfoBox  title="Coronavirus Cases"  
        cases={countryInfo.todayCases} 
        total={countryInfo.cases}
        />

        <InfoBox  title="Recovered" 
        cases={countryInfo.todayRecovered} 
        total={countryInfo.recovered} />

        <InfoBox  title="Deaths"
         cases={countryInfo.todayDeaths} 
         total={countryInfo.deaths}/>
   
      </div>    
       
        <Map />
        </div>
<Card className='app__right'>
<CardContent className="rightbrown">
  <h3>Live Cases by Country</h3>
  
 <Table countries={tableData} />
 <h3>Worldwide New Cases</h3>
      
        <LineGraph />
        
</CardContent>

</Card>

    </div>
  )
}

export default App