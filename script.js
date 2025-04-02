    // Google Sheets API configuration
    const SPREADSHEET_ID = '1QCUTnTy5hJ96uD8VSUauO44P5FcwNp9xYb1yTfK-BWA';
    const SHEET_NAME = 'NewAssessment';
    const CLIENT_ID = '1023590062256-rcuj8srgfl08fm0pasobv750v3696n7s.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyAK2NPy4CLM4aBjBu64xU8R3uPXl7bV33I';

    let isApiInitialized = false;
    let tokenClient;
    let isSignInInProgress = false;

    // Show status message to user
    function showStatusMessage(message, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `status-message ${isError ? 'error' : 'success'}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Initialize Google Identity Services
    function initializeGoogleIdentity() {
        try {
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/spreadsheets',
                callback: handleTokenResponse
            });
            console.log('Google Identity Services initialized successfully');
        } catch (error) {
            console.error('Error initializing Google Identity Services:', error);
            showStatusMessage('Error initializing Google Sign-In. Please refresh the page.', true);
        }
    }

    // Handle the token response
    function handleTokenResponse(response) {
        if (response.error !== undefined) {
            console.error('Error getting token:', response.error);
            showStatusMessage('Error signing in with Google. Please try again.', true);
            isSignInInProgress = false;
            return;
        }
        
        try {
            // Save the access token
            gapi.client.setToken({
                access_token: response.access_token,
            });
            console.log('User authenticated successfully');
            isApiInitialized = true;
            isSignInInProgress = false;
            showStatusMessage('Successfully signed in with Google!');
        } catch (error) {
            console.error('Error setting access token:', error);
            showStatusMessage('Error completing sign-in. Please try again.', true);
            isSignInInProgress = false;
        }
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
            showStatusMessage('Error initializing Google Sheets API. Please refresh the page.', true);
        });
    }

    // Handle Google Sign-In
    function handleGoogleSignIn() {
        if (isSignInInProgress) {
            showStatusMessage('Sign-in already in progress. Please wait...');
            return;
        }

        isSignInInProgress = true;
        showStatusMessage('Initiating Google Sign-In...');
        
        try {
            tokenClient.requestAccessToken();
        } catch (error) {
            console.error('Error requesting access token:', error);
            showStatusMessage('Error starting sign-in process. Please try again.', true);
            isSignInInProgress = false;
        }
    }

    function submitQuiz(event) {
        if (event) {
            event.preventDefault(); // Prevent form from submitting normally
        }
        console.log('Form submitted');
        
        // Check if user is signed in
        if (!isApiInitialized) {
            showStatusMessage('Please sign in with Google first to submit your assessment.', true);
            return;
        }

        const name = document.getElementById('name').value;
        if (!name) {
            showStatusMessage('Please enter your name.', true);
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
        const popup = document.getElementById('resultPopup');
        const resultText = document.getElementById('result');
        const scoreNumber = document.getElementById('scoreNumber');
        
        if (resultText && scoreNumber && popup) {
            resultText.innerText = `${name}, your assessment results:`;
            scoreNumber.innerText = checkedBoxes;
            popup.style.display = 'flex';
            
            // Save to Google Sheets
            saveToGoogleSheets(name, answers, checkedBoxes, totalCheckboxes);
        } else {
            console.error('Popup elements not found');
            showStatusMessage('Error displaying results. Please try again.', true);
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
            showStatusMessage('Assessment saved successfully!');
        }).catch(function(error) {
            console.error('Error saving data:', error);
            showStatusMessage('Error saving data to Google Sheets. Please try again.', true);
        });
    }

    function closePopup() {
        const popup = document.getElementById('resultPopup');
        if (popup) {
            popup.style.display = 'none';
        }
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
        
        // Show success message
        showStatusMessage('Form reset successfully!');
    }

    // Initialize event listeners when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, setting up event listeners');
        
        // Add form submit handler
        const form = document.getElementById('assessmentForm');
        if (form) {
            console.log('Form found, adding submit event listener');
            form.addEventListener('submit', submitQuiz);
        } else {
            console.error('Form not found!');
        }

        // Add submit button click handler as a backup
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            console.log('Submit button found, adding click event listener');
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                submitQuiz();
            });
        } else {
            console.error('Submit button not found!');
        }

        // Add reset button handler
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            console.log('Reset button found, adding click event listener');
            resetBtn.addEventListener('click', resetForm);
        } else {
            console.error('Reset button not found!');
        }

        // Add popup close handler
        const popup = document.getElementById('resultPopup');
        if (popup) {
            console.log('Popup found, adding click event listener');
            popup.addEventListener('click', function(e) {
                if (e.target === this) {
                    closePopup();
                }
            });
        } else {
            console.error('Popup not found!');
        }
    });

    // Load the Google Sheets API
    gapi.load('client', initClient);

    // Initialize Google Identity Services - REMOVED DUPLICATE INITIALIZATION
    // The button is already rendered in the HTML with the google-signin-client_id meta tag 
