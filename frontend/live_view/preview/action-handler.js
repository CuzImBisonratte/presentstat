// Register with ws-server
ws.onopen = () =>
    ws.send(
        JSON.stringify({ msg_type: "register", role: "live_view" })
    );

// Chartjs setup
chart_maxHeight = document.getElementsByTagName("main")[0].clientHeight;
chart_maxWidth = document.getElementsByTagName("main")[0].clientWidth;
chart_maxSize = Math.min(chart_maxHeight, chart_maxWidth);
document.getElementById("canvasContainer").style.height = chart_maxSize + "px";
document.getElementById("canvasContainer").style.width = chart_maxSize + "px";
const ctx = document.getElementById('myChart');
let chart_data = {
    datasets: [{
        data: [0, 0, 0, 0, 1],
        backgroundColor: [
            '#b63750',
            '#355e9e',
            '#d8a735',
            '#61bd3d',
            '#fff'
        ],
        borderWidth: 0
    }]
};
const config = {
    type: 'doughnut',
    data: chart_data,
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        layout: {
            padding: 0
        }
    }
};
const chart = new Chart(ctx, config);

// Handle incoming messages
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    switch (data.msg_type) {
        case "start_question":
            // Reset vote
            voted = false;
            // Set chart labels
            chart.data.datasets[0].data = [0, 0, 0, 0, 1];
            chart.update();
            break;
        case "stop_question":
            // Clear question text
            document.getElementById("question-bar").innerText = "";
            // Set chart labels so the colors are hidden
            chart.data.datasets[0].data = [0, 0, 0, 0, 1];
            chart.update();
            break;
        case "vote":
            // If no chart exists, return
            if (!chart) return;
            // Update chart
            chart.data.datasets[0].data = data.votes;
            chart.update();
    }
}