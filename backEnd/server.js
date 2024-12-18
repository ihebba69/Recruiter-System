const express = require("express")
const app = express()
const db = require('./db')
const port=5000
const cors = require("cors")
app.use(cors())
app.use(express.json())
const bodyParser = require('body-parser');



app.use(bodyParser.json());


const candidateRouter=require('./router/candidateRouter')
app.use("/candidate",candidateRouter)

const candidatureRouter=require('./router/candidatureRouter')
app.use("/candidature",candidatureRouter)

const adminRouter=require('./router/adminRouter')
app.use("/admin",adminRouter)

const userRouter=require('./router/userRouter')
app.use("/user",userRouter)

const jobOfferRouter=require('./router/jobOfferRouter')
app.use("/jobOffer",jobOfferRouter)

const enterpriseRouter=require('./router/entrepriseRouter')
app.use("/entreprise",enterpriseRouter)

const authRouter=require('./router/authRouter')
app.use("/auth",authRouter)

const evaluationRouter=require('./router/evaluationRouter')
app.use("/evaluation",evaluationRouter)

const recommendationRouter=require('./router/recommendationRouter')
app.use("/recommendation",recommendationRouter)

const testRouter=require('./router/testRouter')
app.use("/test",testRouter)


const questionRouter=require('./router/questionRouter')
app.use("/question",questionRouter)

const responseRouter=require('./router/responseRouter')
app.use("/response",responseRouter)


app.listen(port,function(){
    console.log("server is runnig successfuly")
 })
