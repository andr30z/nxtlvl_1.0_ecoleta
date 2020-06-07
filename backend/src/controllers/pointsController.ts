import knex from '../database/connection';
import { Request, Response } from 'express';

export default class PointsController {
    async create(req: Request, res: Response) {
        const {
            image, name, email, whatsapp, latitude, longitude, city, uf, items
        } = req.body;
        const point = { image: req.file.filename, name, email, whatsapp, latitude, longitude, city, uf };
        const trx = await knex.transaction();

        const idPoint = await trx('points').insert({
            image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name, email, whatsapp, latitude, longitude, city, uf
        });

        const pointItems = items
            .split(",")
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id: idPoint[0]
                }
            });
        await trx('point_items').insert(pointItems);

        await trx.commit();
        return res.json({
            id: idPoint[0],
            ...point
        })

    }

    async show(req: Request, res: Response) {
        const { id } = req.params;
        const point = await knex('points').where('id', id).first();

        if (!point) {
            return res.status(400).json({ message: 'Ponto não encontrado!' });
        }

        const serializedPoint = {
            ...point,
            imageUrl: `http://192.168.25.45:3333/temp/${point.image}`
        };

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return res.json({ point: serializedPoint, items });
    }

    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                imageUrl: `http://192.168.25.45:3333/temp/${point.image}`
            }
        });
        return res.json(serializedPoints);
    }
}

