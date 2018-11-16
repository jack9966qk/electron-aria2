import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import * as React from 'react'
import { SnackbarProvider, withSnackbar } from 'notistack'
import { withStyles } from '@material-ui/core/styles'
import { Notification } from '../reducer';

const styles = (theme: Theme) => createStyles({
    snackBarCentered: {
        [theme.breakpoints.up("sm")]: {
            left: '50%',
            right: 'auto',
            transform: 'translateX(-50%)',
        }
    },
    snackBarContent: {
        [theme.breakpoints.up('sm')]: {
            minWidth: 288,
            maxWidth: 568,
            borderRadius: theme.shape.borderRadius,
        },
        [theme.breakpoints.down('xs')]: {
            flexGrow: 1,
        },
    }
})

export interface StoreProps {
    latestNotification: Notification
}

interface ViewProps {
    enqueueSnackbar: Function
    classes: any
}

type Props = StoreProps & ViewProps

class MultiSnackbar extends React.Component<Props> {
    componentDidUpdate(prevProps) {
        if (prevProps.latestNotification !== this.props.latestNotification) {
            const { message, type } = this.props.latestNotification
            this.openSnackbarWith(message, type)
        }
    }

    openSnackbarWith = (text: string, variant?: string) => {
        this.props.enqueueSnackbar(text, {
            variant: variant ? variant : "default",
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "center"
            },
            ContentProps: {
                classes: { root: this.props.classes.snackBarContent }
            }
        })
    }

    render = () => <></>
}

const SnackbarWrapped = withSnackbar(MultiSnackbar as any)
const ProvierWrapped: React.SFC<any> = (props) => (
    <SnackbarProvider maxSnack={3} classes={{
        anchorOriginBottomCenter: props.classes.snackBarCentered
    }}>
        <SnackbarWrapped {...props} />
    </SnackbarProvider>
)

export default withStyles(styles)(ProvierWrapped)