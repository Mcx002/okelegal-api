import BaseRepository from '../base/base-repository'
import Provider from '../../provider'
import { Admin, AdminJoinAttributes } from '../models/admin.model'
import { AdminAuth } from '../models/admin-auth.model'

export class AdminRepository extends BaseRepository {
    init(_: Provider) {
        return
    }

    findByEmailJoinAdminAuth = async (email: string): Promise<AdminJoinAttributes | null> => {
        return Admin.findOne({
            where: {
                email,
            },
            include: {
                model: AdminAuth,
                required: true,
                as: 'adminAuth',
            },
        })
    }

    // -- Repository Function Port -- //
}
