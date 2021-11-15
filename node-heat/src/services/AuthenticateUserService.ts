import axios from "axios";
import prismaClient from "../prisma"
import  { sign } from "jsonwebtoken"
/* 

1. Receber o code(string)
2. Recuperar o access_token do github
3. Verificar se o usu[ario existe no DB
---- SIM = Gerar o Token
---- NÃO = Criar no DB, gera um token
4. Retornar o token com as infos do user

*/

interface IAccessTokenResponse {
    access_token: string

}
interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService  {
    async execute (code: string) {
        const url = "https://github.com/login/oauth/access_token";

        const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null,{
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers:{
                "Accept": "application/json"
            }
        })
        const response = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers: {
                authorization:`Bearer ${accessTokenResponse.access_token}`
            }
        })
        const { login, id, avatar_url, name } = response.data
        let user = await prismaClient.user.findFirst({
            where:{
                github_id: id
            }
        })
        if (!user){
            user = await prismaClient.user.create({
                data:{
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }
            })
        }
        const token = sign(
            {
                user: {
                    name: user.name,
                    avatar_url: user.avatar_url,
                    id: user.id
                }
            },
            process.env.JWT_SECRET,
            {
                    subject: user.id,
                    expiresIn: "1d"
            }
            
            )
        return { token, user };
    }
}
export { AuthenticateUserService }