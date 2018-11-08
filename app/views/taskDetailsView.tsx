import * as React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import createStyles from '@material-ui/core/styles/createStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Typography from '@material-ui/core/Typography'

import { Task, isBittorrent } from '../model/task'

const styles = (theme: Theme) => createStyles({
    root: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gridRowGap: `${theme.spacing.unit * 0.75}px`,
        gridColumnGap: `${theme.spacing.unit * 1.5}px`
    },
    cell: {
        display: "flex",
        alignItems: "center"
    },
    details: {
        flex: 1,
        minWidth: "0px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        marginLeft: `${theme.spacing.unit * 1.5}px`
    }
})


interface Props {
    task: Task
    classes: any
}

class TaskDetailsView extends React.Component<Props, {}> {
    render() {
        const { task, classes } = this.props

        const makeCell = (subtitle: string, details: string) => (
            <div className={classes.cell}>
                <Typography
                    variant="body2"
                    align="left"
                    component="span"
                    classes={{root: classes.subtitle}}
                >
                    {subtitle}
                </Typography>
                <Typography
                    variant="caption"
                    align="right"
                    classes={{root: classes.details}}
                >
                    {details}
                </Typography>
            </div>
        )

        const cells = (
            <>
                { makeCell("GID", task.gid) }
                { makeCell("Total Length", task.totalLength) }
                { makeCell("Completed Length", task.completedLength) }
                { makeCell("Connections", task.connections) }
                { makeCell("Piece Length", task.pieceLength) }
                { makeCell("Num Pieces", task.numPieces) }
                
            </>
        )

        // TODO: handle these optional fields
        // { makeCell("BitField", task.bitfield) }
        // { makeCell("Error Code", task.errorCode) }
        // { makeCell("Error Message", task.errorMessage) }
        // { makeCell("Followed By", task.followedBy.toString()) }
        // { makeCell("Following", task.following) }
        // { makeCell("Belongs To", task.belongsTo) }

        const btCells = isBittorrent(task) ? (
            <>
                { makeCell("InfoHash", task.infoHash) }
                { makeCell("Num Seeders", task.numSeeders) }
                { makeCell("Is Seeder", task.seeder.toString()) }
                { makeCell("AnnouceList", task.bittorrent.announceList.toString()) }
                { makeCell("Comment", task.bittorrent.comment) }
                { makeCell("Creation Date", task.bittorrent.creationDate.toString()) }
                { makeCell("File Mode", task.bittorrent.mode) }
                { makeCell("Name", task.bittorrent.info.name) }
            </>
        ) : (<></>)

        return (
            <div className={classes.root}>
                { cells }
                { btCells }
            </div>
        )
    }
}


export default withStyles(styles)(TaskDetailsView)