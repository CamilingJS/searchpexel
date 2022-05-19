//Debouncing an input: Waiting for some time to pass after the last event to actually do something 
const debounce = (func, delay = 1000) => {
    let timeoutId; 
    return(...args) => {
        if(timeoutId){
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay)
    };
}