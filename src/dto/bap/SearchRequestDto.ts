

export const SearchRequestDto = ({ name }: {
    name: string
}) => {
    return {
        intent: {
            descriptor: {
                name,
            }
        }
    }
}