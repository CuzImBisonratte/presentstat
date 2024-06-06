// Register with ws-server
ws.onopen = () =>
    ws.send(
        JSON.stringify({ msg_type: "register", role: "controller" })
    );

// Question logic
let questions = {
    questions: [],
    current: -1,
    show: {
        live: true,
        public: true
    }
}

// Show toggle button
function toggleShow(output) {
    if (!output) return;
    const show_public = document.getElementById("public_button");
    const show_live = document.getElementById("live_button");
    console.log(show_public, show_live);
    switch (output) {
        case "public":
            questions.show.public = !questions.show.public;
            break;
        case "live":
            questions.show.live = !questions.show.live;
            break;
    }
    questions.show.public ? show_public.classList.add("button_active") : show_public.classList.remove("button_active");
    questions.show.public ? show_public.classList.remove("button_inactive") : show_public.classList.add("button_inactive");
    questions.show.live ? show_live.classList.add("button_active") : show_live.classList.remove("button_active");
    questions.show.live ? show_live.classList.remove("button_inactive") : show_live.classList.add("button_inactive");
}

// Add question - dialog
let num_options = 2;
document.querySelectorAll("input[name='add_question-options']").forEach((el) => {
    el.addEventListener("change", (e) => {
        if (e.target.value > 2) {
            document.getElementById("add_question-answer-3").style.display = "unset";
            document.getElementById("add_question-answer-3-label").style.display = "unset";
        } else {
            document.getElementById("add_question-answer-3").style.display = "none";
            document.getElementById("add_question-answer-3-label").style.display = "none";
        }
        if (e.target.value > 3) {
            document.getElementById("add_question-answer-4").style.display = "unset";
            document.getElementById("add_question-answer-4-label").style.display = "unset";
        } else {
            document.getElementById("add_question-answer-4").style.display = "none";
            document.getElementById("add_question-answer-4-label").style.display = "none";
        }
        num_options = e.target.value;
    });
});

// Add question method
function add_question() {
    const question = document.getElementById("add_question-question_input").value;
    const options = [];
    for (let i = 1; i <= 4; i++) options.push(document.getElementById(`add_question-answer-${i}`).value);
    // Clear inputs
    document.getElementById("add_question-question_input").value = "";
    document.querySelectorAll("input[class='add_question_input']").forEach((el) => el.value = "");
    document.querySelectorAll("input[name='add_question-options']").forEach((el) => el.checked = el.value == 2);
    document.getElementById("add_question-answer-3").style.display = "none";
    document.getElementById("add_question-answer-3-label").style.display = "none";
    document.getElementById("add_question-answer-4").style.display = "none";
    document.getElementById("add_question-answer-4-label").style.display = "none";
    // Store question
    questions.questions.push({ question, options });
    // Update question list
    update_questions();
    // Close dialog
    document.getElementById('overlay').style.display = "none";
}

// Update question list
function update_questions() {
    const question_storage = document.getElementById("question_storage");
    question_storage.innerHTML = "";
    questions.questions.forEach((q, i) => {
        // If current question, skip
        if (i == questions.current) return;
        // Generate question element
        const question = document.createElement("div");
        question.classList.add("question");
        question.innerHTML = `
            <div class="question_start">
                <img src="play.svg" onclick="start_question(${i})">
            </div>
            <div class="question_delete">
                <img src="garbage.svg" onclick="delete_question(${i})">
            </div>
            <div class="question_title">${q.question}</div>
            <div class="input options">
                <span class="option1">${q.options[0]}</span> - 
                <span class="option2">${q.options[1]}${q.options[2] ? " - " : ""}</span>
                <span class="option3">${q.options[2] ? q.options[2] + (q.options[3] ? " - " : "") : ""}</span>
                <span class="option4">${q.options[3] ? q.options[3] : ""}</span>
            </div>
        `;
        question_storage.appendChild(question);
    });
}

// Export handler
function export_questions() {
    const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(questions.questions))}`;
    const a = document.createElement("a");
    a.href = data;
    a.download = "questions.json";
    a.click();
}

// Import handler
function import_questions() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            questions.questions = JSON.parse(e.target.result);
            update_questions();
        }
        reader.readAsText(file);
    }
    input.click();
}

// Start question
function start_question(i) {
    // Send WS message
    ws.send(JSON.stringify({ msg_type: "start_question", question: questions.questions[i] }));
    // Set current question
    questions.current = i;
    // Update current_question-View
    const question = document.createElement("div");
    question.classList.add("question");
    question.innerHTML = `
        <div class="question_title">${questions.questions[i].question}</div>
        <div class="question_delete">
            <img src="stop.svg" onclick="stop_question(0)">
        </div>
        <div class="input options">
            <span class="option1">${questions.questions[i].options[0]}</span> - 
            <span class="option2">${questions.questions[i].options[1]}${questions.questions[i].options[2] ? " - " : ""}</span>
            <span class="option3">${questions.questions[i].options[2] ? questions.questions[i].options[2] + (questions.questions[i].options[3] ? " - " : "") : ""}</span>
            <span class="option4">${questions.questions[i].options[3] ? questions.questions[i].options[3] : ""}</span>
        </div>
    `;
    document.getElementById("current_question").innerHTML = "";
    document.getElementById("current_question").appendChild(question);
    // Update question list
    update_questions();
}

// Stop question
function stop_question() {
    // Send WS message
    ws.send(JSON.stringify({ msg_type: "stop_question" }));
    // Reset current question
    questions.current = -1;
    // Update current_question-View
    document.getElementById("current_question").innerHTML = `
    <div class="question" style="visibility: hidden">
                <div class="question_start">
                    <img src="play.svg" />
                </div>
                <div class="question_title">Warum?</div>
            </div>`;
    // Update question list
    update_questions();
}

// Delete question
function delete_question(i) {
    questions.questions.splice(i, 1);
    if (i < questions.current) questions.current--;
    update_questions();
}