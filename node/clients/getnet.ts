import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient, Apps } from '@vtex/api'

import type { CreatePreSubSellerPF, TransactionsParams } from '../typings/getnet'

const api = 'https://api-homologacao.getnet.com.br'

let token = {
  transaction: {
    access_token: null as string | null,
    expires_in: 0 as number,
    createdAt: 0 as number,
  },
  backoffice: {
    access_token: null as string | null,
    expires_in: 0 as number,
    createdAt: 0 as number,
  },
}

type TokenType = 'transaction' | 'backoffice';

export default class Getnet extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, {
      ...options,
      headers: {
        ...(options && options.headers),
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
  }

  public async getToken(type: TokenType): Promise<any> {
    if (new Date(token[type].createdAt + token[type].expires_in) > new Date()) {
      return token[type]
    }

    const newToken = await this.generateToken(type)

    token[type] = {
      access_token: newToken.access_token,
      expires_in: newToken.expires_in,
      createdAt: new Date().getTime(),
    }

    return newToken
  }

  public async generateToken(type: TokenType): Promise<any> {
    const { clientIdT, clientSecretT, clientIdB, clientSecretB } = await this.getSettings()

    let clientId = clientIdT
    let clientSecret = clientSecretT
    let url = '/auth/oauth/v2/token?grant_type=client_credentials'
    let scope = 'oob'

    if (type === 'backoffice') {
      clientId = clientIdB
      clientSecret = clientSecretB
      url = '/credenciamento/auth/oauth/v2/token?grant_type=client_credentials'
      scope = 'mgm'
    }

    const bToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    try {
      const response = await this.http.post(api + url, {
        scope,
      }, {
        headers: {
          Authorization: `Basic ${bToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        }
      })

      return response
    } catch (error) {
      console.error(error)

      return false
    }
  }

  public async consultPF(
    merchant_id: string,
    cpf: number,
  ): Promise<any> {
    const { access_token } = await this.getToken('backoffice')

    try {
      return await this.http.get(
        api + this.routes.consultPF(merchant_id, cpf),
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        }
      )
    } catch (error) {
      // console.error(error)

      return error
    }
  }

  public async createPF(
    register: CreatePreSubSellerPF,
  ): Promise<any> {
    const { access_token } = await this.getToken('backoffice')

    try {
      return await this.http.post(
        api + this.routes.createPF(),
        register,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      console.error(error)

      return error
    }
  }

  public async updatePF(
    register: CreatePreSubSellerPF,
  ): Promise<any> {
    const getTk = await this.getToken('backoffice')

    const { access_token }  = getTk

    try {
      return await this.http.put(
        api + this.routes.updatePF(),
        register,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      console.error(error)

      return error
    }
  }

  public async getTransactions(
    {seller_id, subseller_id, transaction_date_init, transaction_date_end}: TransactionsParams
  ): Promise<any> {
    const { access_token } = await this.getToken('backoffice')

    try {
      return await this.http.get(
        api + this.routes.getTransactions({seller_id, subseller_id, transaction_date_init, transaction_date_end}),
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        }
      )
    } catch (error) {
      // console.error(error)

      return error
    }
  }

  private get routes() {
    return {
      consultPF: (merchant_id: string, cpf: number) => {
        return `/v1/mgm/pf/consult/${merchant_id}/${cpf}`
      },

      createPF: () => {
        return `/v1/mgm/pf/create-presubseller`
      },

      updatePF: () => {
        return `/v1/mgm/pf/update-subseller`
      },

      getTransactions: ({seller_id, subseller_id, transaction_date_init, transaction_date_end}: TransactionsParams) => {
        return `/v2/mgm/statement?seller_id=${seller_id}&subseller_id=${subseller_id}&transaction_date_init=${transaction_date_init}&transaction_date_end=${transaction_date_end}`
      },
    }
  }

  private async getSettings() {
    const apps = new Apps(this.context)
    const appId = process.env.VTEX_APP_ID as string

    return await apps.getAppSettings(appId)
  }
}
