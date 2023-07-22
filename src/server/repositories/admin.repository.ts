import BaseRepository from '../base/base-repository'
import Provider from '../../provider'
import { Admin, AdminAttributes, AdminJoinAttributes } from '../models/admin.model'
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

    findByXid = (xid: string): Promise<AdminAttributes | null> => {
        return Admin.findOne({
            where: { xid },
        })
    }

    // -- Repository Function Port -- //
}
