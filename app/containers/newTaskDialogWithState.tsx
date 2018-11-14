import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootAction } from '../actions'
import { RootState } from '../reducer'
import NewTaskDialog, { DispatchProps, StoreProps } from '../components/NewTaskDialog'
import creators from '../creators'

function mapStateToProps(state: RootState): StoreProps {
    return {
        globalOptions: state.server.options
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    const { addUris, addFiles } = creators(dispatch)
    return { addUris, addFiles }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTaskDialog)