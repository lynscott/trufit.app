import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Meals from "@material-ui/icons/LocalGroceryStore";
import Nutrition from "@material-ui/icons/Kitchen";
import AssessmentIcon from "@material-ui/icons/Assessment";
import MealPanels from "./Meals";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import SwipeableViews from "react-swipeable-views";

const useStyles = makeStyles({
  root: {
    width: "100%",
    position: "fixed",
    bottom: 0,
    top: "auto"
  },
  mealGrid: {
    overflowY: "scroll",
    height: "100%",
    backgroundColor: "white",
    padding: "20px"
  },
  gridStyle: {
    backgroundColor: "white"
  }
});

export default function SimpleBottomNavigation() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [index, setValue] = useState(0);

  const handleChange = (event, value) => {
    setValue(value);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  return (
    <Grid className={classes.gridStyle} item container xs={12}>
      <SwipeableViews
        style={{ height: "80vh" }}
        index={index}
        onChangeIndex={handleChangeIndex}
      >
        <Grid container item xs={12} className={classes.mealGrid}>
          <MealPanels />
        </Grid>
        <Grid>Nutrition</Grid>
        <Grid>Stats</Grid>
      </SwipeableViews>

      <Grid item xs={12}>
        <BottomNavigation
          value={index}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          showLabels
          // style={{width:'100%'}}
          className={classes.root}
        >
          <BottomNavigationAction label="Meals" icon={<Meals />} />
          <BottomNavigationAction
            label="Nutrition Plans"
            icon={<Nutrition />}
          />
          <BottomNavigationAction label="Stats" icon={<AssessmentIcon />} />
        </BottomNavigation>
      </Grid>
    </Grid>
  );
}
