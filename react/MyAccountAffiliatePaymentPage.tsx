import React, { useState } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import { Tabs, Tab, PageHeader} from 'vtex.styleguide'
import AffiliateForm from './AffiliateForm'
import AffiliateFormGetNet from './AffiliateFormGetNet'
import AffiliateProfileDetails from './AffiliateProfileDetails'

type MyAccountAffiliatePaymentPageProps = {
  title?: string
  namespace?: string
}
const MyAccountAffiliatePaymentPage = ({
  title = 'Afiliado GetNet',
}: MyAccountAffiliatePaymentPageProps) => {
  const [initialState, setState] = useState({ currentTab: 1 })
  return (
    <Route
      exact
      path="/affiliates-payment"
      render={() => {
        return (
          <>
          <PageHeader title={title}/>
          <div>
            <Tabs fullWidth>
              <Tab
                label="Afiliado Vtex"
                active={initialState.currentTab === 1}
                onClick={() => setState({ currentTab: 1 })}>
                <AffiliateForm/>
              </Tab>
              <Tab
                label="Afiliado Getnet"
                active={initialState.currentTab === 2}
                onClick={() => setState({ currentTab: 2 })}>
                <AffiliateFormGetNet/>
              </Tab>
              <Tab
                label="Wallet"
                active={initialState.currentTab === 3}
                onClick={() => setState({ currentTab: 3 })}>
                <AffiliateProfileDetails />
              </Tab>
            </Tabs>
          </div>
          </>
        )
      }}
    />
  )
}

export default MyAccountAffiliatePaymentPage
