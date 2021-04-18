/**
 * This task is to create an immutable javascript object
 * with a couple properties method to show the difference
 * between async series and parallel
 * @param {*} e 
 */
window.onload = (e) => {
    /**
     * Javascript Restaurant object
     * A function is also an object
     */
    const Restaurant = (() => {
        // Constructor
        function Restaurant() {
        }

        /**
         * Timer
         */
        let processingTime = 1000; // milliseconds

        /**
         * First task
         * @param {*} id 
         * @param {*} callback
         * @param {*} textarea: textarea element for logging
         * @returns 
         */
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

        /**
         * Second task
         * @param {*} id 
         * @param {*} callback
         * @param {*} textarea: textarea element for logging
         * @returns 
         */
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
        
        /**
         * Third task
         * @param {*} id 
         * @param {*} callback
         * @param {*} textarea: textarea element for logging
         * @returns 
         */
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

        /**
         * Public method for runner
         * @param {*} textarea 
         */
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

        /**
         * Public method for runner
         * @param {*} textarea 
         */
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

    // Make it inextensible
    Object.preventExtensions(Restaurant); // properties not extensible
    Object.isExtensible(Restaurant); // false

    // Run series
    let seriesEl = document.getElementById("seriesresult");

    const myResto1 = new Restaurant();
    myResto1.seriesRunner(seriesEl);
    
    // Run parallel
    let parallelEl = document.getElementById("parallelresult");

    const myResto2 = new Restaurant();
    myResto2.parallelRunner(parallelEl);
}