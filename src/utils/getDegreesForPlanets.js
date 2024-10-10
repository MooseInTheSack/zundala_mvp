import { translateLongitudeString } from "./translateLongitudeString";

const translateMinutesToString = (apparentLongitudeDms360) => {
    //receive input similar to: 28°20'9\"",
    //output: String (would be 20'9 in the above example)
    return apparentLongitudeDms360.split('°')[1];
}

export const getDegreesForPlanets = (ephemerisObject) => {
    //receive a giant array of plants with degree info, and return an object of each planet with associated degrees
    if(ephemerisObject && ephemerisObject.data && ephemerisObject.data.observed) {
        //console.log('ephemerisObject.data.observed: ', ephemerisObject.data.observed)
        const planetsDict = ephemerisObject.data.observed
        const dictToReturn = {};

        for (const planet in planetsDict) {
            //console.log(`${planet}: ${planetsDict[planet]['apparentLongitudeDms30']}`);
            dictToReturn[planet] = translateLongitudeString(planetsDict[planet]['apparentLongitudeDms360']);
            
            //get the minutes too...
            const keyName = planet + "_minutes"
            dictToReturn[keyName] = translateMinutesToString(planetsDict[planet]['apparentLongitudeDms360'])
        }

        return dictToReturn;
    } else {
        console.error("Insufficient data passed to getDegreesForPlanets method");
        return {};
    }
    
}