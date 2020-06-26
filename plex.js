const request = require('request')

module.exports = function (RED) {
    function Plex(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            this.server = RED.nodes.getNode(config.server);
            if (this.server) {
                console.log(this.server)
                let cpt = this.server.cpt += 1;
                // try {
                if (msg.payload == "play") {
                    let playUrl = `http://${this.server.server}:32400/player/playback/play?commandID=${cpt}&X-Plex-Target-Client-Identifier=${this.server.targetId}&X-Plex-Client-Identifier=${this.server.identifier}&X-Plex-Token=${this.server.token}`;
                    console.log(`Requesting on : ${playUrl}`)

                    request.post(playUrl, {},
                        (error, res, body) => {
                            if (error) {
                                msg.payload = 'Error while communicating with HTTP API' + error;
                                node.send(msg);
                            }
                            else {
                                msg.payload = `statusCode: ${res.statusCode} : successfully playing`;
                                node.send(msg);
                            }
                        })
                }
                else if (msg.payload == "pause") {
                    let pauseUrl = `http://${this.server.server}:32400/player/playback/pause?commandID=${cpt}&X-Plex-Target-Client-Identifier=${this.server.targetId}&X-Plex-Client-Identifier=${this.server.identifier}&X-Plex-Token=${this.server.token}`;
                    console.log(`Requesting on : ${pauseUrl}`)

                    request.post(pauseUrl, {},
                        (error, res, body) => {
                            if (error) {
                                msg.payload = 'Error while communicating with HTTP API' + error;
                                node.send(msg);
                            }
                            else {
                                msg.payload = `statusCode: ${res.statusCode} : successfully paused`;
                                node.send(msg);
                            }
                        })
                }
                else if (msg.payload == "stop") {
                    let stopUrl = `http://${this.server.server}:32400/player/playback/stop?commandID=${cpt}&X-Plex-Target-Client-Identifier=${this.server.targetId}&X-Plex-Client-Identifier=${this.server.identifier}&X-Plex-Token=${this.server.token}`;
                    console.log(`Requesting on : ${stopUrl}`)

                    request.post(stopUrl, {},
                        (error, res, body) => {
                            if (error) {
                                msg.payload = 'Error while communicating with HTTP API' + error;
                                node.send(msg);
                            }
                            else {
                                msg.payload = `statusCode: ${res.statusCode} : successfully stopped`;
                                node.send(msg);
                            }
                        })
                }
                // } catch (err) {
                //     console.log(err);
                // }
            } else {
                msg.payload = "no server";
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("plex", Plex);
}


