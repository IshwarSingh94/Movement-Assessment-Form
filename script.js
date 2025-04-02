// Google Sheets API configuration
const SPREADSHEET_ID = '1QCUTnTy5hJ96uD8VSUauO44P5FcwNp9xYb1yTfK-BWA';
const SHEET_NAME = 'NewAssessment';
const CLIENT_ID = '1023590062256-rcuj8srgfl08fm0pasobv750v3696n7s.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAK2NPy4CLM4aBjBu64xU8R3uPXl7bV33I';

let isApiInitialized = false;
let tokenClient;

// Initialize Google Identity Services
function initializeGoogleIdentity() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        callback: handleTokenResponse
    });
}

// Handle the token response
function handleTokenResponse(response) {
    if (response.error !== undefined) {
        console.error('Error getting token:', response.error);
        return;
    }
    
    // Save the access token
    gapi.client.setToken({
        access_token: response.access_token,
    });
    console.log('User authenticated successfully');
    isApiInitialized = true;
}

// Initialize Google Sheets API
function initClient() {
    console.log('Initializing Google Sheets API');
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
    }).then(function() {
        console.log('Google Sheets API initialized successfully');
        initializeGoogleIdentity();
    }).catch(function(error) {
        console.error('Error initializing Google Sheets API:', error);
        isApiInitialized = false;
        alert('Error initializing Google Sheets API. Please check the console for details.');
    });
}

function submitQuiz() {
    console.log('Form submitted');
    const name = document.getElementById('name').value;
    if (!name) {
        alert("Please enter your name.");
        return;
    }
    
    let answers = {};
    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        if (input.checked) {
            if (!answers[input.name]) {
                answers[input.name] = [];
            }
            answers[input.name].push(input.value);
        }
    });
    
    console.log('Answers collected:', answers);
    
    // Calculate score based on number of checked items
    let totalCheckboxes = document.querySelectorAll('input[type="checkbox"]').length;
    let checkedBoxes = Object.values(answers).reduce((acc, curr) => acc + curr.length, 0);
    
    console.log('Score calculated:', checkedBoxes, 'out of', totalCheckboxes);
    
    // Display the score in popup
    document.getElementById('result').innerText = `${name}, your assessment results:`;
    document.getElementById('scoreNumber').innerText = checkedBoxes;
    
    // Show popup
    const popup = document.getElementById('resultPopup');
    popup.style.display = 'flex';
    
    // Save to Google Sheets
    if (isApiInitialized) {
        saveToGoogleSheets(name, answers, checkedBoxes, totalCheckboxes);
    } else {
        console.error('Google Sheets API not initialized');
        alert('Please sign in with Google first.');
    }
}

function saveToGoogleSheets(name, answers, score, total) {
    console.log('Attempting to save to Google Sheets');
    const timestamp = new Date().toLocaleString();
    const rowData = [
        timestamp,
        name,
        answers.squat ? answers.squat.join(', ') : '',
        answers.hinge ? answers.hinge.join(', ') : '',
        answers.push ? answers.push.join(', ') : '',
        answers.pull ? answers.pull.join(', ') : '',
        answers.single_leg ? answers.single_leg.join(', ') : '',
        `${score} / ${total}`
    ];

    console.log('Row data prepared:', rowData);

    // Using Google Sheets API
    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:H`,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [rowData]
        }
    }).then(function(response) {
        console.log('Data saved successfully:', response);
        alert('Assessment saved successfully!');
    }).catch(function(error) {
        console.error('Error saving data:', error);
        alert('Error saving data to Google Sheets. Please try again.');
    });
}

function closePopup() {
    const popup = document.getElementById('resultPopup');
    popup.style.display = 'none';
}

function resetForm() {
    // Clear all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear the name input
    document.getElementById('name').value = '';
    
    // Close the popup if it's open
    closePopup();
    
    // Show a brief success message
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = 'Form reset successfully!';
    document.querySelector('.container').appendChild(message);
    
    // Remove the message after 2 seconds
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Close popup when clicking outside
document.getElementById('resultPopup').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// Load the Google Sheets API
gapi.load('client', initClient);

// Initialize Google Identity Services
google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: function(response) {
        if (response.credential) {
            tokenClient.requestAccessToken();
        }
    }
});

// Render the Google Sign-In button
google.accounts.id.renderButton(
    document.getElementById('googleSignInDiv'),
    { theme: 'outline', size: 'large' }
); 
