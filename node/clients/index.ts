import { IOClients } from '@vtex/api'
import { masterDataFor } from '@vtex/clients'
import type {
  Affiliates,
  UserAffiliation,
} from 'vtexdayhackathon7.vtexday2023-hackathon-affiliates'

import AuthenticationClient from './authenticationClient'
import CheckoutExtended from './checkout'
import Getnet from './getnet'

export class Clients extends IOClients {
  public get affiliates() {
    return this.getOrSet('affiliates', masterDataFor<Affiliates>('affiliates'))
  }

  public get userAffiliation() {
    return this.getOrSet(
      'userAffiliation',
      masterDataFor<UserAffiliation>('userAffiliation')
    )
  }

  public get checkout() {
    return this.getOrSet('checkout', CheckoutExtended)
  }

  public get authentication() {
    return this.getOrSet('authentication', AuthenticationClient)
  }

  public get getnet() {
    return this.getOrSet('getnet', Getnet)
  }
}
