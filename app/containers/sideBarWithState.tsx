import { isEqual } from 'lodash'
import { connect } from 'react-redux'
import { countCategory } from '../model/task'
import { RootState } from '../reducer'
import SideBar, { StoreProps } from '../components/sideBar'


var prevCount = undefined
function mapStateToProps(state: RootState): StoreProps {
    const newCount = countCategory(Array.from(state.server.tasks.values()))
    // avoid setting new reference if count has not changed
    const count = isEqual(prevCount, newCount) ? prevCount : newCount
    prevCount = count
    return {
        count: count
    }
}

export default connect(mapStateToProps)(SideBar)