import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Grid from '@mui/material/Grid';
import axios from "axios";

import { getAPI } from "./utils/getAPI";
import { getDegreesForPlanets } from "./utils/getDegreesForPlanets";
import { translateDegreesToReadings } from "./utils/translateDegreesToReadings";
import { combineDegreesAndReadings } from "./utils/combineDegreesAndReadings";

import { DatePickerField } from "./components/DatePicker/DatePicker";


import "react-datepicker/dist/react-datepicker.css";

function App() {
  const sendRequest = async (email, location, date, time) => {
    const apiDict = getAPI();
    const fullAPIURL =
      apiDict.zundala_server_data + "?email="+email+"&location="+location+"&date="+date+"&time="+time;

    const response = await axios.get(fullAPIURL).catch((err) => {
        console.log(err)
    });

    if (response) {
      return response;
    } else {
      return [];
    }
  };

//const arr = [{ "sun": [ { "Degree": "0", "Title Keywords": "Impulsive and Ambitious", "Interpretation": "Can be quick to act, sometimes without thinking things through, particularly when young. Feeling secure in social positions will provide greater access to intuition. Leads with gut responses which can look like bluster. Quieting the mind allows choices to serve higher goals.  ", "Comments": "er" } ] }, { "mercury": [ { "Degree": "4", "Title Keywords": "Honorable and Devoted", "Interpretation": "Careful, smart, and hard-working. Will push for something they believe in and may not compromise if they feel a sense of duty. Has an affinity for the spirit of nature, fantasy, and creative imagination. Can seem quirky and may have out-there interests. Explorer of alternative realms of consciousness.", "Comments": "" } ] }, { "moon": [ { "Degree": "15", "Title Keywords": "Witty Truth-Teller", "Interpretation": "Reflective, with a desire to help others. Hidden strengths lie beneath the surface, which are not to be underestimated. Ability to deal with the public, and see social and economic patterns and trends. Capable of hard work and endurance. Likely interested in ancient rituals or texts.", "Comments": "original interpretation now replaced by Stephanie's version. Reflective, detached outlook on life. Mature, dignified, business-like way of relating to others. Ability to deal with the public. Capable of hard work and endurance." } ] }, { "venus": [ { "Degree": "15", "Title Keywords": "Cheerful and Romantic ", "Interpretation": "Resilient and caring with a positive outlook. Able to make amends and clean up one's mistakes. It may not come easily, but being willing to take a decisive position will help to avoid or resolve complicated situations. Romantic involvements are a big focus.", "Comments": "ER" } ] }, { "mars": [ { "Degree": "1", "Title Keywords": "Magnanimous and Exotic", "Interpretation": "Appreciation of beautiful moments. A generous and loyal friend with a need to balance relationship demands with personal ambitions. Intelligent and self-confident with an interest in sensory occupations like art, gardening, or essential oils. International enterprise and travel are indicated. Likely to collect mementos of past experiences.", "Comments": "ER" } ] }, { "jupiter": [ { "Degree": "2", "Title Keywords": "Diplomatic and Kind ", "Interpretation": "Visionary, spiritual, intellectual, and practical. Values working hard for a dream and is generally disciplined to do so. Studious, cultivating a wisdom that is magnetic to others. Attracts a wide range of friends and alliances. Known for taking the high road when it comes to conflict.", "Comments": "" } ] }, { "pluto": [ null ] }, { "saturn": [ { "Degree": "7", "Title Keywords": "Intellectual and Persistent", "Interpretation": "Self-sufficient. May enjoy solitary work or pursuits and often excels at research or other studious activities. Spiritual and self-aware, with the ability to see worldly situations from a detached perspective. Able to generate confidence and happiness for themselves that earns respect in social situations.", "Comments": "" } ] }, { "uranus": [ { "Degree": "24", "Title Keywords": "Kind-Hearted and Passionate", "Interpretation": "Strong and willing to fight for personal beliefs. May be learning to temper reactions and de-escalate conflicts. Sports or other physical activities could offer stress relief. Tends to face problems head on. May be an artist or art afficianado, and particularly drawn to photography.", "Comments": "" } ] }, { "neptune": [ { "Degree": "22", "Title Keywords": "Enthusiastic and Service-Oriented", "Interpretation": "Energetic and sometimes impulsive, yet with a quick mind that is easily focused. An intuitive thinker who can help others to put mind over matter. Spiritual practices provide optimal mental and physical wellness. May be a healer or someone who transforms life challenges into an opportunity to help others.", "Comments": "" } ] }, { "chiron": [ { "Degree": "27", "Title Keywords": "Cooperative and Balanced", "Interpretation": "Has a cheerful demeanor and attracts good friends. Able to turn dreams into fame or money. Likely to have two great loves. May not be faced with very much hardship in life. Well-read “renaissance” person with lots of potential, but can be distracted by multiple pursuits at once. ", "Comments": "ER" } ] }, { "sirius": [ { "Degree": "11", "Title Keywords": "Open-Minded and Fortunate", "Interpretation": "Carries self with warmth and ease. Calm and generous, seemingly charmed life. May have prosperous family connections. Prefers life of study over romantic involvement. Impish and fun-loving with an impressionable and dreamy side. Enjoys socializing and knows how to relax. Confidence and freedom in personal pursuits. ", "Comments": "ER" } ] } ]

  const [ test, setTest] = useState([]);
  const [ inputData, setInputData] = useState({})

  useEffect(() => {
    //const zundala_data = translateDegreesToReadings("cancer", 2);
    //console.log('ducky zundala_data: ', zundala_data)
  }, [])

  useEffect(() => {
    console.log("Test changed...");
    console.log("Test: ", test)
    console.log("Test length: ", test.length)
  }, [test])

  useEffect(() => {
    console.warn("inside of inputData useEffect!!!")
    async function fetchMyAPI() {
      if(inputData.email && inputData.location && inputData.date && inputData.time) {
        sendRequest(inputData.email, inputData.location, inputData.date, inputData.time).then((results => {
          console.log('ducky results from the server: ', results)
          const degreesObject = results && results.data ?  getDegreesForPlanets(results.data) : {};
          //alert(JSON.stringify(degreesObject))

          combineDegreesAndReadings(degreesObject).then((degreesAndReadings) => {
            //alert(degreesAndReadings);
            console.log('setting test to: ', degreesAndReadings)
            setTest(degreesAndReadings);
          })
        }))
      } else {
        console.warn("No input data to use yet...")
      }
    }

    fetchMyAPI();

  }, [inputData])
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div>
          <h1>Zundala Tester</h1>
          <p>Test</p>
          { test && (
            <div>
              { test.map((el) => {return (<p>{Object.keys(el)[0]}</p>)})}
            </div>
          )}
          
          <Formik
            initialValues={{ email: "", location: "", date: "", time: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              return errors;
            }}
            onSubmit={ (values, { setSubmitting }) => {

                //alert(JSON.stringify(values, null, 2));
                if(values && values.email && values.location && values.date && values.time) {
                  setInputData({ email: values.email, location: values.location, date: values.date, time: values.time})
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
                  alert("Error... did not send all required values (email, date, location, time)")
                  setSubmitting(false);
                }

                //call api (zundala & ephemeris reading...)

            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <label className="label-text" htmlFor="email">Email Address</label>
                    <Field type="email" name="email" />
                    <ErrorMessage name="email" component="div" />
                  </Grid>

                  <Grid item xs={12}>
                    <label className="label-text" htmlFor="location">City and State of Birth</label>
                    <Field type="text" name="location" />
                  </Grid>

                  <Grid item xs={12}>
                    <label className="label-text" htmlFor="time">Time of Birth</label>
                    <Field type="text" name="time" />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <label className="label-text" htmlFor="date">Date of Birth</label>
                    <DatePickerField name="date" />
                  </Grid>
                  <Grid item xs={12}>
                    <button type="submit" disabled={isSubmitting}>
                      Submit
                    </button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      </header>
    </div>
  );
}

export default App;
