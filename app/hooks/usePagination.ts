// a modified version of https://github.com/mui/material-ui/blob/master/packages/mui-material/src/usePagination/usePagination.js

type UsePaginationProps = {
  /**
   * Number of always visible pages at the beginning and end.
   * @default 1
   */
  boundaryCount?: number
  /**
   * The total number of pages.
   * @default 1
   */
  count: number
  /**
   * The current page.
   */
  page: number
  /**
   * Number of always visible pages before and after the current page.
   * @default 1
   */
  siblingCount?: number
}

export type UsePaginationItem = {
  type: 'page' | 'next' | 'previous' | 'ellipsis'
  page: number | null
  selected: boolean
  disabled: boolean
}

export type UsePaginationResult = {
  items: UsePaginationItem[]
}

export default function usePagination(props: UsePaginationProps): UsePaginationResult {
  // keep default values in sync with @default tags in Pagination.propTypes
  const { boundaryCount = 1, count = 1, page = 1, siblingCount = 1 } = props

  // https://dev.to/namirsab/comment/2050
  const range = (start: any, end: any) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1
    ),
    // Greater than startPages
    boundaryCount + 2
  )

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : count - 1
  )

  // Basic list of items to render
  // e.g. itemList = ['previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next']
  const itemList = [
    ...['previous'],
    ...startPages,

    // Start ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsStart > boundaryCount + 2
      ? ['ellipsis']
      : boundaryCount + 1 < count - boundaryCount
      ? [boundaryCount + 1]
      : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsEnd < count - boundaryCount - 1
      ? ['ellipsis']
      : count - boundaryCount > boundaryCount
      ? [count - boundaryCount]
      : []),

    ...endPages,
    ...['next'],
  ]

  // Map the button type to its page number
  const buttonPage = (type: any) => {
    switch (type) {
      case 'previous':
        return page <= 1 ? 1 : page - 1
      case 'next':
        return page >= count ? count : page + 1
      default:
        return null
    }
  }

  // Convert the basic item list to PaginationItem props objects
  const items = itemList.map((item) => {
    return typeof item === 'number'
      ? {
          type: 'page' as 'page',
          page: item,
          selected: item === page,
          disabled: false,
          'aria-current': item === page ? 'true' : undefined,
        }
      : {
          type: item,
          page: buttonPage(item),
          selected: false,
          disabled:
            item.indexOf('ellipsis') === -1 &&
            (item === 'next' || item === 'last' ? page >= count : page <= 1),
          'aria-current': undefined,
        }
  })

  return {
    items,
  }
}
