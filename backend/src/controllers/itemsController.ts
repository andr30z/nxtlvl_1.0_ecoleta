import knex from '../database/connection';
import { Request, Response } from 'express';

export default class itemsController {
    async index(req: Request, res: Response){
        const items = await knex('items').select('*')

        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                imageUrl: `http://192.168.25.45:3333/temp/${item.image}`
            }
        });
        return res.json(serializedItems);
    }
}