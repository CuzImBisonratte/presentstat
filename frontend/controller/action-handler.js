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