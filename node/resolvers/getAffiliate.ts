import type { QueryGetAffiliateArgs } from 'vtexdayhackathon7.vtexday2023-hackathon-affiliates'

export const getAffiliate = async (
  _: unknown,
  { affiliateId }: QueryGetAffiliateArgs,
  { clients: { affiliates } }: Context
) => {
  const fields = ['_all']

  const response = affiliates.get(affiliateId, fields)
  console.log("response: ", response)
  return response
}
