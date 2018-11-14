import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootAction } from '../actions'
import { RootState } from '../reducer'
import RpcConnection, { DispatchProps, StoreProps } from '../components/AriaConnection'
import creators from '../creators'

function mapStateToProps(state: RootState): StoreProps {
    return {
        server: state.server
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    const { connectLocal, connect, disconnect, displayNotification } = creators(dispatch)
    return { connectLocal, connect, disconnect, displayNotification }
}

export default connect(mapStateToProps, mapDispatchToProps)(RpcConnection)