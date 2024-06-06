// Register with ws-server
ws.onopen = () =>
    ws.send(
        JSON.stringify({ msg_type: "register", role: "controller" })
    );

