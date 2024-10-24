import { Context, useContext } from 'react'
import { AdminContext } from '../context'

export const useContextProvider = <T>(contextType: Context<T | undefined>) => {
  const context = useContext(contextType)
  return context
}

export const useAdminCheckedContext = () => {
  return useContextProvider(AdminContext)
}
