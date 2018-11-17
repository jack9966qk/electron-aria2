import { connect } from 'react-redux'
import { RootState } from '../reducer'
import ConnectionDialog, { StoreProps } from '../components/ConnectionDialog'

function mapStateToProps(state: RootState): StoreProps {
    const { hostUrl, secret, version, enabledFeatures } = state.server
    return {
        hostUrl, secret, version, enabledFeatures
    }
}

export default connect(mapStateToProps)(ConnectionDialog)