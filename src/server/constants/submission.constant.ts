export enum SubmissionStatus {
    Submitted = 1,
    Paid,
    Valid,
    Done,
    NeedRevision,
}

export const composeSubmissionStatusResult = (id: SubmissionStatus) => {
    let name
    switch (id) {
        case SubmissionStatus.Submitted:
            name = 'Submitted'
            break
        case SubmissionStatus.Paid:
            name = 'Paid'
            break
        case SubmissionStatus.Valid:
            name = 'Valid'
            break
        case SubmissionStatus.Done:
            name = 'Done'
            break
        case SubmissionStatus.NeedRevision:
            name = 'NeedRevision'
            break
        default:
            name = 'UNKNOWN'
    }

    return {
        id,
        name,
    }
}
