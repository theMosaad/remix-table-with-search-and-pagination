import { useLocation } from '@remix-run/react'

type ParamsType = Record<string, string | number | boolean | undefined>

export function getRequestParams(reqest: Request, params: ParamsType) {
  const url = new URL(reqest.url)
  const searchParams = new URLSearchParams(url.searchParams)

  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, String(value))
  })

  return `?${searchParams.toString()}`
}

export function useGetParams() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  return (params: ParamsType) => {
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, String(value))
    })
    return `?${searchParams.toString()}`
  }
}
