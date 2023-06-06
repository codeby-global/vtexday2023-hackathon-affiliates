
import React, { useState } from 'react'

import ADD_AFFILIATE from './graphql/addAffiliate.graphql'
import { useMutation } from 'react-apollo'
import type { Affiliate } from 'vtexdayhackathon7.vtexday2023-hackathon-affiliates'
// import ADD_AFFILIATE from './graphql/addAffiliate.graphql'
import { Input } from 'vtex.styleguide'
type AffiliateFormProps = {
  affiliate?: Affiliate
}

function AffiliateForm ({ affiliate } : AffiliateFormProps) {
  //const showToast = useToast()

  const [addAffiliate] = useMutation(ADD_AFFILIATE)
  // const errors = error?.graphQLErrors[0]?.extensions?.exception?.graphQLErrors

  // TODO
  
   const initialValues = {
      name: affiliate?.name ?? '',
      email: affiliate?.email ?? '',
      phone: affiliate?.phone ?? '',
      storeName: affiliate?.storeName ?? '',
      slug: affiliate?.slug ?? '',
      refId: affiliate?.refId ?? '',
      document: affiliate?.document ?? '',
      documentType: affiliate?.documentType ?? '',
      address: {
        street: affiliate?.address?.street ?? '',
        number: affiliate?.address?.number ?? '',
        neighborhood: affiliate?.address?.neighborhood ?? '',
        city: affiliate?.address?.city ?? '',
        state: affiliate?.address?.state ?? '',
        postalCode: affiliate?.address?.postalCode ?? '',
        country: affiliate?.address?.country ?? '',
        reference: affiliate?.address?.reference ?? '',
      },
      marketing: {
        instagram: affiliate?.marketing?.instagram ?? '',
        facebook: affiliate?.marketing?.facebook ?? '',
        whatsapp: affiliate?.marketing?.whatsapp ?? '',
        gtmId: affiliate?.marketing?.gtmId ?? '',
      },
    }


  console.log("initialValues", initialValues)

  const [form, setForm] = useState(initialValues)

    const onSubmit =
    (event : any) => {
      event.preventDefault()
      const result = addAffiliate({
          variables: {
            newAffiliate: {
              ...form,
              phone: form.phone?.toString(),
              isApproved: false,
            },
          },
        })

      

      console.log("result?", result)
    }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target?.name]: e.target?.value,
    })
  }

  const handleChangeAddress =
  (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      address:{
        ...form.address,
        [e.target?.name]: e.target?.value
      }

    })
  }

    const handleChangeMarketing =
  (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      marketing:{
        ...form.marketing,
        [e.target?.name]: e.target?.value
      }

    })
  }


  return (
    <form onSubmit={onSubmit}>
      <h1>Informações gerais</h1>
      <div>
        <div>
          <Input
onChange={handleChange}
            name="name"
            label={"Nome"}
          />
        </div>
        <div>
          <Input
            onChange={handleChange}
            name="storeName"
            label={"Nome da Loja"}
          />
        </div>
        <div>
          <Input
onChange={handleChange}
            name="email"
            label={"Email"}
          />
        </div>
        <div>
          <Input
onChange={handleChange}
            name="phone"
            label={"Telefone"}
          />
        </div>
        <div>
          <Input
onChange={handleChange}
            name="slug"
            label={"Identificador da URL"}
          />
        </div>
        <div>
          <Input
            onChange={handleChange}
            name="refId"
            label={"Identificador único"}
          />
        </div>
        <div>
          <Input
onChange={handleChange}
            name="documentType"
            label={"Tipo de documento"}
          />
        </div>
        <div>
          <Input
onChange={handleChange}
            name="document"
            label={"Documento"}
          />
        </div>
      </div>
        <div >
          <Input
onChange={handleChangeAddress}
            name="postalCode"
            label={"CEP"}
          />
        </div>
        <div>
          <div >
            <Input
              onChange={handleChangeAddress}
              name="street"
              label={"Rua"}
            />
          </div>
          <div >
            <Input
              onChange={handleChangeAddress}
              name="number"
              label={"Numero"}
            />
          </div>
          <div >
            <Input
              onChange={handleChangeAddress}
              name="neighborhood"
              label={"Bairro"}
            />
          </div>
          <div >
            <Input
onChange={handleChangeAddress}
              name="reference"
              label={"Referência"}
            />
          </div>
          <div >
            <Input
              onChange={handleChangeAddress}
              name="city"
              label={"Cidade"}
            />
          </div>
          <div >
            <Input
              onChange={handleChangeAddress}
              name="state"
              label={"Estado"}
            />
          </div>
          <div >
            <Input
              onChange={handleChangeAddress}
              name="country"
              label={"Pais"}
            />
          </div>
        </div>
      <div>
        <div >
          <Input
            onChange={handleChangeMarketing }
            name="instagram"
            label={"Instagram"}
          />
        </div>
        <div >
          <Input
            onChange={handleChangeMarketing }
            name="facebook"
            label={"Facebook"}
          />
        </div>
        <div >
          <Input
            onChange={handleChangeMarketing }
            name="whatsapp"
            label={"WhatsApp"}
          />
        </div>
        <div>
          <Input
            onChange={handleChangeMarketing }
            name="gtmId"
            label={"GTM ID"}
          />
        </div>
      </div>
      <button
        // loading={loading}
        type={"submit"}
      >
        Salvar
      </button>

      </form>

  )
}

export default AffiliateForm
