import React, { FC } from 'react'

import { IconButton, Menu, MenuItem, Typography } from '@mui/material'

import { Delete, Edit, MoreHoriz } from '@mui/icons-material'

type Props = {
  anchorElement: HTMLElement | null
  handleClickOptionsMenu: (e: any) => void
  handleCloseOptionsMenu: (e: any) => void
  handleUpdateButtonClick?: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => void
  handleDeleteButtonClick: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => void
}

export const EllipsisMenuButton: FC<Props> = ({
  anchorElement,
  handleClickOptionsMenu,
  handleCloseOptionsMenu,
  handleUpdateButtonClick,
  handleDeleteButtonClick,
}) => {
  return (
    <>
      <IconButton
        size='small'
        sx={{ position: 'absolute', right: 2, top: 1 }}
        onClick={handleClickOptionsMenu}
      >
        <MoreHoriz fontSize='small' />
      </IconButton>

      <Menu
        keepMounted
        open={Boolean(anchorElement)}
        onClose={handleCloseOptionsMenu}
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {handleUpdateButtonClick !== undefined && (
          <MenuItem onClick={handleUpdateButtonClick}>
            <Edit fontSize='small' sx={{ mr: 2 }} />
            <Typography variant='body2'>Edit</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteButtonClick}>
          <Delete fontSize='small' sx={{ mr: 2 }} />
          <Typography variant='body2'>Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}
