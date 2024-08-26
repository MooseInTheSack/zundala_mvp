import { translateLongitudeString } from "./translateLongitudeString";


export const getDegreesForPlanets = (ephemerisObject) => {
    //receive a giant array of plants with degree info, and return an object of each planet with associated degrees
    if(ephemerisObject && ephemerisObject.data && ephemerisObject.data.observed) {
        //console.log('ephemerisObject.data.observed: ', ephemerisObject.data.observed)
        const planetsDict = ephemerisObject.data.observed
        const dictToReturn = {};

        for (const planet in planetsDict) {
            //console.log(`${planet}: ${planetsDict[planet]['apparentLongitudeDms30']}`);
            dictToReturn[planet] = translateLongitudeString(planetsDict[planet]['apparentLongitudeDms30'])
        }

        return dictToReturn;
    } else {
        console.error("Insufficient data passed to getDegreesForPlanets method");
        return {};
    }
    
}