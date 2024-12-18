const candidateModel = require('../model/candidateModel');
const Candidate = require('../model/candidateModel');

const candidateController = {
    createCandidate: async (req, res) => {
        try {
          // Check if the files are uploaded properly
          req.body['picture'] = req.files && req.files.photo ? req.files.photo[0].filename : "default.png";
          req.body['cv'] = req.files && req.files.cvFile ? req.files.cvFile[0].filename : null;
    
          // Create a new Candidate instance
          const newCandidate = new Candidate(req.body);
          await newCandidate.save((error, item) => {
            if (error) {
              res.status(400).json({
                message: error.message,
                data: null,
              });
            } else {
              res.status(201).json({
                message: "Candidate created successfully",
                data: item,
              });
            }
          });
        } catch (error) {
          res.status(500).json({
            message: "Failed to create candidate: " + error.message,
          });
        }
      },
     
      updateCandidate : async(req,res)=>{
        try{
            const candidate=await candidateModel.updateOne({id:req.params.id},req.body)
            res.status(200).json({
                message:"success",
                data:candidate
            })
    
        }catch{
            res.status(400).json({
                message:"failed"
            })
        }
    },
     
    deleteCandidate : async(req,res)=>{
    try{
        const candidate=await candidateModel.deleteOne({id:req.params.id})
        res.status(200).json({
            message:"success",
            data:candidate
        })
    }catch{
        res.status(400).json({
            message:"failed"
        })
    }
},
  

  listCandidate: async (req, res) => {
    try {
        
        const items = await Candidate.find({}).populate('user', 'fullname email phone address password');
        
        
        res.status(200).json({
            message: "success",
            data: items
        });
    } catch (error) {
        res.status(500).json({
            message: "failed" + error.message,
            data: null
        });
    }
},

 getCandidate : async(req,res)=>{
    try{

        const candidate=await candidateModel.findOne({_id:req.params.id},req.body)
        res.status(200).json({
            message:"success",
            data:candidate
        })

    }catch{
        res.status(400).json({
            message:"failed"
        })
    }

}
};

module.exports = candidateController;