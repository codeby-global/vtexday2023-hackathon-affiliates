import type { Affiliates } from 'vtexdayhackathon7.vtexday2023-hackathon-affiliates'

export const fieldResolvers = {
  Affiliate: {
    affiliateId: (root: Affiliates) => root.id,
  },
}
