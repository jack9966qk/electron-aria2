import { connect } from "react-redux"

import SideBar, { StoreProps } from "../views/sideBar"

function mapStateToProps(state): StoreProps {
    return {
        tasks: state.tasks
    }
}

export default connect(mapStateToProps)(SideBar)