import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/List'
import { ListItem, ListItemText } from 'material-ui/List'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'

export default class SideBar extends React.Component {
    
    render() {
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
                    <ListItem button> <ListItemText primary="Active" /> </ListItem>
                    <ListItem button> <ListItemText primary="Waiting" /> </ListItem>
                    <ListItem button> <ListItemText primary="Stopped" /> </ListItem>
                </List>
            </Drawer>
        )
    }
}