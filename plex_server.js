const request = require('request')
var convert = require('xml-js');

module.exports = function (RED) {
    function PlexServerNode(config) {
        RED.nodes.createNode(this, config);
        this.server = config.server;
        this.client = config.client;
        this.token = config.token;
        this.identifier = config.identifier;
        this.cpt = 0;
        let that = this;
        try {
            request(`http://${this.server}:32400/clients?X-Plex-Token=${this.token}`, function (error, response, body) {
                if (error) {
                    console.error('error:', error);
                }
                if (body) {
                    let result = convert.xml2json(body, { compact: true, spaces: 4 });
                    result = JSON.parse(result);
                    let size = result.MediaContainer._attributes.size;
                    if (size == 1) {
                        that.targetId = result.MediaContainer.Server._attributes.machineIdentifier;
                    }
                    else {
                        for (let i = 0; i < result.MediaContainer._attributes.size; i++) {
                            if (result.MediaContainer.Server[i]._attributes.address == that.client) {
                                that.targetId = result.MediaContainer.Server[i]._attributes.machineIdentifier;
                            }
                        }
                    }
                }
            });
        }
        catch (err) {
            console.log(err);
        }

    }
    RED.nodes.registerType("plex_server", PlexServerNode);
}