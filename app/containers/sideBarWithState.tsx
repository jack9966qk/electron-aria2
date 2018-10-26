import { connect } from "react-redux"

import SideBar, { StoreProps } from "../views/sideBar"
import { RootState } from "../reducer"

function mapStateToProps(state: RootState): StoreProps {
    return {
        tasks: state.tasks
    }
}

export default connect(mapStateToProps)(SideBar)