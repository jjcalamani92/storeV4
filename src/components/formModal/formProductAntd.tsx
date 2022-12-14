/* This example requires Tailwind CSS v2.0+ */
import { FC, Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { CreateProductInput, Product } from '../../interfaces/ecommerceV1';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
} from 'antd';
const { Option } = Select;
import { graphQLClient } from '../../swr/graphQLClient';
import { CREATE_FURNITURE_PRODUCT, CREATE_GIFT_PRODUCT, CREATE_WEAR_PRODUCT, UPDATE_FURNITURE_PRODUCT, UPDATE_GIFT_PRODUCT } from '../../graphql/mutation/ecommerceV1.mutation';
import { useSWRConfig } from 'swr';
import { FURNITURIES, GIFTS, WEARS } from '../../graphql/query';
import { Site } from '../../interfaces/siteV1';
import { routes } from '../../utils/functionV1';
import { getQuery, getURL, lastElement, slug } from '../../utils/function';
import type { DefaultOptionType } from 'antd/es/cascader';
import Swal from 'sweetalert2';


export interface Option {
  value: string;
  label: string;
  children?: Option[];
}

interface Props {
  openMP: boolean
  setOpenMP: React.Dispatch<React.SetStateAction<boolean>>
  children?: React.ReactNode;
  product?: Product
  site: Site
}

export const ModalProductAntd: FC<Props> = ({ openMP, setOpenMP, children, product, site }) => {
  const { asPath, query, push, replace } = useRouter()
  const { mutate } = useSWRConfig()
  const route: Option[] = routes(site)
  // console.log(getQuery(product!.article.route));
console.log(query.slug![2]);

  
  const cancelButtonRef = useRef(null)

  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    const data = { ...values, route: `/${values.route.join('/')}`, site: process.env.API_SITE }

    if (product) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Updated Product',
        showConfirmButton: false,
        timer: 1500
      })
      let UPDATE
      if (query.slug![2] ==='furniture') {
        UPDATE = UPDATE_FURNITURE_PRODUCT
      } else {
        UPDATE = UPDATE_GIFT_PRODUCT
      }
      await graphQLClient.request(UPDATE, { _id: product._id, input: data })

      replace(`${getURL(asPath)}/${slug(values.title)}`)
    } else {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Created Product',
        showConfirmButton: false,
        timer: 1500
      })
      let CREATED
      let PRODUCTS
      if (query.slug![2] ==='furniture') {
        CREATED = CREATE_FURNITURE_PRODUCT
        PRODUCTS = FURNITURIES
      } else {
        CREATED = CREATE_GIFT_PRODUCT
        PRODUCTS = GIFTS
      }
      await graphQLClient.request(CREATED, { input: data })

      mutate([PRODUCTS, { site: process.env.API_SITE }])
    }
  };
  const filter = (inputValue: string, path: DefaultOptionType[]) =>
  path.some(
    option => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
  );
  return (
    <Transition.Root show={openMP} as={Fragment}>
      <Dialog as="div" className="relative z-30" initialFocus={cancelButtonRef} onClose={setOpenMP}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    {/* <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationIcon className="h-6 w-6 text-pink-600" aria-hidden="true" />
                    </div> */}
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        New Product
                      </Dialog.Title>

                    </div>
                  </div>
                  <Form
                    // {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={{
                      title: product ? product?.article.title : "",
                      mark: product ? product?.article.mark : "",
                      featured: product ? product?.article.featured.name : "",
                      route: product ? getQuery(product?.article.route) : [],
                      description: product ? product?.article.description : "",
                      price: product ? product?.article.price : 0,
                      discountPrice: product ? product?.article.discountPrice : 0,
                      inStock: product ? product?.article.inStock : 1,
                    }}
                    scrollToFirstError
                    className="grid grid-cols-2 gap-x-3"
                  >
                    <Form.Item
                      name="title"
                      label="Name"
                      className="col-span-2"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Product Name!',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    
                    <Form.Item
                      name="mark"
                      label="Mark"
                      className="col-span-1"

                      rules={[{ required: true, message: 'Please select mark!' }]}
                    >
                      <Select placeholder="select your mark">
                        <Option value="terra">Terra</Option>
                        <Option value="terrakota">Terrakota</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="featured"
                      label="Featured"
                      className="col-span-1"

                      rules={[{ required: true, message: 'Please select featured!' }]}
                    >
                      <Select placeholder="select your featured">
                        <Option value="none">None</Option>
                        <Option value="2x1">2x1</Option>
                        <Option value="descuentos-de-julio">Descuentos de Julio</Option>
                      </Select>
                    </Form.Item>


                    

                    <Form.Item
                      name="route"
                      label="Route"
                      className="col-span-2"
                      rules={[
                        { type: 'array', required: true, message: 'Please select your route!' },
                      ]}
                    >
                      <Cascader 
                      options={route} 
                      showSearch={{ filter }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="description"
                      label="Description"
                      className='col-span-2'
                      rules={[{ required: true, message: 'Please input Description' }]}
                    >
                      <Input.TextArea rows={5}  showCount maxLength={1000} />
                    </Form.Item>
                    
                    <Form.Item label="Price" className="col-span-1">
                      <Form.Item name="price" noStyle>
                        <InputNumber min={0} defaultValue={0}  />
                      </Form.Item>
                      <span className="ant-form-text"> Bs</span>
                    </Form.Item>
                    <Form.Item label="Discount Price" className="col-span-1">
                      <Form.Item name="discountPrice" noStyle>
                        <InputNumber min={0} defaultValue={0}  />
                      </Form.Item>
                      <span className="ant-form-text"> Bs</span>
                    </Form.Item>
                    <Form.Item label="Stock" className="col-span-2">
                      <Form.Item name="inStock" noStyle>
                        <InputNumber min={1} max={10} defaultValue={1}  />
                      </Form.Item>
                      <span className="ant-form-text"> unidades</span>
                    </Form.Item>

                  <div className=" col-span-2 flex  justify-end gap-3">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500  sm:w-auto sm:text-sm"
                        onClick={() => setOpenMP(false)}
                      >
                        {
                          product ? 'Updated'
                            : 'Created'
                        }
                      </button>
                      <button
                        type="button"
                        className=" w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500  sm:w-auto sm:text-sm"
                        onClick={() => setOpenMP(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>

                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
