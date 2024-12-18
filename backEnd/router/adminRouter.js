const adminController=require('../controller/adminController')
const upload = require('../midllware/uploadFile')
const route=require ("express").Router()
/* route.post("/add",adminController.creatAdmin)
route.get("/",adminController.listAdmin) */
route.put("/:id",adminController.updateAdmin)
route.delete("/:id",adminController.deleteAdmin)
/* route.get("/:id",adminController.getAdmin) */
module.exports=route