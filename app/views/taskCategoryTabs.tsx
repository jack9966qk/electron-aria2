import * as React from 'react'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import FileDownloadIcon from '@material-ui/icons/CloudDownload'
import ScheduleIcon from '@material-ui/icons/Schedule'
import BlockIcon from '@material-ui/icons/Block'

import { TaskCategory } from '../model/taskCategory'

interface ViewProps {
    category: TaskCategory
    onCategorySelected: Function
}

export interface DispatchProps {
}

export interface StoreProps {
    tasks: any[]
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

const TaskCategoryTabs: React.SFC<Props> = (props) => {
    const categories = [
        [TaskCategory.Active, FileDownloadIcon],
        [TaskCategory.Waiting, ScheduleIcon],
        [TaskCategory.Completed, CheckCircleIcon],
        [TaskCategory.Stopped, BlockIcon]
    ]
    const onChange = (_, value) => {
        props.onCategorySelected(categories[value][0])
    }
    const value = categories.map(item => item[0]).indexOf(props.category)
    return (
        <Tabs fullWidth value={value} onChange={onChange}>
            {
                categories.map((item) => {
                    const [cat, icon] = item
                    return <Tab key={cat as React.ReactText} icon={React.createElement(icon)} />
                })
            }
        </Tabs>
    )
}

export default TaskCategoryTabs