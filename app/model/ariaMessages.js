export default {
    "aria2.getVersion": (args, response) =>
        `Connected, version: ${response.version}`,
    "aria2.unpause": (args, response) => "Task resumed",
    "aria2.pause": (args, response) => "Task paused",
    "aria2.addUri": (args, response) => "Task added",
    "aria2.addTorrent": (args, response) => "Torrent added",
}