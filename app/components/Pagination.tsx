import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from '@heroicons/react/solid'
import { Link, useLocation } from '@remix-run/react'

import usePagination from '~/hooks/usePagination'
import { classNames } from '~/utils/classNames'
import { useGetParams } from '~/utils/get-params'

const rowsPerPage = 10

export const Pagination = ({
  pagesCount,
  totalResults,
}: {
  pagesCount: number
  totalResults: number
}) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const page = Number(searchParams.get('page')) || 1

  const { items } = usePagination({
    count: pagesCount,
    page: page,
  })

  const getParams = useGetParams()

  if (totalResults === 0) {
    return null
  }

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <div className="md:px-6 lg:px-8">
        <div className="flex items-center justify-between border-t border-gray-200">
          <div className="flex flex-1 items-start justify-between">
            <div className="pl-4 pt-4 sm:pl-6">
              <p className="text-sm tabular-nums text-gray-700">
                {totalResults === 1 ? (
                  <>
                    Showing <span className="font-medium">{totalResults}</span> result
                  </>
                ) : null}
                {totalResults > 1 && totalResults <= rowsPerPage ? (
                  <>
                    Showing <span className="font-medium">{totalResults}</span> results
                  </>
                ) : null}
                {totalResults > rowsPerPage ? (
                  <>
                    <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(totalResults, page * rowsPerPage)}
                    </span>{' '}
                    of <span className="font-medium">{totalResults}</span> results
                  </>
                ) : null}
              </p>
            </div>
            {pagesCount > 1 ? (
              <div>
                <nav aria-label="Pagination" className="-mt-px flex pr-3 sm:pr-5">
                  {items.map(({ page, type, selected, disabled }, index) => {
                    if (type === 'ellipsis') {
                      return (
                        <span
                          key={index}
                          className="hidden min-w-10 items-center justify-center border-t-2 border-transparent px-1 pt-4 pb-2 text-sm font-medium tabular-nums text-gray-500 md:inline-flex"
                        >
                          ...
                        </span>
                      )
                    }
                    if (type === 'page') {
                      return (
                        <Link
                          key={index}
                          className={classNames(
                            'hidden min-w-10 items-center justify-center border-t-2 px-1 pt-4 pb-2 text-sm font-medium tabular-nums md:inline-flex ',
                            selected
                              ? 'border-indigo-500 text-indigo-600'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                          )}
                          prefetch="intent"
                          to={getParams({ page: String(page) })}
                        >
                          {page}
                        </Link>
                      )
                    }
                    if (type === 'previous') {
                      return (
                        <Link
                          key={index}
                          aria-label="Previous"
                          className={classNames(
                            'group inline-flex w-10 items-center justify-center border-t-2 border-transparent pt-4 pb-2 pr-1 pl-1.5 text-sm font-medium tabular-nums text-gray-400',
                            disabled ? '' : 'hover:border-gray-300 hover:text-gray-500'
                          )}
                          prefetch="intent"
                          to={getParams({ page: String(page) })}
                        >
                          <ArrowNarrowLeftIcon aria-hidden="true" className="h-5 w-5" />
                        </Link>
                      )
                    }
                    if (type === 'next') {
                      return (
                        <Link
                          key={index}
                          aria-label="Next"
                          className={classNames(
                            'group inline-flex w-10 items-center justify-center border-t-2 border-transparent pt-4 pb-2 pl-1 pr-1.5 text-sm font-medium tabular-nums text-gray-400',
                            disabled ? '' : 'hover:border-gray-300 hover:text-gray-500'
                          )}
                          prefetch="intent"
                          to={getParams({ page: String(page) })}
                        >
                          <ArrowNarrowRightIcon aria-hidden="true" className="h-5 w-5" />
                        </Link>
                      )
                    }
                    return null
                  })}
                </nav>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
