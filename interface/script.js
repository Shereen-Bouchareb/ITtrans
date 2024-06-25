document.getElementById('create-message-btn').addEventListener('click', function() {
    createModal();
});

function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const sendButton = document.createElement('button');
    sendButton.type = 'submit';
    sendButton.innerText = 'Send Message';
    sendButton.className = 'send-message-btn';
    modalHeader.appendChild(sendButton);

    const closeButton = document.createElement('span');
    closeButton.className = 'close-btn';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function() {
        modal.remove();
    };
    modalHeader.appendChild(closeButton);

    modalContent.appendChild(modalHeader);

    const form = document.createElement('form');
    form.className = 'message-form';

    const tokenLabel = document.createElement('label');
    tokenLabel.innerText = 'Token:';
    form.appendChild(tokenLabel);

    const tokenSelect = document.createElement('select');
    tokenSelect.name = 'token';
    ['driving', 'geolocation', 'PaymentTerminal', 'Display'].forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.innerText = type;
        tokenSelect.appendChild(option);
    });
    form.appendChild(tokenSelect);

    const timestampLabel = document.createElement('label');
    timestampLabel.innerText = 'Timestamp:';
    form.appendChild(timestampLabel);

    const timestampInput = document.createElement('input');
    timestampInput.name = 'timestamp';
    timestampInput.type = 'text';
    timestampInput.readOnly = true;
    timestampInput.value = new Date().toISOString();
    form.appendChild(timestampInput);

    const messageTypeLabel = document.createElement('label');
    messageTypeLabel.innerText = 'Message Type:';
    form.appendChild(messageTypeLabel);

    const messageTypeSelect = document.createElement('select');
    messageTypeSelect.name = 'message-type';
    ['driving', 'geolocation', 'PaymentTerminal', 'Display'].forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.innerText = type;
        messageTypeSelect.appendChild(option);
    });
    form.appendChild(messageTypeSelect);

    tokenSelect.addEventListener('change', function() {
        messageTypeSelect.value = tokenSelect.value;
    });

    const contentButton = document.createElement('button');
    contentButton.type = 'button';
    contentButton.innerText = 'Content';
    contentButton.onclick = function() {
        handleContentFields(form, messageTypeSelect.value);
    };
    form.appendChild(contentButton);

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const message = {
            sender: 'Web',
            token: tokenSelect.value,
            type: messageTypeSelect.value,
            timestamp: timestampInput.value,
            content: {}
        };

        if (messageTypeSelect.value === 'driving') {
            message.content.driving_type = form.querySelector('[name="drivingType"]').value;
            message.content.position = {
                type: form.querySelector('[name="positionType"]').value,
                name: form.querySelector('[name="stationName"]').value
            };
        } else if (messageTypeSelect.value === 'geolocation') {
            message.content.altitude = form.querySelector('[name="altitude"]').value;
            message.content.longitude = form.querySelector('[name="longitude"]').value;
            message.content.position = {
                type: form.querySelector('[name="stationType"]').value,
                name: form.querySelector('[name="stationName"]').value
            };
        }

        sendMessage(message);
    });

    modalContent.appendChild(form);
    modal.appendChild(modalContent);
    document.getElementById('modals-container').appendChild(modal);
    modal.style.display = 'block';
}

function handleContentFields(form, messageType) {
    const existingFields = form.querySelectorAll('.content-field');
    existingFields.forEach(field => field.remove());

    if (messageType === 'geolocation') {
        const altitudeLabel = createLabel('Altitude:');
        const altitudeInput = createInput('altitude');
        altitudeInput.classList.add('content-field');
        const longitudeLabel = createLabel('Longitude:');
        const longitudeInput = createInput('longitude');
        longitudeInput.classList.add('content-field');
        const positionTypeLabel = createLabel('Station Type:');
        const positionTypeSelect = createSelect('stationType', ['station', 'interstation']);
        positionTypeSelect.classList.add('content-field');
        const positionNameLabel = createLabel('Station Name:');
        const positionNameInput = createInput('stationName');
        positionNameInput.classList.add('content-field');
        positionNameInput.style.marginBottom = '200px';

        appendToContainer(form, altitudeLabel, altitudeInput, longitudeLabel, longitudeInput, positionTypeLabel, positionTypeSelect, positionNameLabel, positionNameInput);
    } else if (messageType === 'driving') {
        const drivingTypeLabel = createLabel('Driving Type:');
        const drivingTypeSelect = createSelect('drivingType', ['calibrate', 'start', 'finish']);
        drivingTypeSelect.classList.add('content-field');
        const positionTypeLabel = createLabel('Position Type:');
        const positionTypeSelect = createSelect('positionType', ['station', 'interstation']);
        positionTypeSelect.classList.add('content-field');
        const positionNameLabel = createLabel('Station Name:');
        const positionNameInput = createInput('stationName');
        positionNameInput.classList.add('content-field');
        positionNameInput.style.marginBottom = '200px';

        appendToContainer(form, drivingTypeLabel, drivingTypeSelect, positionTypeLabel, positionTypeSelect, positionNameLabel, positionNameInput);
    }
}

function sendMessage(message) {
    const ws = new WebSocket('ws://localhost:9999/ws');

    ws.onopen = function() {
        console.log('Connected to server');
        ws.send(JSON.stringify(message));
        console.log('Message sent');
    };

    ws.onmessage = function(event) {
        console.log('Received data from server:', event.data);
    };

    ws.onclose = function(event) {
        console.log('Connection closed:', event.code, event.reason);
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
}

function createLabel(text) {
    const label = document.createElement('label');
    label.innerText = text;
    return label;
}

function createInput(name) {
    const input = document.createElement('input');
    input.name = name;
    input.type = 'text';
    return input;
}

function createSelect(name, options) {
    const select = document.createElement('select');
    select.name = name;
    options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.innerText = optionText;
        select.appendChild(option);
    });
    return select;
}

function appendToContainer(container, ...elements) {
    elements.forEach(element => container.appendChild(element));
}