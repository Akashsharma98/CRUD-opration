const { create , getUserByUserId,getUsers ,updateUser,deleteUser,getUserByName,updateSessionData} = require ("../user/user.service")
const { genSaltSync, hashSync ,compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const { token } = require("../../auth/sessionid");




module.exports = {
    createUser: (req,res)=> {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt)


    // create session id
    const session_Id = sign({ name: body.name }, "qw123", {
        expiresIn: "1d",
      });
      body.session_Id = session_Id;

        create(body, (err,results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:0,
                    massage:"data base connection error"
                });
            }
            return res.status(200).json({
                success:1,
                massage:"data connect",
                data : results,
                token: session_Id
        
            })

        })
        },
        getUserByUserId:(req,res)=>{
            const id= req.params.id;
            getUserByUserId(id,(err,results)=>{
                if(err){
                    console.log(err);
                    return;
                }
                if(!results){
                    return res.json({
                        success:0,
                        message:'record not found'
                    });                    
                }  
                return res.json({
                    success:1,
                    data:results
                })  ;            
            });
        },
        getUsers:(req,res)=>{
          getUsers((err,results)=>{
            if(err){
                console.log(err)
                return;
            }
            return res.json({
                    success:1,
                    data:results
                });
            });          
        },
        updateUser:(req,res)=>{
            const body = req.body;
            const salt = genSaltSync(10);
            body.password=hashSync(body.password,salt);
            updateUser(body,(err,results)=> {
                if(err){
                    console.log(err);
                    return
                }
                return res.json({
                    success:1,
                    message:'update success'
                });
            });
        },

        deleteUser:(req,res)=>{
           
            const data =req.body;
            
            deleteUser(data, (err,results)=>{

                console.log(data)
                if(err){
                    console.log(err)
                    return
                }
                if(!results){
                    return res.json({
                        success:0,
                        message:'record not fond'
                    })
                }
                return res.json({
                    success:1,
                    message:'delated'
                });
            });
        },

     login:(req,res)=>{
        const body = req.body;        
        getUserByName(body.name,(err,results)=>{
            
            if(err){
                console.log(err);
            }
            if(!results){
                return res.json({
                success:0,
                message:'data not found'
                })
            }
           // console.log("body.password",body.password,"results.password)
            const result = compareSync (body.password, results.password);
            if(results){
                results.password= undefined ;
                const jsontoken= sign({result:results},"qw123",{
                    expiresIn :'1d'
                });
                updateSessionData(results.id, jsontoken, (err, updateRes) =>{
                    if (err) {
                        console.log("Token save error:", err);
                        return res.json({
                            success: 0,
                            message: 'Token update failed'
                        })
                    }
                return res.json({
                    success:1,
                    message:'login',
                    token: jsontoken,                    
                    
                })
            })
            }else{
                res.json({
                    success:0,
                    message:'no login'

                })
            }
        })
      },
            
    };
   /* login: (req, res) => {
        const body = req.body;
    
        getUserByName(body.name, (err, results) => {
            if (err) {
                console.log(err);
                return res.json({
                    success: 0,
                    message: 'Database error'
                });
            }
    
            if (!results) {
                return res.json({
                    success: 0,
                    message: 'Data not found'
                });
            }
    
            const result = compareSync(body.password, results.password);
    
            if (!result) {
                return res.json({
                    success: 0,
                    message: 'Invalid password'
                });
            }
    
            // ✅ Password matched
            results.password = undefined;
            const jsontoken = sign({ result: results }, "qw123", {
                expiresIn: '1h'
            });
    
            // ✅ Save token and update last_login
            updateSessionData(results.id, jsontoken, (err, updateRes) => {
                if (err) {
                    console.log("Token save error:", err);
                    return res.json({
                        success: 0,
                        message: 'Token update failed'
                    });
                }
    
                return res.json({
                    success: 1,
                    message: 'Login successful',
                    token: jsontoken
                });
            });
        });
    }*/
