import { connect } from "react-redux"

import TaskCategoryTabs, { StoreProps } from "../views/taskCategoryTabs"
import { RootState } from "../reducer"

function mapStateToProps(state: RootState): StoreProps {
    return {

    }
}
  
export default connect(mapStateToProps)(TaskCategoryTabs)