import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { get } from 'lodash'
import * as React from 'react'
import { Task } from '../model/task'


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

        const makeCell = (subtitle: string, path: string) => {
            const val = get(task, path)
            return val !== undefined ? (
                <div className={classes.cell}>
                    <Typography
                        variant="body2"
                        align="left"
                        component="span"
                        classes={{ root: classes.subtitle }}
                    >
                        {subtitle}
                    </Typography>
                    <Typography
                        variant="caption"
                        align="right"
                        classes={{ root: classes.details }}
                    >
                        {val.toString()}
                    </Typography>
                </div>
            ) : (<></>)
        }

        const cells = (
            <>
                {makeCell("GID", "gid")}
                {makeCell("Total Length", "totalLength")}
                {makeCell("Completed Length", "completedLength")}
                {makeCell("Connections", "connections")}
                {makeCell("Piece Length", "pieceLength")}
                {makeCell("Num Pieces", "numPieces")}
                {makeCell("BitField", "bitfield")}
                {makeCell("Error Code", "errorCode")}
                {makeCell("Error Message", "errorMessage")}
                {makeCell("Followed By", "followedBy")}
                {makeCell("Following", "following")}
                {makeCell("Belongs To", "belongsTo")}
                {makeCell("InfoHash", "infoHash")}
                {makeCell("Num Seeders", "numSeeders")}
                {makeCell("Is Seeder", "seeder")}
                {makeCell("AnnouceList", "bittorrent.announceList")}
                {makeCell("Comment", "bittorrent.comment")}
                {makeCell("Creation Date", "bittorrent.creationDate")}
                {makeCell("File Mode", "bittorrent.mode")}
                {makeCell("Name", "bittorrent.info.name")}
            </>
        )

        return (
            <div className={classes.root}>
                {cells}
            </div>
        )
    }
}


export default withStyles(styles)(TaskDetailsView)