import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import axios from "axios";
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import leo from "./images/sign_symbols/leo.png"
import pisces from "./images/sign_symbols/pisces.png"
import capricorn from "./images/sign_symbols/capricorn.png"
import sagittarius from "./images/sign_symbols/sagittarius.png"
import virgo from "./images/sign_symbols/virgo.png"
import cancer from "./images/sign_symbols/cancer.png"

import aquarius from "./images/sign_symbols/aquarius.png"
import aries from "./images/sign_symbols/aries.png"
import scorpio from "./images/sign_symbols/scorpio.png"
import taurus from "./images/sign_symbols/taurus.png"
import gemini from "./images/sign_symbols/gemini.png"
import libra from "./images/sign_symbols/libra.png"

//material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, Button, CardHeader, Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from '@mui/material/Link';
import Container from "@mui/material/Container";


import { getAPI } from "./utils/getAPI";
import { getDegreesForPlanets } from "./utils/getDegreesForPlanets";
import { combineDegreesAndReadings } from "./utils/combineDegreesAndReadings";

import { DatePickerField } from "./components/DatePicker/DatePicker";
import { MenuBar } from "./components/MenuBar/MenuBar";


import "react-datepicker/dist/react-datepicker.css";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {"Copyright © "}
      <Link color="inherit" href="https://www.facebook.com/zundalaapp/">
        Zundala's Facebook Page
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function capitalizeFirstLetter(string) {
  const cap = string.charAt(0).toUpperCase() + string.slice(1);
  return cap;
}

function App() {

  function validateHhMm(inputField) {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField);

    return isValid;
  }

  const validationSchema = Yup.object().shape({
    location: Yup.string().required('Location is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    time: Yup.string()
      .required('Time is required'),
    date: Yup.date().required('Date is required')
  });

  const getDateValuesFromString = (dateString) => {
    
    if(typeof dateString === "string" && dateString.length === 10){
      return {
        year: dateString.substring(6,10),
        month: dateString.substring(0,2),
        day: dateString.substring(3,5)
      }

    } else if(typeof dateString === "string" && dateString.length === 9){
      return {
        year: dateString.substring(5,9),
        month: dateString.substring(0,1),
        day: dateString.substring(2,4)
      }

    } else if(typeof dateString === "object") {
      //date string is something like: Sun Apr 18 1971 00:00:00 GMT-0600 (Central Standard Time)
      const dateObjToReturn = {
        year: dateString.getFullYear(),
        month: dateString.getMonth() + 1, //because january is returned as 0, December is 11...
        day: dateString.getDate()
      }
      return dateObjToReturn;
      
    } else {
      return {
        year: "NA",
        month: "NA",
        day: "NA"
      }
    }
    
    
  };

  const getTimeValuesFromString = (timeString) => {
    
    if(timeString.length === 5){
      return {
        hour: timeString.substring(0,2),
        minute: timeString.substring(3,5)
      }


    } else if(timeString.length === 4) {
      return {
        hour: timeString.substring(0,1),
        minute: timeString.substring(2,4)
      }
    } else {

      return {
        hour: "NA",
        minute: "NA",
      }
    }
  };
  
  const sendRequest = async (email, location, date, time, timezone) => {
    
    const dateValues = getDateValuesFromString(date);
    const timeValues = getTimeValuesFromString(time);

    const apiDict = getAPI();
    const fullAPIURL =
      apiDict.zundala_server_data + "?email="+email+"&location="+location+"&date="+date+"&time="+time+
        "&year="+dateValues.year+
        "&month="+dateValues.month+
        "&day="+dateValues.day+
        "&hour="+timeValues.hour+
        "&minute="+timeValues.minute+
        "&timezone="+timezone

    const response = await axios.get(fullAPIURL).catch((err) => {
        console.error(err)
    });

    if (response) {
      return response;
    } else {
      return [];
    }
  };

  const getImageForSign = (whichPlanet) => {
    switch (whichPlanet) {
      case "leo": 
        return leo;
      case "virgo": 
        return virgo;
      case "libra": 
        return libra;
      case "cancer": 
        return cancer;
      case "scorpio": 
        return scorpio;
      case "sagittarius": 
        return sagittarius;
      case "capricorn": 
        return capricorn;
      case "aquarius": 
        return aquarius;
      case "pisces": 
        return pisces;
      case "aries": 
        return aries;
      case "gemini": 
        return gemini;
      case "taurus": 
        return taurus;
      default: 
        return "https://upload.wikimedia.org/wikipedia/commons/f/fd/Sign_cusps.png"
    }
  }

  const createCardForDisplay = (house, degreeNumber, minutes, planet, quickDesc, fullDesc) => {
    return (
      <div className="card-wrapper">
        <Card key={capitalizeFirstLetter(planet)} className="card" sx={{ maxWidth: 600 }}>
        <CardHeader
          
          title={degreeNumber + "° " + capitalizeFirstLetter(house) + " " + minutes}
          subheader={capitalizeFirstLetter(planet)}
        />
        <CardActionArea>
          <CardMedia
            component="img"
            height="280"
            image={getImageForSign(house)}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {quickDesc}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              { fullDesc }
            </Typography>
          </CardContent>
          <CardActions>
            <div>
              <Button size="small">Share</Button>
            </div>
            <div>
              <Button size="small">Learn More</Button>
            </div>
          </CardActions>
        </CardActionArea>
      </Card>
    </div>
    )
  }

  const displaySigns = (signObject) => {
    const keys = Object.keys(signObject);

    
    if (keys && keys.length === 1) {
      if(!keys[0].includes("_minutes")) {
          
        
        const degreeNumber = signObject[keys[0]].data["Degree"];
        const quickDesc = signObject[keys[0]].data["Title Keywords"];
        const fullDesc = signObject[keys[0]].data["Interpretation"];
        const houseName = signObject[keys[0]]['house']
        const planet = keys[0];

        const minutes = signObject[keys[0]]['minutes']

        //TODO: filter out the $(planet)_minutes
        return (
          createCardForDisplay(houseName, degreeNumber, minutes, planet, quickDesc, fullDesc)
        )
      }
    }

    /*
    if (keys && keys.length === 1 && Array.isArray(signObject[keys[0]]) && signObject[keys[0]][0] && signObject[keys[0]][0]["Degree"]) {
      //console.log('ducky signObject[keys[0]][0]: ', signObject[keys[0]][0])
      
      const degreeNumber = signObject[keys[0]][0]["Degree"];
      const quickDesc = signObject[keys[0]][0]["Title Keywords"];
      const fullDesc = signObject[keys[0]][0]["Interpretation"];
      const houseName = signObject['house']
      return (
        createCardForDisplay(houseName, degreeNumber, keys[0], quickDesc, fullDesc)
      )
    }
    */

  }

  const [ test, setTest] = useState([]);
  const [ inputData, setInputData] = useState({})

  const [ isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchMyAPI() {
      if(inputData.email && inputData.location && inputData.date && inputData.time && inputData.timezone) {
        sendRequest(inputData.email, inputData.location, inputData.date, inputData.time, inputData.timezone).then((results => {

          const degreesObject = results && results.data ?  getDegreesForPlanets(results.data) : {};

          combineDegreesAndReadings(degreesObject).then((degreesAndReadings) => {
            setTest(degreesAndReadings);
          })
        }))
      } else {
        console.warn("No input data to use yet...")
      }
    }

    fetchMyAPI();

  }, [inputData])
  
  /*
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000)
  }, []);
  */

  const handleSubmit = (values,
    { setSubmitting }) => {
    setTimeout(() => {
     setSubmitting(false);
    }, 500);
   }
  
  return (
    <div className="App">
      <MenuBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="page-container">
          <div className="title-container">
            <Typography variant="h2" component="h2">Zundala Tester</Typography>
          </div>

          <div className="title-container">
            <Typography variant="h5" component="h1">
              Enter Your Birth Information Below to Obtain Your Zundala Readings
            </Typography>
          </div>

          <Box className="box-container">
            <Paper elevation={3} className="paper-container">
              <Formik
                validationSchema={validationSchema}
                initialValues={{ email: "youremail@gmail.com", location: "Little Rock, AR", date: "12/22/1994", time: "02:45" }}
                validate={(values) => {
                  
                  let dateObj = new Date(values.date);
                  const errors = {};
                  if (!values.email) {
                    errors.email = "Required";
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                  ) {
                    errors.email = "Invalid email address";
                  } else if(!validateHhMm(values.time)) {
                    errors.time = "Invalid time...";
                  } else if(isNaN(dateObj) || !dateObj) {
                    errors.date = "Invalid Date"
                  } else if (values.location && values.location.indexOf(',') <= 0){
                    errors.location = "Invalid location"
                  }
                  return errors;
                }}
                onSubmit={ (values, { setSubmitting }) => {

                    //alert(JSON.stringify(values, null, 2));
                    if(values && values.email && values.location && values.date && values.time) {
                      
                      //check if it is a valid date
                      let dateObj = new Date(values.date);
                      if(dateObj) {
                        
                        if(validateHhMm(values.time)) {
                          setInputData({ email: values.email, location: values.location, date: values.date, time: values.time, timezone: values.timezone})
                          setSubmitting(false);
                          /* code below works but does not wait...
                          sendRequest(values.email, values.location, values.date, values.time).then((results => {
                            console.log('ducky results from the server: ', results)
                            const degreesObject = results && results.data ?  getDegreesForPlanets(results.data) : {};
                            //alert(JSON.stringify(degreesObject))

                            combineDegreesAndReadings(degreesObject).then((degreesAndReadings) => {
                              //alert(degreesAndReadings);
                              console.log('setting test to: ', degreesAndReadings)
                              setTest(degreesAndReadings);
                              setSubmitting(false);
                            })
                          }))
                          */
                        } else {
                          console.warn("Invalid time entered... ", values.time)
                        }
                      } else {
                        console.warn('invalid date: ', dateObj)
                      }
                    } else {
                      alert("Error... did not send all required values (email, date, location, time)")
                      setSubmitting(false);
                    }

                    //call api (zundala & ephemeris reading...)

                }}
              >
                {({ isSubmitting, errors, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <label className="label-text" htmlFor="email">Email Address</label>
                      </Grid>
                      <Grid item xs={12}>
                        <Field type="email" name="email" />
                        <ErrorMessage name="email" component="div" />
                      </Grid>

                      <Grid item xs={12}>
                        <label className="label-text" htmlFor="location">City and State of Birth</label>
                      </Grid>

                      <Grid item xs={12}>
                        <Field type="text" name="location" />
                        <ErrorMessage name="location" component="div" />
                      </Grid>

                      <Grid item xs={12}>
                        <label className="label-text" htmlFor="time">Time of Birth</label>
                      </Grid>

                      <Grid item xs={12}>
                        <Field type="text" name="time" />
                      </Grid>

                      <Grid item xs={12}>
                        <label className="small-label-text">Please use Military Time (e.g. instead of 5:30pm, enter 17:30) </label>
                        <ErrorMessage name="time" component="div" />
                      </Grid>

                      <Grid item xs={12}>
                        <Field as="select" name="timezone">
                          <option value="none">Please Choose A Timezone Here</option>
                          <option value="eastern">Eastern U.S. (New York, Atlanta)</option>
                          <option value="central">Central U.S. (Chicago, Dallas)</option>
                          <option value="mountain">Mountain U.S. (Denver, Phoenix)</option>
                          <option value="western">Western U.S. (Los Angeles, Seattle)</option>
                        </Field>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <label className="label-text" htmlFor="date">Date of Birth</label>
                      </Grid>

                      <Grid item xs={12}>
                        <DatePickerField name="date" />
                        <ErrorMessage name="date" component="div" />
                      </Grid>

                      <Grid item xs={12}>
                        <button onClick={(event)=> {setIsLoading(true)}}type="submit" disabled={isSubmitting}>
                          Submit
                        </button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Paper>
          </Box>
          { isLoading && test && (test.length < 1) && (
            <div>
              <br />
              <CircularProgress size={40} />
            </div>
          )}
          { test && test.length > 0 && (
            <div className="card-container">
              <Typography className="results-header" variant="h3" component="h3">
                Below Are Your Zundala Readings
              </Typography>
              { test.map((el) => { return (
                displaySigns(el)
              )})}
            </div>
          )}
        </div>
      </header>
      <footer className={"footer"}>
        <Container maxWidth="sm">
          <Typography variant="body1">
            Thank you for using Zundala's Testing Website
          </Typography>
          <Copyright />
        </Container>
      </footer>
    </div>
  );
}

export default App;
