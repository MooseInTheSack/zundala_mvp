import axios from "axios";

import { getAPI } from "./getAPI";

const getCriticalDegreeForHouse = (houseName) => {
/*
Aries: 1, 13, and 25 degrees
Taurus: 2, 14, and 26 degrees
Gemini: 3, 15, and 27 degrees
Cancer: 4, 16, and 28 degrees
Leo: 5, 17, and 29 degrees
Virgo: 6 and 18 degrees
Libra: 7 and 19 degrees
Scorpio: 8 and 20 degrees
Sagittarius: 9 and 21 degrees
Capricorn: 10 and 22 degrees
Aquarius: 11 and 23 degrees
Pisces: 12 and 24 degrees
*/

}

const getHouseFromLongitude = (degreeNumber) => {
    if(degreeNumber < 30) {
        return "aries";
    } else if(degreeNumber < 60) {
        return "taurus";
    } else if(degreeNumber < 90) {
        return "gemini";
    } else if(degreeNumber < 120) {
        return "cancer";
    } else if(degreeNumber < 150) {
        return "leo";
    } else if(degreeNumber < 180) {
        return "virgo";
    } else if(degreeNumber < 210) {
        return "libra";
    } else if(degreeNumber < 240) {
        return "scorpio";
    } else if(degreeNumber < 270) {
        return "sagittarius";
    } else if(degreeNumber < 300) {
        return "capricorn";
    } else if(degreeNumber < 330) {
        return "aquarius";
    } else if(degreeNumber <= 360) {
        return "pisces";
    } else {
        return "none"
    }
}

const getMinutesForPlanet = (whichPlanet, degreesObject) => {
    if(!whichPlanet.includes("_minutes")) {
        const minutesKeyForPlanet = whichPlanet + "_minutes";
        if (degreesObject.hasOwnProperty(minutesKeyForPlanet)) {
            const minutesForPlanet = degreesObject[minutesKeyForPlanet];
            return minutesForPlanet;
        } else {
            console.error("Error getting minutes for planet");
            return "";
        }
        
    } else {
        return "";
    }
}

const sendRequest = async (whichSign) => {
    const apiDict = getAPI();
    const fullAPIURL =
      apiDict.zundala_server_readings + "?sign=" + whichSign;

    const response = await axios.get(fullAPIURL).catch((err) => {
        console.error(err)
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
        
        if(planet === "sirius" || planet.includes("_minutes")) {
            continue;
        }
        let degreeNumber = degreesObject[planet];
        let whichSign = getHouseFromLongitude(degreeNumber);

        let minutes = getMinutesForPlanet(planet, degreesObject);

        const result = await sendRequest(whichSign);
        if(result && result.data && result.data.data) {
            const arrayOfSignReadings = result.data.data
            
            //translate the 360 degree # to 30 degree
            const translatedTo30 = Number(degreesObject[planet]) % 30;

            if(typeof translatedTo30 === "number") {

                let whichReading = arrayOfSignReadings.find((readingToCheck) => Number(readingToCheck.Degree) === translatedTo30)

                //let stringToReturn = translatedTo30 + " Degree " + whichSign + ". " + whichReading;
                degreeWithReading.push({ [planet]:  { title: translatedTo30 + " Degree " + whichSign, minutes: minutes, house: whichSign, threeSixtyDegree: degreesObject[planet], data: whichReading}})
            } else {
                console.error("Error finding reading for degree")
            }
        } else {
            console.error("Error finding data for sign: ", whichSign)
        }
    }
    return degreeWithReading;

}