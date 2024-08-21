export const translateLongitudeString = (passedString) => {
    //receive input similar to: 28°20'9\"",
    //output: Number (would be 28 in the above example)
    const degreeNumberOnly = passedString.substring(0, passedString.indexOf("°"));
    return degreeNumberOnly;

}