import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import SettingsIcon from '@material-ui/icons/Settings'
import ServerIcon from '@material-ui/icons/Router'
import LocalIcon from '@material-ui/icons/Computer'

import SmallTooltip from './smallTooltip'

const styles = (theme: Theme) => createStyles({
    root: {
        position: "static"
    },
    flex: {
        flex: 1, // for text to take as much width as possible
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        color: theme.palette.primary.contrastText
    },
    buttonIcon: {
        marginRight: theme.spacing.unit
    }
})

interface Props {
    classes: any
    title: string
    tabs: JSX.Element
    isLocalServer: boolean
    showMenu: (any) => void
    showSettings: (any) => void
    showAddNewTask: (any) => void
    showConnectionDialog: (any) => void
}

class TopBar extends React.Component<Props, {}> {
    shouldComponentUpdate(nextProps: Props) {
        return true
    }

    render() {
        const {
            title,
            isLocalServer,
            showMenu,
            showSettings,
            showAddNewTask,
            showConnectionDialog,
            tabs,
            classes
        } = this.props
        return (
            <AppBar className={classes.root}>
                <Toolbar>
                    <Hidden only="xs" implementation="css">
                        <IconButton
                            color="secondary"
                            aria-label="Menu"
                            className={classes.menuButton}
                            onClick={showMenu}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                    <Typography variant="h6" color="inherit" className={classes.flex}>
                        {title}
                    </Typography>
                    <SmallTooltip title="Server Connection">
                        <Button color="inherit" onClick={showConnectionDialog}>
                            {isLocalServer ?
                                <LocalIcon classes={{ root: classes.buttonIcon }} /> :
                                <ServerIcon classes={{ root: classes.buttonIcon }} />}
                            {isLocalServer ? "Local" : "Remote"}
                        </Button>
                    </SmallTooltip>
                    <SmallTooltip title="Settings">
                        <IconButton color="inherit" onClick={showSettings}>
                            <SettingsIcon />
                        </IconButton>
                    </SmallTooltip>
                    <SmallTooltip title="New task">
                        <IconButton color="inherit" onClick={showAddNewTask}>
                            <AddIcon />
                        </IconButton>
                    </SmallTooltip>
                </Toolbar>
                <Hidden smUp implementation="css">
                    {tabs}
                </Hidden>
            </AppBar>
        )
    }
}

export default withStyles(styles)(TopBar)