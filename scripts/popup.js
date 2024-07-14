const formElement = document.querySelector("#workout-entry-form");
const alertPlaceholder = document.getElementById('alert-placeholder');
const datePicker = document.getElementById('date-picker');

const todaysDate = new Date().toISOString().split('T')[0];

const appendAlert = (message, type) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '</div>'
  ].join('');
  alertPlaceholder.append(wrapper);
}

window.addEventListener('load', () => {
    datePicker.value = todaysDate;
});

formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formElement);
    
    chrome.storage.local.get('customCalendar')
    .then((currentValue) => {
        let newValue = currentValue['customCalendar'] || currentValue;
        const date = formData.getAll("date-picker");
        newValue[date] = formData.getAll("workout-type");
        chrome.storage.local.set({ 'customCalendar': newValue })
        .then(() => {
            console.log(`Value is set for key=${date} value=${newValue[date]}`);
            appendAlert('Saved data!', 'success');
        })
        .catch((error) => {
            console.log(`Error occured while trying to set key=${date} value=${formData.getAll("workout-type")} error=${error}`);
            appendAlert('Uh oh! Some error occured :(', 'warning');
        });
    });
    
})