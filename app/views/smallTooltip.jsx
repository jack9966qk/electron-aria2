import React from 'react'
import Tooltip from 'material-ui/Tooltip'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    // same tooltip size for all windows sizes
    tooltip: {
        minHeight: 22,
        lineHeight: '22px',
        padding: `0 ${theme.spacing.unit}px`,
        fontSize: theme.typography.pxToRem(10),
    },
    // same tooltip margin for all windows sizes,
    // smaller margin than default
    tooltipBottom: {
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