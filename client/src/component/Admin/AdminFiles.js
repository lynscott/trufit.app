import React from 'react'
import { List, Datagrid, TextField, EmailField, NumberField, ReferenceField, ArrayField, DateField, BooleanField, ChipField, 
    SingleFieldList, EditButton  } from 'react-admin'

// DOC For React Admin - https://marmelab.com/react-admin/Tutorial.html#setting-up

export const ExerciseList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            {/* <TextField source="id" /> */}
            {/* <TextField source="DBid" /> */}
        </Datagrid>
    </List>
)


export const ProfileList = props => (
    <List {...props}>
        <Datagrid >
            {/* <TextField source="id" /> */}
            <TextField source="affirmation" />
            <TextField source="messages" />
            <TextField source="events" />
            <TextField source="progressPics" />
            <TextField source="weighIns" />
            <TextField source="macros" />
            <NumberField source="currentGoal.text" />
            {/* <TextField source="nutritionSchedule" /> */}
            <ArrayField source="nutritionItems"><SingleFieldList><ChipField source="carb" /></SingleFieldList></ArrayField>
            <NumberField source="baseSomaType.type" />
            <NumberField source="calories" />
            <EmailField source="email" />
            <ReferenceField source="_user" reference="users">
                <TextField source="name" />
            </ReferenceField>
            <NumberField source="nutritionCalories" />
            <BooleanField source="isAdmin" />
            <EditButton />
        </Datagrid>
    </List>
)


export const UserList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            {/* <TextField source="id" /> */}
            {/* <TextField source="plans" /> */}
            {/* <NumberField source="__v" /> */}
            {/* <TextField source="img" /> */}
            <TextField source="gender" />
            <TextField source="name" />
            <TextField source="googleID" />
            <TextField source="provider" />
            <EmailField source="email" />
            <TextField source="facebookID" />
            <NumberField source="currentWeight" />
            <NumberField source="height" />
            <DateField source="startDate" />
        </Datagrid>
    </List>
)



export const WorkoutList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            {/* <TextField source="id" /> */}
            <TextField source="title" />
            <TextField source="type" />
            <ArrayField source="exercises"><SingleFieldList><ChipField source="note" /></SingleFieldList></ArrayField>
            {/* <ReferenceField source="_id" reference="s"><TextField source="id" /></ReferenceField> */}
        </Datagrid>
    </List>
)