import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import FileDownloadIcon from '@material-ui/icons/CloudDownload'
import ScheduleIcon from '@material-ui/icons/Schedule'
import BlockIcon from '@material-ui/icons/Block'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import blue from '@material-ui/core/colors/blue'

import { ACTIVE, WAITING, COMPLETED, STOPPED, filterTasks, description } from '../model/taskCategory'

const styles = theme => ({
    listItemIcon: {
        marginRight: 5
    },
    blueIcon: {
        fill: blue[500]
    }
})

interface SideBarProps {
    classes: any
    tasks: any
    category: any
    open: boolean
    onCategorySelected: (any) => void
    onClose: () => void
}

interface SideBarState {}

class SideBar extends React.Component<SideBarProps, SideBarState> {
    render() {
        const { blueIcon } = this.props.classes
        const { tasks } = this.props

        const makeListItem = (icon, category, num) => (
            <ListItem button onClick={() => { this.props.onCategorySelected(category) }}>
                <ListItemIcon className={this.props.classes.listItemIcon}>
                    {React.createElement(
                        icon,
                        category === this.props.category ? {className: blueIcon} : {}
                    )}
                </ListItemIcon>
                <ListItemText primary={description[category] + ` (${filterTasks(tasks, category).length})`} />
            </ListItem>
        )

        return (
            <Drawer
                // type="persistent"
                anchor="left"
                open={this.props.open}
            >
                <IconButton onClick={this.props.onClose}>
                    <ChevronLeftIcon />
                </IconButton>
                <Divider />
                <List>
                    {makeListItem(FileDownloadIcon, ACTIVE, 1)}
                    {makeListItem(ScheduleIcon, WAITING, 1)}
                    {makeListItem(CheckCircleIcon, COMPLETED, 1)}
                    {makeListItem(BlockIcon, STOPPED, 1)}
                </List>
            </Drawer>
        )
    }
}

export default withStyles(styles)(SideBar)