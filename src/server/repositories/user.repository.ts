import BaseRepository from '../base/base-repository'
import { User, UserAttributes, UserCreationAttributes } from '../models/user.model'
import Provider from '../../provider'
import { Logger } from 'winston'

export class UserRepository extends BaseRepository {
    log!: Logger
    init(provider: Provider): void {
        this.log = provider.logger
    }

    findByXid = (xid: string): Promise<UserAttributes | null> => {
        return User.findOne({ where: { xid } })
    }

    insert = (row: UserCreationAttributes): Promise<UserAttributes> => {
        return User.create(row)
    }

    update = async (row: UserAttributes): Promise<number> => {
        const [count] = await User.update(row, { where: { id: row.id } })

        return count
    }

    deleteById = (id: number): Promise<number> => {
        return User.destroy({ where: { id } })
    }

    findOrCreateByEmail = (email: string, defaultValue: UserCreationAttributes): Promise<[UserAttributes, boolean]> => {
        return User.findOrCreate({
            where: {
                email,
            },
            defaults: defaultValue,
        })
    }
}
