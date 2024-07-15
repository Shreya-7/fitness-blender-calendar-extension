// take data from local storage and make changes to the calendar UI

window.addEventListener('load', () => {
    // we need a timeout because the target calendar elements are dynamically loaded and not even DOMContentLoaded event is fired
    this.setTimeout(() => {
        chrome.storage.local.get('customCalendar')
        .then((currentValue) => {
            currentValue = currentValue['customCalendar'];    
            for (const [date, workouts] of Object.entries(currentValue)) {
                console.log(`${date}: ${workouts}`);

                if (workouts == false) {
                    continue;
                }

                // the target calendar element for the day
                const dayElementPattern = `a[href="/my/calendar/day/${date}"]`;
                const dayElement = document.querySelector(dayElementPattern);

                // add a "check mark" only if not present already for an FB workout
                if (!dayElement.querySelector(".activity-icon")) {
                    const outerDiv = document.createElement("div");
                    outerDiv.classList.add("activity-icon");
                    outerDiv.classList.add("hover-hide");
                    outerDiv.innerHTML = [
                        `<div class="icon-type workout-complete">`,
                        `<i class="material-symbols-outlined fill" aria-hidden="true" style="background: linear-gradient(to bottom right, #3d97ce 0%, #666666 100%);-webkit-text-fill-color: transparent;background-clip: text">check_circle</i>`,
                        `</div>`,
                    ].join('');
                    dayElement.querySelector(".date-header").insertAdjacentElement("afterend", outerDiv);
                }

                // create the workout container element only if not present already
                if (!dayElement.querySelector(".schedule-slots")) {
                    const outerDiv = document.createElement("div");
                    outerDiv.classList.add("schedule-slots");

                    for(i=0; i<5; i++) {
                        const emptySlotElement = createSlotElement("is-empty");
                        outerDiv.appendChild(emptySlotElement);
                    }

                    dayElement.querySelector(".date-header").insertAdjacentElement("afterend", outerDiv);
                }

                workouts.forEach(workout => {
                    const workoutElement = createSlotElement("is-workout");
                    const formattedWorkout = workout.charAt(0).toUpperCase() + workout.slice(1);
                    workoutElement.innerHTML = `<span>${formattedWorkout}</span>`

                    const emptySlotElement = dayElement.querySelector(".schedule-slots .is-empty");
                    dayElement.querySelector(".schedule-slots").replaceChild(workoutElement, emptySlotElement);
                })
            }
        })
        .catch((error) => {
            console.log(`Some error occured while trying to fetch details from localStorage, ${error}`);
        });
    }, 1000);
    
});

function createSlotElement(type) {
    const workoutElement = document.createElement("div");
    workoutElement.classList.add("slot");
    workoutElement.classList.add("partial-content");
    workoutElement.classList.add(type);

    return workoutElement;
}

