import { connect } from "react-redux"
import { Dispatch } from "redux"

import SettingsDialog, { DispatchProps, StoreProps } from "../views/settingsDialog"
import { arbitraryValChanged, RootAction } from "../actions"
import { RootState } from "../reducer"

function mapStateToProps(state: RootState): StoreProps {
    return {
        defaultDir: state.defaultDir
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    return {
        setDefaultDir: (dir) => {
            dispatch(arbitraryValChanged("defaultDir", dir))
        }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog)