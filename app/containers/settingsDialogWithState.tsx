import { connect } from "react-redux"
import { Dispatch } from "redux"

import SettingsDialog, { DispatchProps, StoreProps } from "../views/settingsDialog"
import { RootAction } from "../actions"
import { RootState } from "../reducer"

function mapStateToProps(state: RootState): StoreProps {
    return {
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    return {
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog)