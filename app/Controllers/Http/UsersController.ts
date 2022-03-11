// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import {schema, rules} from '@ioc:Adonis/Core/Validator'


export default class UsersController {

    public async login({auth, request, response}){
        const email = request.input('email')
        const password = request.input('password')

        try{
            const token = await auth.use('api').attempt(email, password)
            return token; 
            
        }catch{
            return response.badRequest('Error al iniciar')
        }
    }
    
    public async signup({request, response}){

        const UsersSchema = schema.create({
            email: schema.string(
                {trim: true},
                [rules.email(), rules.required()]
            ),
            password: schema.string(
                {trim: true},
                [rules.required()]
            )
        })

        const myUser: any = await request.validate({schema: UsersSchema})
        await User.create(myUser)

        return response.created(myUser)
    }

    public async index({auth, response}){
        await auth.use('api').authenticate(); //verificar token
        const user = await User.all();
        return response.ok(user);
    }

    public async verificarToken({auth,response}){
        try{
            await auth.use('api').authenticate() //Solicitar id
            return response.ok(true);
        } catch{
            return response.forbidden(false);
        }
    }

    /*
    RESPONSES:
    return response.forbidden(false); 403
    return response.ok(true);
    return response.created(myUser) 201
    return response.badRequest('Error al iniciar')
    */

}

