import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootAction } from '../actions'
import { RootState } from '../reducer'
import Control, { DispatchProps, StoreProps } from '../components/control'
import creators from '../creators'

function mapStateToProps(state: RootState): StoreProps {
    return {
        server: state.server,
        latestNotification: state.latestNotification
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    const { connectLocal, connect, disconnect, purgeTasks } = creators(dispatch)
    return { connectLocal, connect, disconnect, purgeTasks }
}

export default connect(mapStateToProps, mapDispatchToProps)(Control)