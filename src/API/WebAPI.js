const seededRandom = function (seed) {
    var m = 2**35 - 31;
    var a = 185852;
    var s = seed % m;
    return function () {
        return (s = s * a % m) / m;
    };
}

export const fetchAPI = function(date) {
    // FIX: Ensure the input is a Date object
    const validDate = typeof date === 'string' ? new Date(date) : date;

    if (!(validDate instanceof Date) || isNaN(validDate)) {
        console.error("fetchAPI was called with an invalid date.");
        return []; // Return an empty array or handle the error
    }

    let result = [];
    // let random = seededRandom(date.getDate());
    let random = seededRandom(validDate.getDate());

    for(let i = 17; i <= 23; i++) {
        if(random() < 0.5) {
            result.push(i + ':00');
        }
        if(random() < 0.5) {
            result.push(i + ':30');
        }
    }
    return result;
};

export const submitAPI = function(formData) {
    return true;
};