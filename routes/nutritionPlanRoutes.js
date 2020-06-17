/** @format */

module.exports = (app, models) => {
    app.post("/api/delete_nutrition_plan", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        let {id} = req.body
        await models.NutritionPlan.deleteOne({_id: id})

        res.status(200).send("Success")
    })

    app.get("/api/nutrition_plans", async (req, res, next) => {
        requireLogin(req, res, next)

        const allPlans = await models.NutritionPlan.find({
            creator: req.user.id,
        }).select("-creator")
        res.send(allPlans)
    })

    app.post("/api/create_nutrition_plan", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        let {items, day, name} = req.body
        let itemIds = items.map((item) => item.meal._id)
        let nutrition_plan = new models.NutritionPlan({
            schedule: schedule,
            creator: req.user.id,
            items: itemIds,
            name: name,
        })
        // day ? (nutrition_plan.day = day) : null
        // name ? (nutrition_plan.name = name) : null
        await nutrition_plan.save()

        res.status(200).send("Success")
    })
}
