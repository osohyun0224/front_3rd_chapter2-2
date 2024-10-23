import { FC, ReactNode } from 'react'

type SectionTemplatesProps = {
  title: string
  children: ReactNode
}

export const SectionTemplates: FC<SectionTemplatesProps> = ({ title, children }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  )
}
