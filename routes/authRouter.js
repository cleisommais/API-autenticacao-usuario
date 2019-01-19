import express from "express";
import AccountModel from '../model/accountModel';
import Cryptr from 'cryptr';
import jwt from 'jsonwebtoken';
const authRouter = express.Router();
let securePass = new Cryptr('aes256');

authRouter.route("/").post((req, resp) => {
  try {
    let token = req.headers['token'];
    if (token) {
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
          resp.statusMessage = "Unauthorized";
          resp.status(401).json({
            'codigo': '2',
            'mensagem': 'Token invalido, inexistente ou expirado'
          })
        } else if (decoded) {
          AccountModel.findOne({
            "email": req.body.email
          }, (err, account) => {
            if (err) {
              console.error(err);
              resp.statusMessage = "Bad request";
              resp.status(400).json({
                'codigo': '3',
                'mensagem': 'Dados request enviados incorretos'
              })
            } else if (!account) {
              resp.statusMessage = "Not found";
              resp.status(404).json({
                'codigo': '4',
                'mensagem': 'Usuário não encontrado'
              })
            } else if (req.body.password != securePass.decrypt(account.password)) {
              resp.statusMessage = "Unauthorized";
              resp.status(401).json({
                'codigo': '5',
                'mensagem': 'Password incorreto'
              })
            } else {
              resp.statusMessage = "OK";
              resp.status(200).json({
                'token': token,
                'account': {
                  id: account._id,
                  email: account.email,
                  firstName: account.firstName,
                  lastName: account.lastName
                }
              })
            }
          })
        }
      })
    } else {
      resp.statusMessage = "Unauthorized";
      resp.status(401).json({
        'codigo': '2',
        'mensagem': 'Token invalido, inexistente ou expirado'
      })
    }
  } catch (error) {
    console.error(error);
    resp.statusMessage = "Internal error";
    resp.status(500).json({
      'codigo': '1',
      'mensagem': 'Erro no servidor'
    })
  }
})

export default authRouter;