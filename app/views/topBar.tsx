import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import SettingsIcon from '@material-ui/icons/Settings'

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

class TopBar extends React.Component<Props, {}> {
    shouldComponentUpdate(prevProps: Props) {
        return this.props.tabs !== prevProps.tabs ||
            this.props.title !== prevProps.title
    }

    render() {
        const props = this.props
        return (
            <AppBar className={props.classes.root}>
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
        )
    }
}

export default withStyles(styles)(TopBar)