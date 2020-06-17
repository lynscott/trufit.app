/** @format */
const keys = require("../config/keys")

module.exports = (app) => {
    // Slack Feedback
    app.post("/api/send_feedback", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({error: "You must log in!"})
        }

        if (!process.env.NODE_ENV) {
            return res.status(401).send({error: "Feedback only for production"})
        }

        // Change this later if you plan on changing the payload from the frontend
        if (
            !keys.slackWebHook ||
            !req.body["attachments"] ||
            req.body["attachments"].length == 0
        )
            return res.status(500)

        let {
            author_name,
            color,
            fallback,
            footer,
            text,
            title,
            title_link,
        } = req.body["attachments"][0] // Not using, but may be useful in future.
        await fetch(keys.slackWebHook, {
            method: "POST",
            body: JSON.stringify(req.body),
        })
            .then(() => {
                return res
                    .status(200)
                    .send("The feedback was successfully sent!")
            })
            .catch(() => {
                return res.status(500)
            })
    })

    app.get("/api/debug-sentry", function mainHandler(req, res) {
        throw new Error("My first Sentry error!")
    })
}
