import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootAction } from '../actions'
import { RootState } from '../reducer'
import SettingsDialog, { DispatchProps, StoreProps } from '../components/SettingsDialog'
import creators from '../creators'

function mapStateToProps(state: RootState): StoreProps {
    return {
        options: state.server.options
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    const { changeOptions } = creators(dispatch)
    return { changeOptions }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog)