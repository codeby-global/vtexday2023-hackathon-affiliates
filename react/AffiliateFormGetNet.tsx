import React, { useMemo, useState } from 'react'
import GET_AFFILIATE from './graphql/getAffiliateByEmail.graphql'
import { useQuery } from 'react-apollo'
import { useRenderSession } from 'vtex.session-client'
import { MERCHANT_ID } from './utils/constants'
import axios from 'axios'
import { Input } from 'vtex.styleguide'

function AffiliateFormGetNet() {
  const initialValues = {
    merchant_id: MERCHANT_ID,
    legal_document_0: 0,
    legal_name: "",
    birth_date: "",
    mothers_name: "",
    occupation: "",
    email: "",
    url_callback: "",
    payment_plan: 0,
    accepted_contract: "",
    subsellerid_ext: "",
    phone: {
      area_code: 11,
      phone_0: 0
    },
    business_address: {
      mailing_address_equals: "",
      street: "",
      number: 0,
      district: "",
      city: "",
      state: "",
      postal_code: 0,
      suite: ""
    },
    bank_accounts: {
      type_accounts: "",
      unique_account: {
        account_type: "",
        bank: 0,
        agency: 0,
        account: 0,
        account_digit: ""
      }
    },
    list_commissions: {
      brand: "",
      product: "",
      payment_plan: 0,
      commission_percentage: 0,
      commission_value: 0
    },
  }
  const [approved, setApproved ] = useState(false);
  const { session }:any = useRenderSession()
  const [affiliateGetnet, setAffiliateGetnet] = useState(initialValues)
  const { data: affiliateState } = useQuery(GET_AFFILIATE, {
    variables: {
      email: session?.namespaces?.profile?.email?.value,
    },
  })  

  useMemo(()=>{
    console.log("fix", affiliateState)
    if(affiliateState){
      const { commissionPercentage, state, postalCode, reference, city, neighborhood, number, phone, document, name, email, refId, street } = affiliateState?.getAffiliateByEmail
      setApproved(affiliateState?.getAffiliateByEmail?.isApproved || false)
      setAffiliateGetnet({
        ...affiliateGetnet,
        legal_document_0: document.replace(/\D/g, ''),
        legal_name: name,
        email: email,
        url_callback: "",
        payment_plan: 0,
        accepted_contract: "S",
        subsellerid_ext: refId,
        phone: {
          area_code: parseInt(phone.substring(0, 2)),
          phone_0: parseInt(phone.substring(2, 9))
        },
        business_address: {
          mailing_address_equals: "S",
          street: street,
          number: parseInt(number),
          district: neighborhood,
          city: city,
          state: state,
          postal_code: postalCode ,
          suite: reference
        },
        bank_accounts: {
          type_accounts: "unique",
          unique_account: {
            account_type: "C",
            bank: 0,
            agency: 0,
            account: 0,
            account_digit: "0"
          }
        },
        list_commissions: {
          brand: "MASTERCARD",
          product: "CREDITO A VISTA",
          payment_plan: 1,
          commission_percentage: commissionPercentage,
          commission_value: 100
        },
      })
    }
  },[affiliateState])

  const onSubmit =
    (event : any) => {
      event.preventDefault()
      const result = axios.post('/_v/affiliate',{
        //TODO
      })
      console.log("result?", result)
    }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAffiliateGetnet({
      ...affiliateGetnet,
      [e.target?.name]: e.target?.value,
    })
  }
  // if(loadingQuery){
  //   return (
  //     <div>

  //     </div>
  //   )
  // }

  if(approved){
    return (
      <div>
        <div>Você foi aprovado como afiliado Vtex! Agora é necessario fazer seu cadastro na Getnet:</div>
        <form onSubmit={onSubmit}>
          <div>
            <Input
              onChange={handleChange}
              name="motherName"
              label={"Nome da Mãe"}
            />
          </div>
                    <div>
            <Input
              onChange={handleChange}
              name="birthdate"
              label={"Data de nascimento"}
            />
          </div>
          <div>
            <Input
              onChange={handleChange}
              name="ocupation"
              label={"Ocupação"}
            />
          </div>
          <div>
            <Input
              onChange={handleChange}
              name="bank"
              label={"Banco"}
            />
          </div>
          <div>
            <Input
              onChange={handleChange}
              name="agency"
              label={"Agência"}
            />
          </div>
            <div>
              <Input
                onChange={handleChange}
                name="account"
                label={"Conta Bancaria"}
              />
          </div>
          <div>
            <Input
              onChange={handleChange}
              name="digitAccount"
              label={"Digito da Conta"}
            />
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>Você ainda não foi aprovado, aguarde até o admin da loja  fazer sua liberação!</div>
  );
}

export default AffiliateFormGetNet;