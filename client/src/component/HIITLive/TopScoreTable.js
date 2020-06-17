import React, {useState, useEffect} from 'react'
import Typography from '@material-ui/core/Typography'
import {useDispatch, useSelector} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import {tableIcons} from './tableIcons'
import MaterialTable from 'material-table'

export default function TopScores() {
    const scores = useSelector(state => state.scores.topScores)
    return (
        <Grid
            container
            style={{maxWidth: '100%', backgroundColor: 'black', color: 'white'}}
        >
            <Grid item xs={12}>
                <Typography style={{color: 'white'}} variant="h2">
                    Stay Safe. Stay Home. Stay Fit.
                </Typography>
                <MaterialTable
                    columns={[
                        {title: 'username', field: 'username'},
                        {title: 'score', field: 'score', type: 'numeric'},
                        {title: 'country', field: 'country'}
                    ]}
                    style={{
                        backgroundColor: 'black',
                        color: 'white',
                        opacity: 0.7
                    }}
                    data={[
                        ...scores,
                        {
                            username: 'Joe Exotic',
                            score: 10000,
                            country: 'merica'
                        }
                    ]}
                    icons={tableIcons}
                    title="Top Scores"
                />
            </Grid>
        </Grid>
    )
}
