/** @format */

module.exports = (app, models) => {
    app.get("/api/top_scores", async (req, res) => {
        const topScores = await models.Scores.find()
            .sort("score")
            .limit(10)
        res.send(topScores)
    })

    //START POSTS

    app.post("/api/new_score", async (req, res, next) => {
        let {username, country, score} = req.body

        models.Score.create(
            {
                username,
                score,
                date: Date.now(),
                country,
            },
            (err, score) => {
                if (err) return next(err)
                else return res.status(200).send({score})
            }
        )
    })
}
