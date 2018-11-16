import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootAction } from '../actions'
import { RootState } from '../reducer'
import Control, { DispatchProps, StoreProps } from '../components/Control'
import creators from '../creators'

function mapStateToProps(state: RootState): StoreProps {
    return {
        server: state.server
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    const { displayNotification } = creators(dispatch)
    return { displayNotification }
}

export default connect(mapStateToProps, mapDispatchToProps)(Control)