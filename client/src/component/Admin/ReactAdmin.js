import React from 'react'
import { Admin, ListGuesser, Resource, fetchUtils, EditGuesser } from 'react-admin'
import simpleRestProvider from 'ra-data-simple-rest'
import { ExerciseList, ProfileList, UserList, WorkoutList,  } from './AdminFiles'
import { ProfileEdit } from './AdminEdit'




const App = () => <Admin dataProvider={simpleRestProvider('http://localhost:3000/api') }>
                     <Resource name="users" list={UserList} />
                     <Resource name="profiles" list={ProfileList} edit={ProfileEdit} />
                     <Resource name="all_plans" list={ListGuesser} />
                     <Resource name="all_workouts" list={WorkoutList} />
                     <Resource name="admin_exercises" list={ExerciseList} />
                    </Admin>

export default App