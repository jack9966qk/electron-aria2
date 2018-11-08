import { NotificationResponse } from "./rpc"

const messages: { [key: string]: (args: any, response: any) => string | null } = {
    "aria2.getVersion": (_args, response) =>
        `aria2c version: ${response.version}`,
    "aria2.unpause": (_args, _response) => null,
    "aria2.pause": (_args, _response) => null,
    "aria2.forcePause": (_args, _response) => null,
    "aria2.remove": (_args, _response) => null,
    "aria2.forceRemove": (_args, _response) => null,
    "aria2.addUri": (_args, _response) => null,
    "aria2.addTorrent": (_args, _response) => null
    // "aria2.unpause": (_args, _response) => "Task resumed",
    // "aria2.pause": (_args, _response) => "Task paused",
    // "aria2.addUri": (_args, _response) => "Task added",
    // "aria2.addTorrent": (_args, _response) => "Torrent added"
}

export default messages