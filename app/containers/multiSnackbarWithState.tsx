import { connect } from 'react-redux'
import { RootState } from '../reducer'
import MultiSnackbar, { StoreProps } from '../components/MultiSnackbar'

function mapStateToProps(state: RootState): StoreProps {
    return {
        latestNotification: state.latestNotification
    }
}

export default connect(mapStateToProps)(MultiSnackbar)