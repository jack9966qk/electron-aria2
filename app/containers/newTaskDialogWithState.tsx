import { connect } from "react-redux"
import { Dispatch } from "redux"

import NewTaskDialog, { DispatchProps, StoreProps } from "../views/newTaskDialog"
import { receivedTasks, RootAction } from "../actions"
import { RootState } from "../reducer"

function mapStateToProps(state: RootState): StoreProps {
    return {
        globalOptions: state.server.options
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    return {
        addUris: (rpc, uris, options) => {
            const requests = uris
                .map((uri) => rpc.call("aria2.addUri", [[uri], options]))
            Promise.all(requests)
                .then(() => rpc.getAllTasks())
                .then(tasks => { dispatch(receivedTasks(tasks)) })
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
                return rpc.getAllTasks()
            }).then(tasks => {
                dispatch(receivedTasks(tasks))                
            })
        },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(NewTaskDialog)