import React, { useMemo, useState } from 'react'
import axios from 'axios'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { Totalizer, IconArrowUp, IconShoppingCart, Table, DatePicker, Spinner, IconCheck } from 'vtex.styleguide'

import GET_AFFILIATE_STORE_NAME_QUERY from './graphql/getAffiliateStoreName.graphql'
import { getSlugStoreFront } from './utils/shared'

type GetAffiliateStoreNameQueryResult = {
  getAffiliateStoreName: string
}

const CSS_HANDLES = [
  'affiliateProfileTitle',
  'affiliateProfileTitleContainer',
] as const

function AffiliateProfileDetails(this: any) {
  const [transactions, setTransactions] = useState([])

  const [totalOrders, setTotalOrders] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalCommission, setTotalCommission] = useState(0)

  const [loading, setLoading] = useState(false)

  const [startDate, setStartDate] = useState(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000 ))  // last 28 days
  const [endDate, setEndDate] = useState(new Date())

  const slug = useMemo(() => {
    return getSlugStoreFront()
  }, [])

  const { handles } = useCssHandles(CSS_HANDLES)

  const { data, error } = useQuery<GetAffiliateStoreNameQueryResult>(
    GET_AFFILIATE_STORE_NAME_QUERY,
    {
      variables: { slug },
      skip: !slug,
    }
  )

  const defaultSchema = {
    properties: {
      marketplace_transaction_id: {
        title: 'ID',
        width: 350,
      },
      transaction_date: {
        title: 'Data',
        minWidth: 300,
        cellRenderer: ({ cellData, loading }: any) => {
          return (
            loading ?
              <span className="dib c-muted-1">
                <Spinner color="currentColor" size={20} />
              </span>
            :
            new Date(cellData).toLocaleString('pt-BR').split(',')[0]
          )
        }
      },
      card_payment_amount: {
        title: 'Venda',
        minWidth: 100,
        cellRenderer: ({ cellData, loading }: any) => {
          return (
            loading ?
              <span className="dib c-muted-1">
                <Spinner color="currentColor" size={20} />
              </span>
            :
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cellData / 100)
          )
        }
      },
      subseller_rate_percentage: {
        title: 'Comissão',
        minWidth: 100,
        cellRenderer: ({ cellData, rowData, loading }: any) => {
          return (
            loading ?
              <span className="dib c-muted-1">
                <Spinner color="currentColor" size={20} />
              </span>
            :
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(((rowData.card_payment_amount / 100) / 100) * cellData)
          )
        }
      },
    },
  }

  const getTransactions = async () => {
    setLoading(true)

    try {
      const response = await axios.get(
        `/_v/transactions?seller_id=585fa930-d7ba-4e61-b099-c641efcfda55&subseller_id=700108794&transaction_date_init=${startDate}&transaction_date_end=${endDate}`
      )

      setTransactions(response.data)

      setTotalOrders(response.data.length)

      const totalIncome = response.data.reduce(
        (acc: any, curr: { card_payment_amount: any }) => acc + curr.card_payment_amount,
        0
      )

      setTotalIncome(totalIncome)

      const totalCommission = response.data.reduce(
        (acc: any, curr: { card_payment_amount: any, subseller_rate_percentage: any }) => acc + ((curr.card_payment_amount / 100) * curr.subseller_rate_percentage),
        0
      )

      setTotalCommission(totalCommission)
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  useMemo(() => {
    getTransactions()
  }, [startDate, endDate])

  return (
    <div>
      <div className={`f1 mw9 center mr-auto ml-auto my-3 ${handles.affiliateProfileTitleContainer} `}>
        <h4 className={`t-heading-4 ${handles.affiliateProfileTitle}`}>
          Affiliate Store Name: {error ? '' : data?.getAffiliateStoreName}
        </h4>
      </div>

      <Totalizer
        items={[
          {
            label: 'Total de pedidos',
            value: totalOrders,
            iconBackgroundColor: '#cce8ff',
            icon: <IconShoppingCart color="#368df7" size={14} />,
          },
          {
            label: 'Total de vendas',
            value: new Intl.NumberFormat('pt-BT', { style: 'currency', currency: 'BRL' }).format(totalIncome / 100),
            iconBackgroundColor: '#eafce3',
            icon: <IconArrowUp color="#79B03A" size={14} />,
          },
          {
            label: 'Total de comissão',
            value: new Intl.NumberFormat('pt-BT', { style: 'currency', currency: 'BRL' }).format(totalCommission / 100),
            iconBackgroundColor: '#eafce3',
            icon: <IconCheck size={14} />,
          },
        ]}
      />

      <div className="flex mv7">
        <div className="mr3 ml-auto">
          <DatePicker
            label="Data de início"
            value={startDate}
            onChange={(date: React.SetStateAction<Date>) => setStartDate(date)}
            locale="pt-BR"

          />
        </div>
        <div className="ml3">
          <DatePicker
            label="Data de fim"
            value={endDate}
            onChange={(date: React.SetStateAction<Date>) => setEndDate(date)}
            locale="pt-BR"
          />
        </div>
      </div>

      {loading ?
        <span className="dib c-muted-1">
          <Spinner color="currentColor" size={20} />
        </span>
      :
        <Table
          fullWidth={true}
          schema={defaultSchema}
          items={transactions}
          />
      }
    </div>
  )
}

export default AffiliateProfileDetails
