import { getEnvNumber, getEnvString } from './utils/env-parsers'

export enum NodeEnvType {
    Production = 'production',
    Development = 'development',
    Test = 'test',
}

export default class EnvConfiguration {
    // Service Environment
    nodeEnv = getEnvString('NODE_ENV', NodeEnvType.Development)
    port = getEnvNumber('PORT', 3000)

    // App Environment
    appName = getEnvString('APP_NAME', '')
    appVersion = getEnvString('APP_VERSION', '')
    appUrlPrefix = getEnvString('APP_URL_PREFIX', '/')

    // Database Configuration
    dbName = getEnvString('DB_NAME')
    dbUsername = getEnvString('DB_USERNAME')
    dbPassword = getEnvString('DB_PASSWORD')
    dbDialect = getEnvString('DB_DIALECT', 'postgres')
    dbHost = getEnvString('DB_HOST', 'localhost')
    dbPort = getEnvNumber('DB_PORT', 5433)

    // Cors
    corsOrigin = getEnvString('CORS_ORIGIN', '*')

    // Json Web Token
    jwtIssuer = getEnvString('JWT_ISSUER', 'issuer')
    jwtSecret = getEnvString('JWT_SECRET', 'secr3t')

    // Lifetime
    lifetimeAnonymous = getEnvNumber('LIFETIME_ANONYMOUS', 7776000)
    lifetimeUser = getEnvNumber('LIFETIME_USER', 86400)
    lifetimeUserRefresh = getEnvNumber('LIFETIME_USER_REFRESH', 604800)

    // Google
    googleClientId = getEnvString('GOOGLE_CLIENT_ID')
    googleClientSecret = getEnvString('GOOGLE_CLIENT_SECRET')
    googleUriAuth = getEnvString('GOOGLE_URI_AUTH')
    googleUriToken = getEnvString('GOOGLE_URI_TOKEN')
    googleUriRedirect = getEnvString('GOOGLE_URI_REDIRECT')
    googleUrlAuthProvider = getEnvString('GOOGLE_URL_AUTH_PROVIDER')
}

export const myConfig = new EnvConfiguration()
