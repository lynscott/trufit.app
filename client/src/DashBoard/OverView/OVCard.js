import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {useDispatch, useSelector} from 'react-redux'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import {red} from '@material-ui/core/colors'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
    card: {
        // maxWidth: 345
    },
    grid: {
        padding: '16px'
    },
    media: {
        height: 0,
        paddingTop: '56.25%' // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        })
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    avatar: {
        backgroundColor: red[500]
    },
    header: {
        backgroundImage:
            'linear-gradient( to bottom right, rgba(236, 33, 103, 1), rgba(244, 123, 40, 1))'
    }
}))

const CardComponent = props => {
    const classes = useStyles()
    const {children, headline, subheader} = props
    const [expanded, setExpanded] = useState(false)
    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    return (
        <Grid className={classes.grid} xl={3} lg={4} md={4} xs={12} item>
            <Card className={classes.card}>
                <CardHeader
                    action={
                        <IconButton
                            aria-expanded={expanded}
                            onClick={handleExpandClick}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    }
                    className={classes.header}
                    title={headline}
                    subheader={subheader}
                />
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>{children}</CardContent>
                </Collapse>
            </Card>
        </Grid>
    )
}

export default CardComponent
