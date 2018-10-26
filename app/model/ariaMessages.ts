const messages: { [key: string]: (args: any, response: any) => string } = {
    "aria2.getVersion": (_args, response) =>
        `Connected, version: ${response.version}`,
    "aria2.unpause": (_args, _response) => "Task resumed",
    "aria2.pause": (_args, _response) => "Task paused",
    "aria2.addUri": (_args, _response) => "Task added",
    "aria2.addTorrent": (_args, _response) => "Torrent added",
}

export default messages