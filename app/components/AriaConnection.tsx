import * as React from 'react'
import AriaJsonRPC from '../model/rpc'
import ControlWithState from '../containers/ControlWithState'
import { Notification, Server } from '../reducer'
import AriaMessages from '../model/ariaMessages'
import { getName } from '../model/task'

interface ViewProps {
}

export interface DispatchProps {
    connectLocal: (
        onRes: Function,
        onNotif: Function,
        onErr: Function,
        onConnErr: () => void,
        onConnSuccess: (AriaJsonRPC) => void
    ) => void
    connect: (
        url: string,
        secret: string,
        onRes: Function,
        onNotif: Function,
        onErr: Function,
        onConnErr: () => void,
        onConnSuccess: (AriaJsonRPC) => void
    ) => void
    disconnect: (
        rpc: AriaJsonRPC,
    ) => void
    displayNotification: (
        message: Notification["message"],
        type?: Notification["type"]
    ) => void
}

export interface StoreProps {
    server: Server
}

type Props = ViewProps & DispatchProps & StoreProps
    
interface State {
    rpc: AriaJsonRPC | null
}

class RpcConnection extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            rpc: null
        }
    }

    disconnect = () => {
        if (this.state.rpc) {
            this.props.disconnect(this.state.rpc)
            this.setState({ rpc: null })
        }
    }

    connect = (url: string, secret: string) => {
        const props = this.props
        props.connect(
            url, secret,
            this.onAriaResponse,
            this.onAriaNotification,
            this.onAriaError,
            this.onConnectionError,
            this.onConnectionSuccess)
    }

    componentDidMount() {
        console.log("RpcConnection did mount")
        const props = this.props
        props.connectLocal(
            this.onAriaResponse,
            this.onAriaNotification,
            this.onAriaError,
            this.onConnectionError,
            this.onConnectionSuccess)
    }

    componentWillUnmount() {
        this.disconnect()
    }

    onAriaResponse = (method, args, response) => {
        console.log(method)
        console.log(response)
        const func = AriaMessages[method]
        if (func !== undefined) {
            const message = func(args, response)
            if (message !== null) {
                this.props.displayNotification(message)
            }
        } else {
            this.props.displayNotification(`${method.replace("aria2.", "")} succeeded`)
        }
    }

    onAriaNotification = (method, response) => {
        console.log(method)
        console.log(response)
        const { gid } = response
        if (!this.props.server.tasks.has(gid)) {
            console.warn(`task with gid ${gid} cannot be found`)
        }
        const task = this.props.server.tasks.get(gid)
        const name = getName(task)
        switch (method) {
            case "aria2.onDownloadStart":
                this.props.displayNotification(`Task "${name}" started`)
                break
            case "aria2.onDownloadPause":
                this.props.displayNotification(`Task "${name}" paused`)
                break
            case "aria2.onDownloadStop":
                this.props.displayNotification(`Task "${name}" stopped`)
                break
            case "aria2.onDownloadComplete":
                this.props.displayNotification(`Task "${name}" completed`, "success")
                break
            case "aria2.onDownloadError":
                this.props.displayNotification(`Task "${name}" has error`, "error")
                break
            case "aria2.onBtDownloadComplete":
                this.props.displayNotification(`Task "${name}" completed`)
                break
            default:
                break
        }
    }

    onAriaError = (_method, _args, error) => {
        this.props.displayNotification(`Error: ${error.message}`, "error")
    }

    onConnectionSuccess = (rpc) => {
        this.setState({ rpc })
    }

    onConnectionError = () => {
        this.props.displayNotification(`Failed to connect to ${this.props.server.hostUrl}`, "error")
    }
    
    render = () => <ControlWithState rpc={this.state.rpc} connect={this.connect}/>
}

export default RpcConnection