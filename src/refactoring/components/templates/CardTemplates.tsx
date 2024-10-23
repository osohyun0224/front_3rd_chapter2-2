import { FC, ReactNode } from 'react'

type CardTemplatesProps = {
  title?: string
  children: ReactNode
}

export const CardTemplates: FC<CardTemplatesProps> = ({ title, children }) => {
  return (
    <div className="mt-4 mb-4 bg-white p-4 rounded shadow">
      {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
      {children}
    </div>
  )
}
