import Dialog from '@material-ui/core/Dialog'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import * as React from 'react'

class ResponsiveDialog extends React.Component<any, {}> {
    render() {
        const { fullScreen, open, children, ...others } = this.props
        return (
            <Dialog fullScreen={fullScreen} open={open} {...others}>
                {this.props.children}
            </Dialog>
        )
    }
}

// had to cast the prop type to prevent TypeScript compile time error
export default withMobileDialog({ breakpoint: "xs" })(ResponsiveDialog) as React.ComponentType<any>