import cn from 'classnames'
import React, { ReactNode } from 'react'
import classes from './style.module.css'

interface Props {
  head?: ReactNode
  color: 'success' | 'danger' | 'warning' | 'info'
  className?: string
  children?: ReactNode
}

export const Tag: React.FC<Props> = ({ head, children, color, className }) => (
  <div className={cn(classes.container, classes[color], className)}>
    {head && <div className={classes.head}>{head}</div>}
    {children && <div className={classes.body}>{children}</div>}
  </div>
)
