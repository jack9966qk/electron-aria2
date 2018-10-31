import { connect } from "react-redux"

import SideBar, { StoreProps } from "../views/sideBar"
import { RootState } from "../reducer"
import { countCategory } from "../model/task"
import { isEqual } from "lodash"

var prevCount = undefined
function mapStateToProps(state: RootState): StoreProps {
    const count = countCategory(state.tasks)
    // avoid setting new reference if count has not changed
    if (isEqual(prevCount, count)) {
        return { count: prevCount }
    } else {
        prevCount = count
        return { count: count }
    }
}

export default connect(mapStateToProps)(SideBar)