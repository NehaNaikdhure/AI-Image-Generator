
function getLimitValue(limitType: string): number {
    const limit = localStorage.getItem(limitType)
    return limit ? parseInt(limit) : 0
}
function setLimitValue(limitType: string, value: number) {
    localStorage.setItem(limitType, value.toString())
}
export { getLimitValue, setLimitValue }