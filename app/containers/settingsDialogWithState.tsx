import { connect } from "react-redux"
import { Dispatch } from "redux"

import SettingsDialog, { DispatchProps, StoreProps } from "../views/settingsDialog"
import { RootAction, receivedOptions } from "../actions"
import { RootState } from "../reducer"

function mapStateToProps(state: RootState): StoreProps {
    return {
        options: state.server.options
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    return {
        changeOptions: (rpc, options) => {
            rpc.call("aria2.changeGlobalOption", [options], true)
                .then((_) => rpc.call("aria2.getGlobalOption", []))
                .then((options) => {
                    dispatch(receivedOptions(options))
                })
        }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog)