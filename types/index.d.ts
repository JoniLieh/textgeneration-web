declare interface NuxtError {
  url: string
  statusCode: number
  statusMessage: string
  message: string
  description: string
  data: any
}

declare interface IGrammar {
  [key: string]: string[];
}

export {
  NuxtError,
  IGrammar
}