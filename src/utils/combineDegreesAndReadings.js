import axios from "axios";

import { getAPI } from "./getAPI";

const planetsToSigns = {
    sun: "leo",
    mercury: "virgo",
    venus: "libra",
    moon: "cancer",
    mars: "scorpio",
    jupiter: "sagittarius",
    saturn: "capricorn",
    uranus: "aquarius",
    neptune: "pisces",
    pluto: "aries",
    chiron: "leo", //??? Placeholder ???
    sirius: "leo" //??? Placeholder ???
}

const sendRequest = async (whichSign) => {
    const apiDict = getAPI();
    const fullAPIURL =
      apiDict.zundala_server_readings + "?sign=" + whichSign;

    const response = await axios.get(fullAPIURL).catch((err) => {
        console.log(err)
    });

    if (response) {
      return response;
    } else {
      return [];
    }
  };

//works but it isn't returning the data in time to app.js... it's returning undefined...
export const combineDegreesAndReadings = async (degreesObject) => {
    //input is a dict that looks like <planet>: <degree string>
    const degreeWithReading = [];
    for( const planet in degreesObject) {
        let whichSign = planetsToSigns[planet];
        
        const result = await sendRequest(whichSign);
        if(result && result.data && result.data.data) {
            const arrayOfSignReadings = result.data.data
            const degreeNumber = degreesObject[planet];
            let whichReading = arrayOfSignReadings.find((readingToCheck) => readingToCheck.Degree === degreeNumber)
            degreeWithReading.push({ [planet]: [whichReading] })
        } else {
            console.error("Error finding data for sign: ", whichSign)
        }
    }
    //console.log('ducky degreeWithReading: ', degreeWithReading)
    return degreeWithReading;

}