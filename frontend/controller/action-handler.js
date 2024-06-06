// Register with ws-server
ws.onopen = () =>
    ws.send(
        JSON.stringify({ msg_type: "register", role: "controller" })
    );

// Question logic
let questions = {
    questions: [],
    current: 0,
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
    {/* <div class="question">
                <div class="question_start">
                    <img src="play.svg" onclick="start_question(0)">
                </div>
                <div class="question_delete">
                    <img src="garbage.svg" onclick="delete_question(0)">
                </div>
                <div class="question_title">Warum?</div>
                <div class="input options"><span class="option1">Option 1</span> - <span class="option2">Option 2</span> - <span class="option3">Option 3</span> - <span class="option4">Option 4</span></div>
            </div> */}
    question_storage.innerHTML = "";
    questions.questions.forEach((q, i) => {
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