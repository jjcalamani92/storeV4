import type { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { SITE, FURNITURIES, GIFTS } from '../graphql'
import { Product, Site } from '../interfaces'
import { LayoutPages, Routes, LayoutDashboard } from '../layouts'
import { graphQLClient } from '../swr/graphQLClient'
import { paths, seo } from '../utils/functionV1'

interface Props {
  site: Site
  products: {
    furnitures: Product[]
    gifts: Product[]
  }
}

const Slug: FC<Props> = ({site, products}) => {
  const { query, asPath } = useRouter()
  console.log(query);
  
  return (
    <>
    {
      query.slug && query.slug[0] === "dashboard" 
      ?
      <LayoutDashboard >
        <Routes site={site} products={products } />
      </LayoutDashboard>
      :
      <LayoutPages head={seo(site, query, asPath, products)!}  site={site}>
        <Routes site={site} products={products} />
      </LayoutPages>
    }
    </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { site } = await graphQLClient.request(SITE, { _id: process.env.API_SITE })
  return {
    paths: paths(site).map(data =>( {params: data})),
    fallback: 'blocking'
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { site } = await graphQLClient.request(SITE, { _id: process.env.API_SITE })
  const { furnitures } = await graphQLClient.request(FURNITURIES, { site: process.env.API_SITE })
  const { gifts } = await graphQLClient.request(GIFTS, { site: process.env.API_SITE })
  return {
    props: { site, products: {furnitures, gifts} 
    //   fallback: {
    //   [FURNITURIES]:
    // },
  },
    revalidate: 10,
  }
}
export default Slug
