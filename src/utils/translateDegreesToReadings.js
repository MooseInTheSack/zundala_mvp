import axios from "axios";

import { getAPI } from "./getAPI";

export const translateDegreesToReadings = async (whichSign, degreeNumber) => {
    const apiDict = getAPI();
    const readingsURL = apiDict.zundala_server_readings

    const fullAPIURL =
        readingsURL + "?sign="+whichSign;

    const response = await axios.get(fullAPIURL).catch((err) => {
        console.error(err)
    });

    if (response && response.data && response.data.data) {
        const foundItem = response.data.data.find((degree) => degree.Degree === degreeNumber.toString());
        return foundItem;
        
    } else {
        return [];
    }

    //return zundala_data
}

