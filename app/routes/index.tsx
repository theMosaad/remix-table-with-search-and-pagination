/* eslint-disable jsx-a11y/anchor-is-valid */
import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useLoaderData, useLocation } from '@remix-run/react'

import { Pagination } from '~/components/Pagination'
import { Search } from '~/components/Search'
import { getRequestParams } from '~/utils/get-params'
import type { Person } from '~/utils/get-people'
import { getPeople } from '~/utils/get-people'

type LoaderData = {
  people: Person[]
  pagesCount: number
  totalResults: number
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)

  const searchParams = url.searchParams
  const searchQuery = searchParams.get('search') || ''
  const page = Number(searchParams.get('page')) || 1

  const { people, totalResults } = getPeople(searchQuery, page)

  const pagesCount = Math.ceil(totalResults / 10)
  if (pagesCount !== 0 && page > pagesCount) {
    return redirect(`${url.pathname}${getRequestParams(request, { page: pagesCount })}`)
  }

  return json<LoaderData>({ people, pagesCount, totalResults })
}

export default function Index() {
  const { people, pagesCount, totalResults } = useLoaderData() as LoaderData

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('search') || ''

  return (
    <>
      <div className="border-b border-gray-300 bg-white">
        <div className="container mx-auto px-5">
          <div className="py-2 text-center text-sm text-gray-900">
            The source code for this demo is{' '}
            <a
              className="underline underline-offset-1"
              href="https://github.com/theMosaad/remix-table-with-search-and-pagination"
            >
              available on GitHub
            </a>
            .
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 md:px-8">
        <Search />
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 lg:w-full lg:table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        scope="col"
                      >
                        Name
                      </th>
                      <th
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        scope="col"
                      >
                        Title
                      </th>
                      <th
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        scope="col"
                      >
                        Email
                      </th>
                      <th
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:w-28"
                        scope="col"
                      >
                        Role
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:w-28" scope="col">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {people.map((person, index) => (
                      <tr key={person.email}>
                        <td className="truncate whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: searchQuery
                                ? person.name.replace(
                                    new RegExp(searchQuery, 'gi'),
                                    (match) => `<mark class="bg-indigo-100">${match}</mark>`
                                  )
                                : person.name,
                            }}
                          />
                        </td>
                        <td className="truncate  whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.title}
                        </td>
                        <td className="truncate whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.email}
                        </td>
                        <td className="truncate whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.role}
                        </td>
                        <td className="relative truncate whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            className="text-indigo-600 after:absolute after:inset-0 hover:text-indigo-900"
                            prefetch="intent"
                            to={`/user/${index}`}
                          >
                            Edit<span className="sr-only">, {person.name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {people.length === 0 && searchQuery ? (
                <p className="pt-4 text-sm tabular-nums text-gray-700 md:pl-6">
                  No results found for{' '}
                  <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <Pagination pagesCount={pagesCount} totalResults={totalResults} />
      </div>
    </>
  )
}
