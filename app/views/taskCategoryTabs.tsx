import * as React from 'react'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import FileDownloadIcon from '@material-ui/icons/CloudDownload'
import ScheduleIcon from '@material-ui/icons/Schedule'
import BlockIcon from '@material-ui/icons/Block'

import { ACTIVE, WAITING, COMPLETED, STOPPED } from '../model/taskCategory'

interface TaskCategoryTabsProps {
    category: string
    onCategorySelected: Function
}

const TaskCategoryTabs: React.SFC<TaskCategoryTabsProps> = (props) => {
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
                    return <Tab key={cat as React.ReactText} icon={React.createElement(icon)} />
                })
            }
        </Tabs>
    )
}

export default TaskCategoryTabs