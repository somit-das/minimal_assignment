/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string,
    name: string,
    class: string,
    section: string,
    rollNumber: string,
    address: string,
    phone: string,
    email: string,
    dob: string,
    gender: string,
    fatherName: string,
    motherName: string,
    bloodGroup: string,
};


interface UserTableRowProps {
  row: any;
  iden?: string;
  selected: boolean;
  onSelectRow: (row: any) => void;
}
export function UserTableRow({ row, iden, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}

        {/* <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.name} src={row.avatarUrl} />
            {row.name}
          </Box>
        </TableCell> */}
        <TableCell>{iden }</TableCell>

        <TableCell>{row.name}</TableCell>

        <TableCell>{row.class}</TableCell>

        <TableCell>
          {
            row.section
            //  ? (
            //   <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
            // ) : (
            //   '-'
            // )
          }
        </TableCell>
        {/* <TableCell>{row.section}</TableCell> */}
        <TableCell>{row.rollNumber}</TableCell>
        {/* <TableCell>{row.address}</TableCell> */}

        <TableCell>
          <Label color={(row.phone === 'banned' && 'error') || 'success'}>{row.phone}</Label>
        </TableCell>

        <TableCell>{row.email}</TableCell>
        <TableCell>{row.dob}</TableCell>
        <TableCell>{row.gender}</TableCell>
        {/* <TableCell>{row.fatherName}</TableCell> */}
        {/* <TableCell>{row.motherName}</TableCell> */}
        {/* <TableCell>{row.bloodGroup}</TableCell> */}

        <TableCell>
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="material-symbols:preview" />
            view
          </MenuItem>
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
