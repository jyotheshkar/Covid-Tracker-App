

import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@mui/material";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    const url = country === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`;
    fetch(url, { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error('Country request failed');
      return response.json();
    }).then((data) => {
      if (controller.signal.aborted) return;
      setCountryInfo(data);
      const coordinates = data.countryInfo;
      if (country === 'worldwide' || !Number.isFinite(coordinates?.lat) || !Number.isFinite(coordinates?.long)) {
        setMapCenter({ lat: 34.80746, lng: -40.4796 }); setMapZoom(3);
      } else { setMapCenter([coordinates.lat, coordinates.long]); setMapZoom(4); }
    }).catch(() => { if (!controller.signal.aborted) { setCountryInfo({}); setError('Country totals are unavailable.'); } });
    return () => controller.abort();
  }, [country]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('https://disease.sh/v3/covid-19/countries', { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error('Countries request failed');
      return response.json();
    }).then((data) => {
      if (!Array.isArray(data)) throw new Error('Invalid country list');
      if (controller.signal.aborted) return;
      setCountries(data.filter((item) => item.countryInfo?.iso2).map((item) => ({ name:item.country, value:item.countryInfo.iso2, flag:<img src={item.countryInfo.flag} alt='' className='flag'/> })));
      setMapCountries(data); setTableData(sortData(data));
    }).catch(() => { if (!controller.signal.aborted) setError('Country list is unavailable.'); });
    return () => controller.abort();
  }, []);
  const onCountryChange = (event) => setInputCountry(event.target.value);

  return (
    <div className="app">
      <div className="app__left">
        {error && <p role="alert">{error}</p>}
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>{country.flag} {country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
            className="leftbox"
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent className="rightcard">
          <div className="app__information">
            <h3>Reported Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;