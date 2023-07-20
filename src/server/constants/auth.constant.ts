export enum SubjectType {
    AnonymousCustomer = 0,
    AnonymousAdmin = 1,
    User = 2,
    Admin = 3,
}

export function isSubjectAnonymous(subjectType: SubjectType): boolean {
    switch (subjectType) {
        case SubjectType.AnonymousAdmin:
        case SubjectType.AnonymousCustomer: {
            return true
        }
        default: {
            return false
        }
    }
}

export enum Privilege {
    Public = 'P',

    // Privileges for Anonymous Customer
    AnonymousUser = 'AU',

    // Privileges for Anonymous Admin
    AnonymousAdmin = 'AA',

    // Privileges for Customer
    User = 'U',
    UserRefreshToken = 'URT',

    // Privileges for Customer
    Admin = 'A',
}

export const SubjectPrivileges: { [k: number]: Privilege[] } = {
    [SubjectType.AnonymousCustomer]: [Privilege.Public, Privilege.AnonymousUser],
    [SubjectType.AnonymousAdmin]: [Privilege.Public, Privilege.AnonymousAdmin],
    [SubjectType.User]: [Privilege.Public, Privilege.AnonymousUser, Privilege.User],
    [SubjectType.Admin]: [Privilege.Public, Privilege.AnonymousAdmin, Privilege.Admin],
}

export enum ClientType {
    CustomerWebApp = 1,
    AdminWebCms = 2,
}
