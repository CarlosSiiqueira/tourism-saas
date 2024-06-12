export const dateValidate = (date: string | Date): Date => {

    if (typeof date == 'string') {
        date = new Date(date)
    }

    return date
}
