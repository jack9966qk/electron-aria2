import { connect } from "react-redux"

import SideBar, { StoreProps } from "../views/sideBar"
import { RootState } from "../reducer"
import { countCategory } from "../model/task"

function mapStateToProps(state: RootState): StoreProps {
    return {
        count: countCategory(state.tasks)
    }
}

export default connect(mapStateToProps)(SideBar)