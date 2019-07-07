import React from 'react'
import { Admin, ListGuesser, Resource, fetchUtils } from 'react-admin'
import simpleRestProvider from 'ra-data-simple-rest'
import { ExerciseList, ProfileList } from './AdminFiles'




const App = () => <Admin dataProvider={simpleRestProvider('http://localhost:3000/api') }>
                     <Resource name="admin_exercises" list={ExerciseList} />
                     <Resource name="profiles" list={ProfileList} />
                    </Admin>

export default App