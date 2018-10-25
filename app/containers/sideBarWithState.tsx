import { connect } from "react-redux"

import SideBar from "../views/sideBar"

function mapStateToProps(state) {
    return {
        tasks: state.tasks
    }
}

export default connect(mapStateToProps)(SideBar)