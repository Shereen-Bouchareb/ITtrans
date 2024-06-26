document.getElementById('create-message-btn').addEventListener('click', function() {
    openModalInNewWindow();
});

function openModalInNewWindow() {
    const modalWindow = window.open("", "ModalWindow", "width=600,height=400");

    if (modalWindow) {
        // Create the modal content in the new window
        modalWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Modal</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="submit" class="send-message-btn">Send Message</button>
                        <span class="close-btn">&times;</span>
                    </div>
                    <form class="message-form">
                        <label>Token:</label>
                        <select name="token">
                            <option value="driving">driving</option>
                            <option value="geolocation">geolocation</option>
                            <option value="PaymentTerminal">PaymentTerminal</option>
                            <option value="Display">Display</option>
                        </select>
                        <label>Timestamp:</label>
                        <input name="timestamp" type="text" readonly value="${new Date().toISOString()}">
                        <label>Message Type:</label>
                        <select name="message-type">
                            <option value="driving">driving</option>
                            <option value="geolocation">geolocation</option>
                            <option value="PaymentTerminal">PaymentTerminal</option>
                            <option value="Display">Display</option>
                        </select>
                        <button type="button" onclick="handleContentFields()">Content</button>
                    </form>
                </div>
                <script>
                    document.querySelector('.close-btn').addEventListener('click', function() {
                        window.close();
                    });

                    document.querySelector('.send-message-btn').addEventListener('click', function() {
                        const tokenSelect = document.querySelector('select[name="token"]');
                        const messageTypeSelect = document.querySelector('select[name="message-type"]');
                        const timestampInput = document.querySelector('input[name="timestamp"]');
                        const form = document.querySelector('form');
                        const token = tokenSelect.value;
                        const messageType = messageTypeSelect.value;
                        const timestamp = timestampInput.value;
                        sendText(token, messageType, timestamp, form);
                    });

                    function handleContentFields() {
                        const form = document.querySelector('form');
                        const messageTypeSelect = document.querySelector('select[name="message-type"]');
                        const messageType = messageTypeSelect.value;

                        // Remove existing content fields if any
                        const existingFields = form.querySelectorAll('.content-field');
                        existingFields.forEach(field => field.remove());

                        if (messageType === 'geolocation') {
                            addGeolocationFields(form);
                        } else if (messageType === 'driving') {
                            addDrivingFields(form);
                        }
                    }

                    function addGeolocationFields(form) {
                        addField(form, 'Altitude:', 'altitude');
                        addField(form, 'Longitude:', 'longitude');
                        addSelect(form, 'Position Type:', 'positionType', ['station', 'interstation']);
                        addField(form, 'Position Name:', 'positionName');
                    }

                    function addDrivingFields(form) {
                        addSelect(form, 'Driving Type:', 'drivingType', ['calibrate', 'start', 'finish']);
                        addSelect(form, 'Position Type:', 'positionType', ['station', 'interstation']);
                        addField(form, 'Position Name:', 'positionName');
                    }

                    function addField(form, label, name) {
                        const fieldLabel = document.createElement('label');
                        fieldLabel.innerText = label;
                        fieldLabel.className = 'content-field';
                        form.appendChild(fieldLabel);

                        const fieldInput = document.createElement('input');
                        fieldInput.name = name;
                        fieldInput.type = 'text';
                        fieldInput.className = 'content-field';
                        form.appendChild(fieldInput);
                    }

                    function addSelect(form, label, name, options) {
                        const selectLabel = document.createElement('label');
                        selectLabel.innerText = label;
                        selectLabel.className = 'content-field';
                        form.appendChild(selectLabel);

                        const select = document.createElement('select');
                        select.name = name;
                        select.className = 'content-field';
                        options.forEach(optionText => {
                            const option = document.createElement('option');
                            option.value = optionText;
                            option.innerText = optionText;
                            select.appendChild(option);
                        });
                        form.appendChild(select);
                    }

                    function sendText(token, messageType, timestamp, form) {
                        // Construct a msg object containing the data the server needs to process the message from the chat client.
                        const msg = {
                            type: "message",
                            token: token,
                            messageType: messageType,
                            timestamp: timestamp,
                            id: ${Math.floor(Math.random() * 10000)}, // Random client ID for demonstration
                            date: Date.now(),
                        };

                        // Collect additional form data
                        const formData = new FormData(form);
                        for (const [key, value] of formData.entries()) {
                            msg[key] = value;
                        }

                        // Send the msg object as a JSON-formatted string.
                        const exampleSocket = new WebSocket('ws://your-websocket-server-url');
                        exampleSocket.onopen = function() {
                            exampleSocket.send(JSON.stringify(msg));
                        };

                        // Close the window after sending the message
                        window.close();
                    }
                </script>
            </body>
            </html>
        `);
        modalWindow.document.close();
    } else {
        console.error("Failed to open new window.");
    }
}
