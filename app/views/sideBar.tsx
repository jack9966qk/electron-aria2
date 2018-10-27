import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import FileDownloadIcon from '@material-ui/icons/CloudDownload'
import ScheduleIcon from '@material-ui/icons/Schedule'
import BlockIcon from '@material-ui/icons/Block'
import classnames, * as classNames from 'classnames'

import { TaskCategory, filterTasks, description } from '../model/taskCategory'

const styles = theme => createStyles({
    paper: {
        position: "static",
        maxWidth: 250,
        width: 210, // if set to "auto", transition will not work
        height: "100%",
        whiteSpace: 'nowrap', // to prevent sidebar text from wrapping
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        })
    },
    paperClosed: {
        width: 68,
        overflowX: "hidden",
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })
    },
    listItemIcon: {
        marginRight: 5
    },
    primaryIcon: {
        fill: theme.palette.primary[theme.palette.type]
    }
})

interface ViewProps {
    classes: any
    category: any
    open: boolean
    onCategorySelected: (any) => void
}

export interface DispatchProps {
}

export interface StoreProps {
    tasks: any
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

interface State {}

class SideBar extends React.Component<Props, State> {
    render() {
        const { primaryIcon } = this.props.classes
        const { tasks } = this.props
        const paperClass = classnames(
            this.props.classes.paper,
            !this.props.open && this.props.classes.paperClosed)

        const makeListItem = (icon, category, num) => (
            <ListItem button onClick={() => { this.props.onCategorySelected(category) }}>
                <ListItemIcon className={this.props.classes.listItemIcon}>
                    {React.createElement(
                        icon,
                        category === this.props.category ? {className: primaryIcon} : {}
                    )}
                </ListItemIcon>
                <ListItemText primary={description[category] + ` (${filterTasks(tasks, category).length})`} />
            </ListItem>
        )

        return (
            <Drawer
                variant="permanent"
                anchor="left"
                open={this.props.open}
                classes={{paper: paperClass}}
            >
                <Divider />
                <List>
                    {makeListItem(FileDownloadIcon, TaskCategory.Active, 1)}
                    {makeListItem(ScheduleIcon, TaskCategory.Waiting, 1)}
                    {makeListItem(CheckCircleIcon, TaskCategory.Completed, 1)}
                    {makeListItem(BlockIcon, TaskCategory.Stopped, 1)}
                </List>
            </Drawer>
        )
    }
}

export default withStyles(styles)(SideBar)