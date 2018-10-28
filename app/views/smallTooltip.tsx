import * as React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

const styles = (theme: Theme) => createStyles({
    // same tooltip size for all windows sizes
    tooltip: {
        minHeight: 22,
        lineHeight: '22px',
        padding: `0 ${theme.spacing.unit}px`,
        fontSize: theme.typography.pxToRem(10),
    },
    // same tooltip margin for all windows sizes,
    // smaller margin than default
    tooltipPlacementBottom: {
        margin: `${theme.spacing.unit * 0.8}px 0`,
    },
})

const SmallTooltip = (props) => {
    const { classes } = props
    const tooltipClasses = {
        tooltip: classes.tooltip,
        tooltipBottom: classes.tooltipBottom
    }

    return (
        <Tooltip enterDelay={400} classes={tooltipClasses} {...props}>
            {props.children}
        </Tooltip>
    )
}

export default withStyles(styles)(SmallTooltip)