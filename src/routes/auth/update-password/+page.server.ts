export const load = async ({ url }) => {
  return {
    code: url.searchParams.get('code')
  }
}