type QueryParams = Record<string, string | number>

export const getCanonicalUrl = () => {
  return window.location.href.split('?')[0]
}

export const getQuery = (queryString: string = window.location.search) => {
  return Object.fromEntries(new URLSearchParams(queryString))
}

export const stringifyQuery = (params: QueryParams) => {
  return Object.keys(params)
    .map(function (key) {
      return key + '=' + params[key]
    })
    .join('&')
}

export const modifyQuery = (patch: QueryParams) => {
  return stringifyQuery({ ...getQuery(), ...patch })
}

export const updateQuery = (queryString: string) => {
  window.history.replaceState(null, '', getCanonicalUrl() + '?' + queryString)
}
