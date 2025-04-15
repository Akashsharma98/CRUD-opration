const {createUser,getUserByUserId,getUsers,updateUser,deleteUser,login } = require("./user.controller");

const router = require ('express').Router();


const{checkToken} = require('../../auth/token_validation')
const {createValidation,loginValidation} =require('../../auth/authvalidation')
//const {token} = require('../auth/sessionid')

router.post('/',createValidation, createUser);
router.get('/',checkToken , getUsers)
router.get('/:id',checkToken , getUserByUserId)
router.patch('/',checkToken , updateUser)
router.delete('/',checkToken ,deleteUser)
router.post('/login',login,loginValidation)
    

module.exports=router

