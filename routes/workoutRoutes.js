/** @format */
const requireLogin = require("../middlewares/requireLogin")

module.exports = (app, models) => {
    app.get("/api/plans", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        const userPlans = await models.Plan.find({_user: req.user.id})
        res.send(userPlans)
    })

    app.get("/api/plan_templates", async (req, res, next) => {
        requireLogin(req, res, next)

        const allPlans = await models.PlanTemplates.find()
        res.send(allPlans)
    })

    //TODO: Refactor for less queries
    app.get("/api/active_training_plan", async (req, res, next) => {
        requireLogin(req, res, next)
        let prof = await models.UserProfile.findOne({_user: req.user.id})
        try {
            let activePlan = await models.Plans.findOne({_id: prof.activePlan})
            // console.log(activePlan, 'ACTIVE')
            let template = await models.PlanTemplates.findOne({
                _id: activePlan.template,
            })
            // console.log(template, "TEMPLATE FOUND?")
            res.send({
                ...activePlan._doc,
                name: template.name,
                description: template.description,
            })
            // res.send({...activePlan._doc, days:activePlan.days })
        } catch (error) {
            res.send(null)
        }
    })

    app.get("/api/fetch_workouts", async (req, res, next) => {
        requireLogin(req, res, next)
        const workoutList = await models.Workout.find()
        res.send(workoutList)
    })

    app.post("/api/new_plan_template", async (req, res, next) => {
        // if (!req.user) {
        //     return res.status(401).send({error: "You must log in!"})
        // }
        requireLogin(req, res, next)

        const {plan, workouts, data} = req.body
        const plan_template = new models.PlanTemplates({
            name: plan.title,
            category: plan.category,
            created_date: Date.now(),
            creator: req.user.id,
            workouts: workouts,
            workoutData: data,
        })
        plan.logo ? (plan_template.logo = plan.logo) : null
        plan.description ? (plan_template.description = plan.description) : null

        await plan_template.save()

        res.status(200).send("Success")
    })

    app.post("/api/workout_tracker", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }

        models.UserProfile.findOne({_user: req.user.id}, (err, profile) => {
            if (err) {
                return err
            }

            // If the user has a profile set the plan accordingly.
            if (profile) {
                models.Plans.findOne(
                    {_id: profile.activePlan},
                    async (err, plan) => {
                        if (err) {
                            return err
                        }

                        if (plan) {
                            let arr = [plan.stats]
                            arr.push(req.body)
                            plan.stats = arr
                            await plan.save()
                            res.status(200).send("Success")
                        }
                    }
                )
            } else {
                return res.send(500, {error: "no profile found"})
            }
        })
    })

    app.get("/api/exercises", async (req, res, next) => {
        requireLogin(req, res, next)
        const exerciseList = await models.Exercises.find().select("-_id")
        res.send(exerciseList)
    })

    app.post("/api/new_workout", async (req, res) => {
        if (!req.user) {
            // console.log(req.user)
            return res.status(401).send({error: "You must log in!"})
        }
        let {workout} = req.body
        // console.log(workout)
        let newWorkout = new models.Workout({
            type: workout.type,
            title: workout.title,
            exercises: workout.list,
        })
        await newWorkout.save()
        res.status(200).send("Success")
    })

    app.post("/api/init_training_plan", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        let {workout} = req.body
        // console.log(workout)
        let newWorkout = new models.Plans({
            type: workout.type,
            title: workout.title,
            exercises: workout.list,
        })
        await newWorkout.save()
        res.status(200).send("Success")
    })

    app.get("/api/user_workout_data", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }

        models.UserProfile.findOne({_user: req.user.id}, (err, profile) => {
            if (err) {
                return err
            }

            // If the user has a profile set the plan accordingly.
            if (profile) {
                models.Plans.findOne(
                    {_id: profile.activePlan},
                    async (err, plan) => {
                        if (err) {
                            return err
                        }

                        if (plan) {
                            res.status(200).send(plan.stats)
                        }
                    }
                )
            } else {
                return res.send(500, {error: "no profile found"})
            }
        })
    })

    app.post("/api/new_user_plan", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        let {template, start_date, end_date, days} = req.body
        let user_plan = new models.Plans({
            end_date,
            start_date,
            template,
            days,
        })
        await user_plan.save()

        // Now store the plan into the user profile to keep trac of it.
        models.UserProfile.findOne({_user: req.user.id}, (err, profile) => {
            if (err) {
                return err
            }

            // If the user has a profile set the plan accordingly.
            if (profile) {
                profile.activePlan = user_plan._id
                let arr = [...profile.trainingPlans]
                arr.push(user_plan._id)
                profile.trainingPlans = arr
                profile.save()
            } else {
                return res.send(500, {error: "no profile found"})
            }
        })

        res.status(200).send("Success")
    })
}
