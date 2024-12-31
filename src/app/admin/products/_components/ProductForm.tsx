'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useActionState, useState } from 'react'
import { addProduct, updateProduct } from '../../_actions/Products'
import { useFormStatus } from 'react-dom'
import { Product } from '@prisma/client'
import Image from 'next/image'

const ProductForm = ({ product }: { product?: Product | null }) => {
  const [priceInCents, setPriceInCents] = useState<number | ''>(
    product?.priceInCents ?? ''
  )

  const [error, action] = useActionState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  )

  return (
    <form action={action} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          className='border border-black'
          type='text'
          id='name'
          name='name'
          required
          defaultValue={product?.name ?? ''}
        />
        {error.name && <div className='text-destructive'>{error.name}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='priceInCents'>Price in PKR</Label>
        <Input
          className='border border-black'
          type='number'
          id='priceInCents'
          name='priceInCents'
          required
          value={priceInCents}
          onChange={e =>
            setPriceInCents(e.target.value === '' ? '' : Number(e.target.value))
          }
        />
        {error.priceInCents && (
          <div className='text-destructive'>{error.priceInCents}</div>
        )}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          className='border border-black'
          id='description'
          name='description'
          required
          defaultValue={product?.description}
        />
        {error.description && (
          <div className='text-destructive'>{error.description}</div>
        )}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='file'>File</Label>
        <Input
          className='border border-black'
          type='file'
          id='file'
          name='file'
          required={product == null}
        />
        {product != null && (
          <p className='text-sm text-muted-foreground'>
            Current File: {product.filePath}
          </p>
        )}
        {error.file && <div className='text-destructive'>{error.file}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='file'>Image</Label>
        <Input
          className='border border-black'
          type='file'
          id='image'
          name='image'
          required={product == null}
        />
        {product != null && (
          <Image
            src={product.imagePath}
            alt={product.name}
            width={300}
            height={300}
          />
        )}
        {error.image && <div className='text-destructive'>{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  )
}

function SubmitButton () {
  const { pending } = useFormStatus()

  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  )
}

export default ProductForm
