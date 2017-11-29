import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import AddIcon from 'material-ui-icons/Add'
import SettingsIcon from 'material-ui-icons/Settings'

const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flex: 'auto',
        WebkitUserSelect: 'none'
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});
  

function TopBar(props) {
    return (
        <div className={props.classes.root}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="contrast"
                        aria-label="Menu"
                        className={props.classes.menuButton}
                        onClick={props.showMenu}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography type="title" color="inherit" className={props.classes.flex}>
                        Aria2 Control
                    </Typography>
                    <IconButton color="contrast" onClick={props.showSettings}>
                        <SettingsIcon/>
                    </IconButton>
                    <IconButton color="contrast" onClick={props.showAddNewTask}>
                        <AddIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    )
}

TopBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar)