import { createContext, FC, PropsWithChildren, useState } from 'react'

type AdminContextType = {
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)

  const contextValue = {
    isAdmin,
    setIsAdmin,
  }

  return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>
}
