import { FC, PropsWithChildren } from 'react'
import { Header } from '../organisms'
import { AdminProvider } from '../../context'

export const AppTemplate: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto mt-6">{children}</main>
      </div>
    </AdminProvider>
  )
}
