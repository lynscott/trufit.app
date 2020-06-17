/** @format */

//TODO: Find out if these are in use/can be salvaged, if not delete.

app.post("/api/intake/shred", async (req, res) => {
    if (!req.user) {
        return res.status(401).send({error: "You must log in!"})
    }
    const {age, height, weight, body_fat, activity_mod} = req.body
    let plan = new Plan({
        planName: "Weight Loss",
        height,
        weight,
        body_fat,
        age,
        activity_mod,
        _user: req.user.id,
        datePurchased: Date.now(),
    })
    plan = await plan.save()
    req.user.plans.push(plan.id)
    const user = await req.user.save()
    res.status(200).send(plan)
})

app.post("/api/intake/tone", async (req, res) => {
    if (!req.user) {
        return res.status(401).send({error: "You must log in!"})
    }
    const {age, height, weight, body_fat, activity_mod} = req.body
    let plan = new Plan({
        planName: "Tone & Sculpt",
        height,
        weight,
        body_fat,
        age,
        activity_mod,
        _user: req.user.id,
        datePurchased: Date.now(),
    })
    plan = await plan.save()
    req.user.plans.push(plan.id)
    // const user = await req.user.save()
    res.status(200).send(plan)
})

app.post("/api/intake/strength", async (req, res) => {
    if (!req.user) {
        return res.status(401).send({error: "You must log in!"})
    }
    const {age, height, weight, body_fat, activity_mod} = req.body
    let plan = new Plan({
        planName: "Savage Strength",
        height,
        weight,
        body_fat,
        age,
        activity_mod,
        _user: req.user.id,
        datePurchased: Date.now(),
    })
    plan = await plan.save()
    req.user.plans.push(plan.id)
    const user = await req.user.save()
    res.status(200).send(plan)
})

app.post("/api/freeplans", async (req, res) => {
    // pdf.create(html).toFile('./tmp/trainingplan.pdf', (err, res) => {
    //   console.log(res.filename);
    // });
    const {name, type, person, email} = req.body
    const msg = {
        to: req.body[0].email,
        from: "no-reply@trufit.co",
        subject: "Free Training Plan",
        text: req.body[1].name,
        html: freePlanTemplate(req),
    }
    await sgMail.send(msg)
    res.sendFile("./tmp/trainingplan.pdf")
})

app.post("/api/contactform", async (req, res) => {
    const {affiliation, email} = req.body
    const msg = {
        to: "lscott@tru-fit.co",
        from: "lscott@tru-fit.co",
        subject: "New Beta Request",
        text: "New Requester",
        html: `From: ${email} Affiliation: ${affiliation}`,
    }
    await sgMail.send(msg)
    res.send("200")
})

app.post("/api/trainingform", async (req, res) => {
    const msg = {
        text: "Form Below",
        from: "no-reply@trufit.co",
        to: "LS Fitness <lynscott@lsphysique.com>",
        subject: "Training Form Submission",
        html: trainingTemplate(req),
    }
    await sgMail.send(msg)
    res.send("200")
})

app.post("/api/stripe", async (req, res) => {
    if (!req.user) {
        return res.status(401).send({error: "You must log in!"})
    }
    const charge = await stripe.charges.create({
        amount: 3900,
        currency: "usd",
        description: "Training Plan",
        source: req.body.id,
    })
    // req.user.plans.push('Strength');
    const user = await req.user.save()

    res.status(200).send(user)
})
