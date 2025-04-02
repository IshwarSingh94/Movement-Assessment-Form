:root {
    --primary-color: #4a90e2;
    --secondary-color: #2c3e50;
    --accent-color: #e74c3c;
    --background-color: #f5f6fa;
    --text-color: #2c3e50;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    color: var(--text-color);
    line-height: 1.6;
    padding: 20px;
}

.container {
    background: white;
    padding: 30px;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    max-width: 600px;
    width: 100%;
    margin: 20px auto;
    position: relative;
    z-index: 1;
}

.header {
    text-align: center;
    margin-bottom: 30px;
}

.header i {
    font-size: 2.5em;
    color: var(--primary-color);
    margin-bottom: 10px;
}

h2 {
    text-align: center;
    color: var(--secondary-color);
    margin-bottom: 30px;
    font-size: 2em;
}

h3 {
    color: var(--primary-color);
    margin: 25px 0 15px;
    font-size: 1.3em;
    border-bottom: 2px solid #eee;
    padding-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
}

h3 i {
    font-size: 1.2em;
}

label {
    display: block;
    margin: 12px 0;
    padding: 12px;
    border-radius: var(--border-radius);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid transparent;
}

label:hover {
    background-color: #f8f9fa;
    border-color: var(--primary-color);
    transform: translateX(5px);
}

input[type="text"] {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: var(--border-radius);
    font-size: 1em;
    margin: 5px 0;
    transition: all 0.3s ease;
}

input[type="text"]:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

input[type="checkbox"] {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--primary-color);
}

.button-group {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.submit-btn, .reset-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.submit-btn {
    background: var(--primary-color);
    color: white;
}

.reset-btn {
    background: var(--secondary-color);
    color: white;
}

.submit-btn:hover, .reset-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.success-message {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--accent-color);
    color: white;
    padding: 12px 24px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease-out;
    z-index: 1000;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Popup Styles */
.popup {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
}

.popup-content {
    background: white;
    padding: 30px;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    max-width: 400px;
    width: 90%;
    position: relative;
    animation: slideIn 0.3s ease;
}

.popup-header {
    text-align: center;
    margin-bottom: 20px;
}

.popup-header i {
    font-size: 3em;
    color: #ffd700;
    margin-bottom: 10px;
}

.popup-body {
    text-align: center;
    margin-bottom: 20px;
}

.score-circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-color), #357abd);
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
}

.score-number {
    font-size: 2.5em;
    font-weight: bold;
}

.score-label {
    font-size: 1.1em;
    opacity: 0.9;
}

.popup-footer {
    text-align: center;
}

.popup-footer button {
    width: auto;
    padding: 10px 30px;
    background-color: var(--accent-color);
}

.popup-footer button:hover {
    background-color: #c0392b;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Responsive Design */
@media (max-width: 480px) {
    .container {
        padding: 20px;
    }
    
    h2 {
        font-size: 1.8em;
    }
    
    h3 {
        font-size: 1.2em;
    }

    .popup-content {
        padding: 20px;
        width: 95%;
    }

    .score-circle {
        width: 120px;
        height: 120px;
    }

    .score-number {
        font-size: 2em;
    }
}

.google-sign-in {
    margin: 20px 0;
    display: flex;
    justify-content: center;
} 
