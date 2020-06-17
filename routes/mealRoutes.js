/** @format */

module.exports = (app, models) => {
    app.get("/api/meals", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        const userMeals = await models.Meals.find({
            creator: req.user.id,
        }).select("-creator")
        res.send(userMeals)
    })

    app.post("/api/edit_meal", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        const userMeal = await models.Meals.findOne({_id: req.body.id})
        userMeal.items = req.body.meal

        await userMeal.save()

        res.status(200).send("Success")
    })

    app.post("/api/add_item", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }

        const userMeal = await models.Meals.findOne({_id: req.body.id})
        let tempItems = userMeal.items
        tempItems.push(req.body.food)

        userMeal.items = tempItems

        await userMeal.save()

        res.status(200).send("Success")
    })

    app.post("/api/delete_meal", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        let {id} = req.body
        await models.Meals.deleteOne({_id: id})

        res.status(200).send("Success")
    })

    app.post("/api/new_meal", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }
        let {name} = req.body
        let meal = new models.Meals({
            // items: items,
            // time: time,
            name,
            creator: req.user.id,
        })
        await meal.save()
        res.status(200).send("Success")
    })

    ////////////////////////////////
    /////*  For Meal Logging  */////
    ////////////////////////////////

    app.post("/api/log_meal", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }

        if (!("item" in req.body))
            return res.status(400).send({error: "Invalid food items"})

        if (!("date" in req.body) || !req.body.date)
            return res.status(400).send({error: "Invalid date entry"})

        let {item, date, meal} = req.body

        console.log(item, "ITEM")

        const log = new models.FoodLog({
            item: item,
            meal: meal,
            _user: req.user.id,
            date: date,
        })

        log.save()
        console.log(log, "LOG")

        return res.status(200).send({log})
    })

    app.post("/api/get_food_log", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }

        let logs = await models.FoodLog.find({_user: req.user.id})

        return res.status(200).send({logs})
    })
}
