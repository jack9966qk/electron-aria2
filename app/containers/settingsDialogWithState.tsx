import { connect } from "react-redux"

import SettingsDialog, { DispatchProps, StoreProps } from "../views/settingsDialog"
import { arbitraryValChanged } from "../actions"

function mapStateToProps(state): StoreProps {
    return {
        defaultDir: state.defaultDir
    }
}

function mapDispatchToProps(dispatch): DispatchProps {
    return {
        setDefaultDir: (dir) => {
            dispatch(arbitraryValChanged("defaultDir", dir))
        }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog)