import * as React from 'react'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import FileDownloadIcon from '@material-ui/icons/CloudDownload'
import ScheduleIcon from '@material-ui/icons/Schedule'
import BlockIcon from '@material-ui/icons/Block'

import { TaskCategory } from '../model/task'

interface ViewProps {
    category: TaskCategory
    onCategorySelected: Function
}

export interface DispatchProps {
}

export interface StoreProps {
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

class TaskCategoryTabs extends React.Component<Props, {}> {
    shouldComponentUpdate(nextProps) {
        return this.props.category !== nextProps.category
    }

    render() {
        const categories = [
            [TaskCategory.Active, FileDownloadIcon],
            [TaskCategory.Waiting, ScheduleIcon],
            [TaskCategory.Completed, CheckCircleIcon],
            [TaskCategory.Stopped, BlockIcon]
        ]
        const onChange = (_, value) => {
            this.props.onCategorySelected(categories[value][0])
        }
        const value = categories.map(item => item[0]).indexOf(this.props.category)
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
}

export default TaskCategoryTabs