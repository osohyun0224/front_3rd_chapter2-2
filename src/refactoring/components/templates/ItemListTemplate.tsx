import { ReactNode } from 'react'

type ItemListProps = {
  children: ReactNode
}
export const ItemListTemplate = ({ children }: ItemListProps) => {
  return <div className="space-y-2">
    {children}</div>
}
