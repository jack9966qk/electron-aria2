import React from 'react'
import Tabs, { Tab } from 'material-ui/Tabs'
import CheckCircleIcon from 'material-ui-icons/CheckCircle'
import FileDownloadIcon from 'material-ui-icons/FileDownload'
import ScheduleIcon from 'material-ui-icons/Schedule'
import BlockIcon from 'material-ui-icons/Block'

import { ACTIVE, WAITING, COMPLETED, STOPPED, filterTasks, description } from '../model/taskCategory'

const TaskCategoryTabs = (props) => {
    const { tasks } = props
    const categories = [
        [ACTIVE, FileDownloadIcon],
        [WAITING, ScheduleIcon],
        [COMPLETED, CheckCircleIcon],
        [STOPPED, BlockIcon]
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
                    // return <Tab key={cat} icon={React.createElement(icon)} label={description[cat]} />
                    return <Tab key={cat} icon={React.createElement(icon)} />
                })
            }
        </Tabs>
    )
}

export default TaskCategoryTabs