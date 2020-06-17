/** @format */

const objMapper = (obj) => {
    let ret = []
    obj.map((p, i) => {
        let prof = {
            id: p._id,
            ...p._doc,
        }
        ret.push(prof)
    })
    return ret
}

//TODO: import models

module.export = (app) => {
    //// BEGIN APIS FOR ADMIN PANEL ////////

    app.delete("/api/users", async (req, res, next) => {
        requireLogin(req, res, next)
        let item = req.body.id
        await models.NutritionPlan.deleteOne({_id: item})
        res.status(200).send("Success")
    })

    app.get("/api/users", async (req, res, next) => {
        requireLogin(req, res, next)
        const users = await User.find().select("-password -v")

        res.set("Content-Range", "users" + " " + users.length)
        res.set("Access-Control-Expose-Headers", "Content-Range")
        res.send(objMapper(users))
    })

    app.get("/api/profiles", async (req, res, next) => {
        requireLogin(req, res, next)
        const profiles = await UserProfile.find()
        res.set("Content-Range", "profiles" + " " + profiles.length)
        res.set("Access-Control-Expose-Headers", "Content-Range")
        res.send(objMapper(profiles))
    })

    app.get("/api/all_plans", async (req, res, next) => {
        requireLogin(req, res, next)
        const plans = await Plan.find()

        res.set("Content-Range", "plans" + " " + plans.length)
        res.set("Access-Control-Expose-Headers", "Content-Range")
        res.send(objMapper(plans))
    })

    app.get("/api/all_workouts", async (req, res, next) => {
        requireLogin(req, res, next)
        const workouts = await Workout.find()

        res.set("Content-Range", "workouts" + " " + workouts.length)
        res.set("Access-Control-Expose-Headers", "Content-Range")
        res.send(objMapper(workouts))
    })

    app.get("/api/admin_exercises", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        const exerciseList = await Exercises.find()
        res.set("Content-Range", "exercises" + " " + exerciseList.length)
        res.set("Access-Control-Expose-Headers", "Content-Range")
        res.send(objMapper(exerciseList))
    })

    app.param("prof_id", async (req, res, next, id) => {
        const userProf = await UserProfile.findOne({_id: id})
        req.plan = userProf

        next()
    })

    app.get("/api/profiles/:prof_id", async (req, res) => {
        // console.log('Request Id:', req.params.id);
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        res.send(req.params.prof_id)
    })

    app.param("id", async (req, res, next, id) => {
        const userPlan = await models.Plan.findOne({_id: id})
        req.plan = userPlan

        next()
    })

    app.get("/api/plans/:id", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        res.send(req.plan)
    })

    //// END ////////
}
