# trufit.app
Autonomous Fitness 

### Hey there welcome to my simple yet complicated fitness app built entirely in JavaScript!

**Tech Stack:**
- React
- Node.js/Express
- MongoDB
- TensorFlow.js

**Some Requirements/Configuration.** <br/>
You'll need mongo db installed locally on your computer or a valid [mLab](https://mlab.com/) account (which is now MongoDB Atlas).
You'll also need to create a dev.js file in the config folder to house your local keys, including the database uri.
Two options for connecting to MongoDB:

- **Local MongoDB.**
  - For a locally installed database add the mongoURI key to the dev module inside the config folder.
  - The defualt uri is: `mongodb://localhost:27017` [MongoDb URI Doc](https://docs.mongodb.com/manual/reference/connection-string/)

- **mLab.**
  - For mLab they will provide you with a URI to connect to the hosted DB, simply add that to the mongoURI key.
  
**Quick Start**<br/>
From the server folder (trufit):
1. ` npm install && cd client/ && npm install `
2. ` npm run dev `
