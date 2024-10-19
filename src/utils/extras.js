export const caplitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// convert seconds to this format 80 minutes 20 seconds
export const secondsToHms = (d) => {
    d = Number(d);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return mDisplay + sDisplay;
}