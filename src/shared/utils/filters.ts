import { Request } from "express"
import { IIndex } from "../../app/interfaces/Helper"

export const formatIndexFilters = ({ query }: Request, defaultOrderField: string = 'dataCadastro'): IIndex => {

  const { orderBy: ob, order: o, page: p, size: s, ...f } = query

  const orderBy = ob?.toString() || defaultOrderField
  const order = o as "asc" | "desc" || "desc"

  let page = parseInt(p?.toString() || "")
  page = !isNaN(page) ? page : 1

  let size = parseInt(s?.toString() || "")
  size = !isNaN(size) ? size : 10

  const skip = (page - 1) * size
  const take = size
  const filter = f as { [key: string]: string }

  return {
    orderBy,
    order,
    skip,
    take,
    filter
  }
}
