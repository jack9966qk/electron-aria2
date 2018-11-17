import * as Electron from 'electron'
import { shell } from 'electron'
import { Dispatch } from 'redux'
import {
    connected,
    disconnected,
    receivedOptions,
    receivedTasksAndStatus,
    RootAction,
    newNotification
} from './actions'
import AriaJsonRPC from './model/rpc'
import { Options } from './model/options'
import { Notification } from './reducer'

const mainFuncs = Electron.remote.require("./mainFuncs.js")
let refreshLoopId: number

const creators = (dispatch: Dispatch<RootAction>) => {

    const refreshTasks = (rpc: AriaJsonRPC) => {
        rpc.getTasksAndStatus().then(({ tasks, stat }) => {
            // console.log(tasks)
            dispatch(receivedTasksAndStatus(tasks, stat))
        })
    }

    const onConnectionSuccess = (rpc: AriaJsonRPC) => {
        Promise.all([
            rpc.call("aria2.getVersion", []),
            rpc.call("aria2.getGlobalOption", []),
            rpc.getTasksAndStatus()
        ]).then(([{version, enabledFeatures}, options, { tasks, stat }]) => {
            dispatch(connected({
                hostUrl: rpc.url,
                secret: rpc.secret,
                version, enabledFeatures,
                options, tasks, stat
            }))
            dispatch(newNotification({
                type: "success",
                message: "Connected to aria2"
            }))
            // get new task status every 500ms
            refreshLoopId = window.setInterval(() => { refreshTasks(rpc) }, 500)
        })
    }

    const onConnectionClose = (rpc: AriaJsonRPC) => () => {
        dispatch(disconnected(rpc.url))
    }

    const eventHandlers = {
        "aria2.onDownloadStart": refreshTasks,
        "aria2.onDownloadPause": refreshTasks,
        "aria2.onDownloadStop": refreshTasks,
        "aria2.onDownloadComplete": refreshTasks,
        "aria2.onDownloadError": refreshTasks,
        "aria2.onBtDownloadComplete": refreshTasks
    }

    const connect = (
        url: string,
        secret: string,
        onRes: Function,
        onNotif: Function,
        onErr: Function,
        onConnErr: () => void,
        onConnSuccess: Function
    ) => {
        const rpc = new AriaJsonRPC(url, secret, onRes, onErr)
        // register handlers for notifications
        for (const event in eventHandlers) {
            const func = eventHandlers[event]
            rpc.on(event, (message) => {
                func(rpc)
                onNotif(event, message)
            })
        }
        const onSuccess = () => {
            onConnSuccess(rpc)
            onConnectionSuccess(rpc)
        }
        rpc.connect(
            onSuccess,
            onConnectionClose(rpc),
            onConnErr)
    }
    
    return {
        connectLocal: (
            onRes: Function,
            onNotif: Function,
            onErr: Function,
            onConnErr: () => void,
            onConnSuccess: Function
        ) => {
            const { hostUrl, secret } = mainFuncs
            const launchAndRetry = () => {
                mainFuncs.launchAria()
                // it seems to be necessary to wait a little
                // for aria2c server to fully start
                setTimeout(() => {
                    connect(hostUrl, secret, onRes, onNotif, onErr, onConnErr, onConnSuccess)
                }, 200);
            }
            connect(hostUrl, secret, onRes, onNotif, onErr, launchAndRetry, onConnSuccess)
        },
        connect: connect,
        disconnect: (rpc: AriaJsonRPC) => {
            clearInterval(refreshLoopId)
            // need a unified approach on how to and when to shut down
            // rpc.call("aria2.shutdown", [])
            rpc.disconnect()
        },
        purgeTasks: (rpc: AriaJsonRPC) => {
            rpc.call("aria2.purgeDownloadResult", []).then(() => { refreshTasks(rpc) })
        },
        changeOptions: (rpc: AriaJsonRPC, options: Options) => {
            rpc.call("aria2.changeGlobalOption", [options])
                .then((_) => rpc.call("aria2.getGlobalOption", []))
                .then((options) => {
                    dispatch(receivedOptions(options))
                    dispatch(newNotification({
                        type: "success",
                        message: "Global options updated"
                    }))
                })
        },
        addUris: (rpc: AriaJsonRPC, uris: string[], options: Options) => {
            const requests = uris
                .map((uri) => rpc.call("aria2.addUri", [[uri], options]))
            Promise.all(requests)
                .then(() => rpc.getTasksAndStatus())
                .then(({ tasks, stat }) => {
                    dispatch(receivedTasksAndStatus(tasks, stat))
                    dispatch(newNotification({
                        type: "success",
                        message: `Added ${uris.length} task${uris.length > 1 ? "s": ""}`
                    }))
                })
        },
        addFiles: (
            rpc: AriaJsonRPC,
            files: {type: "torrent" | "metalink", content: string}[],
            options: Options
        ) => {
            const requests = files.map(({ type, content }) => {
                switch (type) {
                    case "torrent":
                        return rpc.call("aria2.addTorrent", [content, [], options])
                        break
                    case "metalink":
                        return rpc.call("aria2.addMetalink", [content, options])
                        break
                }
            })

            Promise.all(requests).then(() => {
                return rpc.getTasksAndStatus()
            }).then(({ tasks, stat }) => {
                dispatch(receivedTasksAndStatus(tasks, stat))
                dispatch(newNotification({
                    type: "success",
                    message: `Added ${files.length} task${files.length > 1 ? "s": ""}`
                }))
            })
        },
        pauseTask: (rpc: AriaJsonRPC, gid: string) => {
            rpc.call("aria2.forcePause", [gid]).then(() => { refreshTasks(rpc) })
        },
        resumeTask: (rpc: AriaJsonRPC, gid: string) => {
            rpc.call("aria2.unpause", [gid]).then(() => { refreshTasks(rpc) })
        },
        deleteTask: (rpc: AriaJsonRPC, gid: string) => {
            rpc.call("aria2.forceRemove", [gid]).then(() => { refreshTasks(rpc) })
        },
        permDeleteTask: (rpc: AriaJsonRPC, gid: string) => {
            rpc.call("aria2.removeDownloadResult", [gid]).then(() => { refreshTasks(rpc) })
        },
        revealFile: (path: string) => {
            shell.showItemInFolder(path)
        },
        openFile: (path: string) => {
            shell.openItem(path)
        },
        displayNotification: (
            message: Notification["message"],
            type?: Notification["type"]
        ) => {
            dispatch(newNotification({
                message,
                type: type === undefined ? "default" : type
            }))
        }
    }
}

export default creators