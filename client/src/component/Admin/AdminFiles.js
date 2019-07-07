import React from 'react'
import { List, Datagrid, TextField, EmailField, NumberField, ReferenceField, ArrayField, DateField, BooleanField, ChipField, 
    SingleFieldList  } from 'react-admin'

export const ExerciseList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="id" />
            {/* <TextField source="DBid" /> */}
        </Datagrid>
    </List>
)


export const ProfileList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="affirmation" />
            <TextField source="messages" />
            <TextField source="events" />
            <TextField source="progressPics" />
            <TextField source="weighIns" />
            <TextField source="macros" />
            <NumberField source="currentGoal.text" />
            {/* <TextField source="nutritionSchedule" /> */}
            {/* <ArrayField source="nutritionItems"><SingleFieldList><ChipField source="carb" /></SingleFieldList></ArrayField> */}
            {/* <NumberField source="__v" /> */}
            <NumberField source="baseSomaType.type" />
            <NumberField source="calories" />
            {/* <TextField source="_user" /> */}
            <EmailField source="email" />
            {/* <ReferenceField source="_id" reference="s"><TextField source="_id" /></ReferenceField> */}
            <NumberField source="nutritionCalories" />
            <BooleanField source="isAdmin" />
        </Datagrid>
    </List>
)