import { ChangeEvent, useCallback, useState } from 'react'
import { Product, Discount } from '../../types'
import { completeEditingProduct, addNewProduct } from '../hooks/utils'
import { areAllValuesEmpty } from './utils'

type OnProductUpdate = (product: Product) => void;
type OnProductAdd = (product: Product) => void;

interface useManageProductsProps {
  products: Product[]
  onProductUpdate: OnProductUpdate;
  onProductAdd: OnProductAdd;
}

export const useManageProducts = ({ products, onProductUpdate, onProductAdd }: useManageProductsProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 })
  const [isNewProductForm, setIsNewProductForm] = useState(false)

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product })
  }

  const handleUpdateProduct = useCallback(
    (e: ChangeEvent) => {
      const { id, name, value } = e.target as HTMLInputElement
      if (editingProduct && editingProduct.id === id) {
        const updatedProduct = { ...editingProduct, [name]: value }
        setEditingProduct(updatedProduct)
      }
    },
    [editingProduct],
  )

  const handleEditComplete = useCallback(() => {
    completeEditingProduct(editingProduct, onProductUpdate, () => setEditingProduct(null));
  }, [editingProduct, onProductUpdate]);

  const handleAddDiscount = useCallback(
    (productId: string) => {
      const updatedProduct = products.find((p) => p.id === productId)
      if (areAllValuesEmpty(newDiscount.quantity, newDiscount.rate)) return

      if (updatedProduct && editingProduct) {
        const newProduct = {
          ...updatedProduct,
          discounts: [...updatedProduct.discounts, newDiscount],
        }
        onProductUpdate(newProduct)
        setEditingProduct(newProduct)
        setNewDiscount({ quantity: 0, rate: 0 })
      }
    },
    [products, editingProduct, newDiscount],
  )

  const handleRemoveDiscount = useCallback(
    (productId: string, index: number) => {
      const updatedProduct = products.find((p) => p.id === productId)
      if (updatedProduct) {
        const newProduct = {
          ...updatedProduct,
          discounts: updatedProduct.discounts.filter((_, i) => i !== index),
        }
        onProductUpdate(newProduct)
        setEditingProduct(newProduct)
      }
    },
    [products],
  )

  const handleAddNewProduct = useCallback(() => {
    addNewProduct(newProduct, onProductAdd, () => {
      setNewProduct({ name: '', price: 0, stock: 0, discounts: [] });
      setIsNewProductForm(false);
    }, areAllValuesEmpty);
  }, [newProduct, onProductAdd]);

  const toggleNewProductForm = useCallback(() => {
    setIsNewProductForm((prev) => !prev)
  }, [])

  return {
    editingProduct,
    newProduct,
    newDiscount,
    isNewProductForm,
    setNewProduct,
    setNewDiscount,
    toggleNewProductForm,
    handleEditProduct,
    handleEditComplete,
    handleAddDiscount,
    handleAddNewProduct,
    handleUpdateProduct,
    handleRemoveDiscount,
  }
}
