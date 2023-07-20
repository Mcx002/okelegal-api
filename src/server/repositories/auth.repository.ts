import BaseRepository from '../base/base-repository'
import Provider from '../../provider'
import { ClientAuth, ClientAuthAttributes } from '../models/client-auth.model'
import { AuthSession, AuthSessionAttributes, AuthSessionCreationAttributes } from '../models/auth-session.model'
import got from 'got'
import { GoogleJsonWebKey, GoogleSignInTokenResponse } from '../../dto/auth.dto'
import { errors } from '../constants/error.constant'
import { myConfig } from '../../config'

export class AuthRepository extends BaseRepository {
    init(_: Provider) {
        return
    }

    findClientAuthByClientId = (clientId: string): Promise<ClientAuthAttributes | null> => {
        return ClientAuth.findOne({
            where: {
                clientId,
            },
        })
    }

    findAuthSessionByXid = (xid: string): Promise<AuthSessionAttributes | null> => {
        return AuthSession.findOne({
            where: {
                xid,
            },
        })
    }

    findGoogleToken = async (url: string): Promise<GoogleSignInTokenResponse> => {
        try {
            const res = await got.post(url)
            return JSON.parse(res.body) as GoogleSignInTokenResponse
        } catch (e) {
            this.logger.error('Failed to get google token')
            throw errors.sessionExpired
        }
    }

    findGoogleJsonWebKey = async (): Promise<GoogleJsonWebKey> => {
        try {
            const res = await got.get('https://www.googleapis.com/oauth2/v3/certs')
            return JSON.parse(res.body) as GoogleJsonWebKey
        } catch (e) {
            this.logger.error('Failed to get google json web keys')
            throw errors.googleHttpRequest
        }
    }

    findGooglePrivacyEnhanceMail = async (): Promise<{ [k: string]: string }> => {
        try {
            const res = await got.get(myConfig.googleUrlAuthProvider)
            return JSON.parse(res.body)
        } catch (e) {
            this.logger.error('Failed to get google PEMs')
            throw errors.googleHttpRequest
        }
    }

    createAuthSession = async (row: AuthSessionCreationAttributes): Promise<AuthSessionAttributes> => {
        return AuthSession.create(row)
    }

    // -- Repository Function Port -- //
}
