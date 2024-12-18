const candidateController=require('../controller/candidateController')
const upload = require('../midllware/uploadFile')
const router=require ("express").Router()
router.post(
    '/add',
    upload.fields([
      { name: 'photo', maxCount: 1 }, 
      { name: 'cvFile', maxCount: 1 }, 
    ]),
    candidateController.createCandidate
  );
router.get("/",candidateController.listCandidate)
router.put("/:id",candidateController.updateCandidate)
router.delete("/:id",candidateController.deleteCandidate)
router.get("/:id",candidateController.getCandidate)

module.exports=router