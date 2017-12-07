import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/List'
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import CheckCircleIcon from 'material-ui-icons/CheckCircle'
import FileDownloadIcon from 'material-ui-icons/FileDownload'
import ScheduleIcon from 'material-ui-icons/Schedule'
import BlockIcon from 'material-ui-icons/Block'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import blue from 'material-ui/colors/blue'
import classNames from 'classnames'

import { ACTIVE, WAITING, COMPLETED, STOPPED, filterTasks, description } from '../model/taskCategory'

const styles = theme => ({
    listItemIcon: {
        marginRight: 5
    },
    blueIcon: {
        fill: blue[500]
    }
})

class SideBar extends React.Component {
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
                type="persistent"
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