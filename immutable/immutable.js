window.onload = (e) => {

    const Restaurant = (() => {
        // Constructor
        function Restaurant() {
        }

        let processingTime = 1000; // milliseconds
        let takingOrder = async (id, callback, textarea) => {
            let promise = new Promise((res, rej) => {
                const start = Date.now();
                setTimeout(() => {
                    const millis = Date.now() - start;
                    res("Taking order "+id+" done in "+millis+"ms!")
                }, processingTime);
            });
            // wait until taking order done
            let result = await promise;
            callback(result, textarea);
            return result;
        }
        let cooking = async (id, callback, textarea) => {
            let promise = new Promise((res, rej) => {
                const start = Date.now();
                setTimeout(() => {
                    const millis = Date.now() - start;
                    res("Cooking order "+id+" done "+millis+"ms!")
                }, processingTime);
            });
            // wait until cooking done
            let result = await promise;
            callback(result, textarea);
            return result;
        }
        let serving = async (id, callback, textarea) => {
            let promise = new Promise((res, rej) => {
                const start = Date.now();
                setTimeout(() => {
                    const millis = Date.now() - start;
                    res("Serving order "+id+" done "+millis+"ms!");
                }, processingTime);
            });
            // wait until serving done
            let result = await promise;
            callback(result, textarea);
            return result;
        }
        let showResult = (result, textarea) => {
            //console.log(result);
            textarea.value += result+"\n";
        }
        Restaurant.prototype.seriesRunner = async (textarea) => {
            textarea.value += "Running restaurant in series:\n\n";
            const start = Date.now();
            let results = [];
            results.push(await takingOrder(1, showResult, textarea));
            results.push(await takingOrder(2, showResult, textarea));
            results.push(await cooking(1, showResult, textarea));
            results.push(await cooking(2, showResult, textarea));
            results.push(await serving(1, showResult, textarea));
            results.push(await serving(2, showResult, textarea));
            textarea.value += "\n";
            textarea.value += "["+results+"]\n";
            const millis = Date.now() - start;
            textarea.value += "\nAll done in "+millis+"ms\n\n";
        }
        Restaurant.prototype.parallelRunner = async (textarea) => {
            textarea.value += "Running restaurant in parallel:\n\n";
            const start = Date.now();
            let takeOrder1 = takingOrder(1, showResult, textarea);
            let takeOrder2 = takingOrder(2, showResult, textarea);
            let cooking1 = cooking(1, showResult, textarea);
            let cooking2 = cooking(2, showResult, textarea);
            let serving1 = serving(1, showResult, textarea);
            let serving2 = serving(2, showResult, textarea);
            let results = await Promise.all([takeOrder1,takeOrder2,cooking1,cooking2,serving1,serving2]);
            textarea.value += "\n";
            textarea.value += "["+results+"]\n";
            const millis = Date.now() - start;
            textarea.value += "\nAll done in "+millis+"ms\n\n";
        }

        return Restaurant;
    })();
    Object.preventExtensions(Restaurant); // proeprties not extensible
    Object.isExtensible(Restaurant); // false

    
    let seriesEl = document.getElementById("seriesresult");

    const myResto1 = new Restaurant();
    myResto1.seriesRunner(seriesEl);
    
    let parallelEl = document.getElementById("parallelresult");

    const myResto2 = new Restaurant();
    myResto2.parallelRunner(parallelEl);
}