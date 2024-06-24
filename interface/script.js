function toggleMessageWindow() {
    var messageWindow = document.getElementById("messageWindow");
    if (messageWindow.style.display === "none") {
        messageWindow.style.display = "block";
        updateTimestamp();
    } else {
        messageWindow.style.display = "none";
    }
}

function toggleContentWindow() {
    var contentWindow = document.getElementById("contentWindow");
    if (contentWindow.style.display === "none") {
        contentWindow.style.display = "block";
    } else {
        contentWindow.style.display = "none";
    }
}

function updateTimestamp() {
    var timestampInput = document.getElementById("timestamp");
    timestampInput.value = Date.now();
}

function send() {
    var token = document.getElementById("token").value;
    var messageType = document.getElementById("messageType").value;
    var timestamp = document.getElementById("timestamp").value;
    // Send the message using WebSocket
    console.log("Sending message:", { token, messageType, timestamp });
}

function sendContent() {
    var drivingType = document.getElementById("drivingType").value;
    var position = document.getElementById("position").value;
    var stationName = document.getElementById("stationName").value;
    // Send the content using WebSocket
    console.log("Sending content:", { drivingType, position, stationName });
}
