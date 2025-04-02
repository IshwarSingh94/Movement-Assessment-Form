// Google Sheets API configuration
const SPREADSHEET_ID = '1QCUTnTy5hJ96uD8VSUauO44P5FcwNp9xYb1yTfK-BWA';
const SHEET_NAME = 'NewAssessment';

function submitQuiz() {
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
    
    // Calculate score based on number of checked items
    let totalCheckboxes = document.querySelectorAll('input[type="checkbox"]').length;
    let checkedBoxes = Object.values(answers).reduce((acc, curr) => acc + curr.length, 0);
    
    // Display the score in popup
    document.getElementById('result').innerText = `${name}, your assessment results:`;
    document.getElementById('scoreNumber').innerText = checkedBoxes;
    
    // Show popup
    const popup = document.getElementById('resultPopup');
    popup.style.display = 'flex';
    
    // Save to Google Sheets
    saveToGoogleSheets(name, answers, checkedBoxes, totalCheckboxes);
}

function saveToGoogleSheets(name, answers, score, total) {
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

    // Using Google Sheets API
    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:H`,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [rowData]
        }
    }).then(function(response) {
        console.log('Data saved successfully');
    }).catch(function(error) {
        console.error('Error saving data:', error);
        alert('Error saving data to Google Sheets. Please try again.');
    });
}

function closePopup() {
    const popup = document.getElementById('resultPopup');
    popup.style.display = 'none';
}

// Close popup when clicking outside
document.getElementById('resultPopup').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// Initialize Google Sheets API
function initClient() {
    gapi.client.init({
        apiKey: 'AIzaSyAK2NPy4CLM4aBjBu64xU8R3uPXl7bV33I', // You'll need to replace this with your actual API key
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: 'https://www.googleapis.com/auth/spreadsheets'
    }).then(function() {
        console.log('Google Sheets API initialized');
    }).catch(function(error) {
        console.error('Error initializing Google Sheets API:', error);
    });
}

// Load the Google Sheets API
gapi.load('client', initClient); 
