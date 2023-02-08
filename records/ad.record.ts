import {AdEntity, NewAdEntity, SimpleAdEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type AdRecordsResults = [AdEntity[], FieldPacket[]];

export class AdRecord implements AdEntity {
    public id: string;
    public name: string;
    public description: string;
    public price: number;
    public url: string;
    public lat: number;
    public lon: number;
    constructor(obj: NewAdEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Nazwa ogłoszenia nie może być pusta, ani przekraczać 100 znaków');
        }
        if (obj.description.length > 1024) {
                throw new ValidationError('Nazwa ogłoszenia nie może być pusta, nie może przekraczać  1000 znaków');
        }
            if (obj.price < 0 || obj.price > 999999) {
                throw new ValidationError('Cena nie może być mniejsza niż 0 lub większa niż 9 999 999');

        }

        // @ TODO: Check if URL is valid!
                if (!obj.url || obj.url.length> 100) {
                throw new ValidationError('Adres ogłoszenia nie może być pusty, anie przekraczać 100 znaków.');
                }

                if (typeof obj.lat !== 'number' || typeof obj.lon !== 'number') {
            throw new ValidationError('Nie można zaktualizować ogłoszenia');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description;
        this.price = obj.price;
        this.url = obj.url;
        this.lat = obj.lat;
        this.lon = obj.lon;
}
    static async getOne(id: string): Promise<AdRecord> | null {
        const [results] = await pool.execute("SELECT * FROM `ads` WHERE id = :id", {
            id,
        }) as AdRecordsResults;

        return results.length === 0 ? null : new AdRecord(results[0]);
    }

    static async findAll(name: string): Promise<SimpleAdEntity[]> {
        const [results] = await pool.execute("Select * FROM `ads` WHERE `name` LIKE :search", {
            search: `%${name}%`,
        }) as AdRecordsResults;

        return results.map(result => {
            const {
                id, lat, lon,
            } = result;
            return {
                id, lat ,lon,
            };
        })
    }
}
