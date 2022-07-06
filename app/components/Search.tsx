import { SearchIcon } from '@heroicons/react/solid'
import { Form, PrefetchPageLinks, useLocation, useTransition } from '@remix-run/react'
import { useState } from 'react'

import { SearchParamsHiddenInputs } from '~/components/SearchParamsHiddenInputs'
import { useGetParams } from '~/utils/get-params'

export const Search = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('search') || ''

  const [query, setQuery] = useState(() => {
    return searchQuery
  })

  const transition = useTransition()
  const isSearchBusy =
    transition.state === 'submitting' && transition.submission?.formData.get('search') !== null

  const getParams = useGetParams()

  return (
    <div className="max-w-sm">
      <Form
        className="mt-1 flex rounded-md shadow-sm"
        onChange={(event) => {
          const formData = new FormData(event.currentTarget)
          const search = formData.get('search')
          setQuery(String(search))
        }}
      >
        <SearchParamsHiddenInputs excludeKeys={['search']} />

        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
          </div>
          <input
            aria-label="Search people"
            className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            defaultValue={searchQuery}
            name="search"
            placeholder="Search people"
            type="search"
          />
        </div>
        <button
          className="relative -ml-px rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:text-gray-400  disabled:hover:bg-gray-50"
          disabled={isSearchBusy}
          type="submit"
        >
          Search
        </button>
        {query ? (
          <PrefetchPageLinks page={`${location.pathname}${getParams({ search: query })}`} />
        ) : null}
        {!query && searchQuery ? (
          <PrefetchPageLinks page={`${location.pathname}${getParams({ search: '' })}`} />
        ) : null}
      </Form>
    </div>
  )
}
