// formatDate
export const formatDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })
}
