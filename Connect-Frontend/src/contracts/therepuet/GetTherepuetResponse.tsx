export type GetTherepuetResponse = {
    user : Therepuet,
    description: string,
}

type Therepuet = {
    id: number,
    name: string,
    surname:string
}