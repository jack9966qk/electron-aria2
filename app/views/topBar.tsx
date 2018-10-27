import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import SettingsIcon from '@material-ui/icons/Settings'

import SmallTooltip from './smallTooltip'

const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex'
        // WebkitUserSelect: 'none'
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});

interface Props {
    classes: any
    title: string
    tabs: JSX.Element
    showMenu: (any) => void
    showSettings: (any) => void
    showAddNewTask: (any) => void
}

const TopBar: React.SFC<Props> = (props) => {
    return (
        <div className={props.classes.root}>
            <AppBar position="sticky">
                <Toolbar>
                    <Hidden only="xs" implementation="css">
                        <IconButton
                            color="secondary"
                            aria-label="Menu"
                            className={props.classes.menuButton}
                            onClick={props.showMenu}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                    <Typography variant="h6" color="inherit" className={props.classes.flex}>
                        {props.title}
                    </Typography>
                    <SmallTooltip title="Settings">
                        <IconButton color="inherit" onClick={props.showSettings}>
                            <SettingsIcon/>
                        </IconButton>
                    </SmallTooltip>
                    <SmallTooltip title="New task">
                        <IconButton color="inherit" onClick={props.showAddNewTask}>
                            <AddIcon/>
                        </IconButton>
                    </SmallTooltip>
                </Toolbar>
                <Hidden smUp implementation="css">
                    {props.tabs}
                </Hidden>
            </AppBar>
        </div>
    )
}

export default withStyles(styles)(TopBar)