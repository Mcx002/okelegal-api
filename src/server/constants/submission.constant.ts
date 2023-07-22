export enum SubmissionStatus {
    Submitted = 1,
    Paid,
    PaymentInvalid,
    Done,
    InvalidData,
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
        case SubmissionStatus.PaymentInvalid:
            name = 'Payment Invalid'
            break
        case SubmissionStatus.Done:
            name = 'Done'
            break
        case SubmissionStatus.InvalidData:
            name = 'Invalid Data'
            break
        default:
            name = 'UNKNOWN'
    }

    return {
        id,
        name,
    }
}
