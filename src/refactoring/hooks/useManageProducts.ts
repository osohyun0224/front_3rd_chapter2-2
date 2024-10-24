import { ChangeEvent, useCallback, useState } from 'react'
import { Product, Discount } from '../../types'
import { addNewProduct, areAllValuesEmpty } from '../hooks/utils'

type OnProductUpdate = (product: Product) => void;
type OnProductAdd = (product: Product) => void;

interface useManageProductsProps {
  products: Product[];
  onProductUpdate: OnProductUpdate;
  onProductAdd: OnProductAdd;
}

export const useManageProducts = ({ products, onProductUpdate, onProductAdd }: useManageProductsProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ name: '', price: 0, stock: 0, discounts: [] });
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });
  const [isNewProductForm, setIsNewProductForm] = useState(false);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
  }, []);

  const handleUpdateProduct = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingProduct) {
      const updatedProduct = { ...editingProduct, [name]: value };
      setEditingProduct(updatedProduct);
    }
  }, [editingProduct]);

  const handleEditComplete = useCallback(() => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  }, [editingProduct, onProductUpdate]);

  const handleAddDiscount = useCallback((productId: string) => {
    const updatedProduct = products.find(p => p.id === productId);
    if (!updatedProduct || areAllValuesEmpty(newDiscount.quantity, newDiscount.rate)) return;

    const newProduct = {
      ...updatedProduct,
      discounts: [...updatedProduct.discounts, newDiscount],
    };
    onProductUpdate(newProduct);
    setEditingProduct(newProduct);
    setNewDiscount({ quantity: 0, rate: 0 });
  }, [products, newDiscount, onProductUpdate]);

  const handleRemoveDiscount = useCallback((productId: string, index: number) => {
    const updatedProduct = products.find(p => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  }, [products, onProductUpdate]);

  const handleAddNewProduct = useCallback(() => {
    if (areAllValuesEmpty(newProduct.name, newProduct.price, newProduct.stock)) return;

    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({ name: '', price: 0, stock: 0, discounts: [] });
    setIsNewProductForm(false);
  }, [newProduct, onProductAdd]);

  const toggleNewProductForm = useCallback(() => {
    setIsNewProductForm(prev => !prev);
  }, []);


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
