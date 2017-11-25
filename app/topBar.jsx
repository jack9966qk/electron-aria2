import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 3,
        width: '100%',
        display: 'flex',
        flex: 'auto'
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
    const connectionStatus = props.rpc === undefined ? "Connecting..." : "Connected"
    const versionStatus = props.version === undefined ? "" : "Version: " + props.version
    return (
        <div className={props.classes.root}>
            <AppBar position="static">
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
                        Aria2 Control ({connectionStatus}, {versionStatus})
                    </Typography>
                    <Button color="contrast" onClick={props.showAddNewTask}>New Task</Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}

TopBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar)