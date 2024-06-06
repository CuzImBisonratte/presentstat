// Register with ws-server
ws.onopen = () =>
    ws.send(
        JSON.stringify({ msg_type: "register", role: "public" })
    );

// Variable to store whether a vote has already been cast
let voted = false;

// Handle incoming messages
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.msg_type === "start_question") {
        // Reset vote
        voted = false;
        // Set question text
        document.getElementById("question-bar").innerText = data.question.question;
        // Get number of options
        let num_options = 0;
        data.question.options.forEach((option) => { if (option != "") num_options++ });
        // Prepare grid
        document.getElementsByTagName("main")[0].dataset.options = num_options;
        // Set options
        document.getElementById("option1").innerText = data.question.options[0];
        document.getElementById("option2").innerText = data.question.options[1];
        document.getElementById("option3").innerText = data.question.options[2];
        document.getElementById("option4").innerText = data.question.options[3];
    } else if (data.msg_type === "stop_question") {
        // Clear grid
        document.getElementsByTagName("main")[0].dataset.options = 0;
        // Clear question text
        document.getElementById("question-bar").innerText = "";
        // Clear options
        document.getElementById("option1").innerText = "";
        document.getElementById("option2").innerText = "";
        document.getElementById("option3").innerText = "";
        document.getElementById("option4").innerText = "";
    }
}

function vote(option) {
    // Check if a vote has already been cast
    // if (voted) return;
    // Send vote
    ws.send(JSON.stringify({ msg_type: "vote", option: option - 1 }));
    voted = true;
}