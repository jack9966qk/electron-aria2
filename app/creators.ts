import * as Electron from 'electron'
import { shell } from 'electron'
import { Dispatch } from 'redux'
import {
    connected,
    disconnected,
    receivedOptions,
    receivedTasksAndStatus,
    RootAction
} from './actions'
import AriaJsonRPC from './model/rpc';

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
        ]).then(([version, options, { tasks, stat }]) => {
            dispatch(connected({
                hostUrl: rpc.url,
                secret: rpc.secret,
                version, options, tasks, stat
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

    const connect = (url, secret, onRes, onNotif, onErr, onConnErr, onConnSuccess) => {
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
        connectLocal: (onRes, onNotif, onErr, onConnErr, onConnSuccess) => {
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
        disconnect: (rpc) => {
            clearInterval(refreshLoopId)
            // need a unified approach on how to and when to shut down
            // rpc.call("aria2.shutdown", [])
            rpc.disconnect()
        },
        purgeTasks: (rpc: AriaJsonRPC) => {
            rpc.call("aria2.purgeDownloadResult", []).then(() => { refreshTasks(rpc) })
        },
        changeOptions: (rpc, options) => {
            rpc.call("aria2.changeGlobalOption", [options], true)
                .then((_) => rpc.call("aria2.getGlobalOption", []))
                .then((options) => {
                    dispatch(receivedOptions(options))
                })
        },
        addUris: (rpc, uris, options) => {
            const requests = uris
                .map((uri) => rpc.call("aria2.addUri", [[uri], options]))
            Promise.all(requests)
                .then(() => rpc.getTasksAndStatus())
                .then(({ tasks, stat }) => { dispatch(receivedTasksAndStatus(tasks, stat)) })
        },
        addFiles: (rpc, files, options) => {
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
            })
        },
        pauseTask: (rpc, gid) => {
            rpc.call("aria2.forcePause", [gid]).then(() => { refreshTasks(rpc) })
        },
        resumeTask: (rpc, gid) => {
            rpc.call("aria2.unpause", [gid]).then(() => { refreshTasks(rpc) })
        },
        deleteTask: (rpc, gid) => {
            rpc.call("aria2.forceRemove", [gid]).then(() => { refreshTasks(rpc) })
        },
        permDeleteTask: (rpc, gid) => {
            rpc.call("aria2.removeDownloadResult", [gid]).then(() => { refreshTasks(rpc) })
        },
        revealFile: (path) => {
            shell.showItemInFolder(path)
        },
        openFile: (path) => {
            shell.openItem(path)
        },
    }
}

export default creators