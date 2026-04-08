import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, IconButton, Typography, Chip, Dialog, DialogTitle, DialogContent, 
  DialogContentText, TextField, DialogActions, Box, Checkbox, FormControlLabel, Tooltip
} from '@mui/material';
import { Edit, Delete, Add, Shield, WarningAmber } from '@mui/icons-material';

const RolesScreen = () => {
  // --- BASE DE DATOS SIMULADA ---
  const [roles, setRoles] = useState([
    { id: 1, name: 'Administrador', permissions: ['Ventas', 'Inventario', 'Usuarios', 'Configuración'] },
    { id: 2, name: 'Vendedor', permissions: ['Ventas', 'Ver Stock'] },
    { id: 3, name: 'Técnico', permissions: ['Reparaciones', 'Ver Stock'] },
  ]);

  // --- ESTADOS: MODAL DE CREAR/EDITAR ---
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); 
  const [editingId, setEditingId] = useState(null); 
  
  // Estados de los inputs
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // --- ESTADOS: ALERT DE ELIMINAR ---
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // ==========================================
  // LÓGICA DE CREAR / EDITAR
  // ==========================================
  const handleOpen = (rolAEditar = null) => {
    if (rolAEditar) {
      setEditMode(true);
      setEditingId(rolAEditar.id);
      setNewRoleName(rolAEditar.name);
      setSelectedPermissions(rolAEditar.permissions);
    } else {
      setEditMode(false);
      setEditingId(null);
      setNewRoleName('');
      setSelectedPermissions([]);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (editMode) {
      const rolesActualizados = roles.map((rol) => 
        rol.id === editingId 
          ? { ...rol, name: newRoleName, permissions: selectedPermissions } 
          : rol
      );
      setRoles(rolesActualizados);
    } else {
      const nuevoId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
      const nuevoRol = { id: nuevoId, name: newRoleName, permissions: selectedPermissions };
      setRoles([...roles, nuevoRol]);
    }
    handleClose();
  };

  const togglePermission = (perm) => {
    setSelectedPermissions((prev) => 
      prev.includes(perm) 
        ? prev.filter(p => p !== perm) 
        : [...prev, perm]
    );
  };

  // ==========================================
  // LÓGICA DE ELIMINAR
  // ==========================================
  const handleDeleteClick = (rol) => {
    setRoleToDelete(rol);
    setOpenDeleteAlert(true);
  };

  const confirmDelete = () => {
    setRoles(roles.filter(r => r.id !== roleToDelete.id));
    setOpenDeleteAlert(false);
    setRoleToDelete(null);
  };

  // Lista de permisos disponibles en el sistema
  const permisosDisponibles = ['Ventas', 'Inventario', 'Usuarios', 'Reparaciones', 'Configuración', 'Ver Stock'];

  return (
    <Box className="animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <Typography variant="h4" className="font-extrabold text-slate-800 flex items-center gap-3">
          <Shield sx={{ color: '#2563eb', fontSize: 36 }} /> Gestión de Roles
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpen()} 
          sx={{
            bgcolor: '#2563eb', 
            '&:hover': { bgcolor: '#1d4ed8' }, 
            py: 1.25, 
            px: 3, 
            borderRadius: '12px', 
            boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
            textTransform: 'none', 
            fontWeight: 600 
          }}
        >
          Nuevo Rol
        </Button>
      </div>

      {/* TABLA MATERIAL UI */}
      <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: '16px', border: '1px solid #f1f5f9' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Nombre del Rol</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Permisos Activos</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: '#475569', px: 4 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={{ fontFamily: 'monospace', color: '#94a3b8' }}>#{row.id}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>{row.name}</TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap max-w-md">
                    {row.permissions.map(p => (
                      <Chip 
                        key={p} 
                        label={p} 
                        size="small" 
                        sx={{ fontWeight: 500, bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe' }} 
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell align="right" sx={{ px: 3 }}>
                  
                  {/* BOTÓN EDITAR */}
                  <Tooltip title="Editar Rol">
                    <IconButton 
                      onClick={() => handleOpen(row)} 
                      sx={{ color: '#2563eb', '&:hover': { bgcolor: '#eff6ff' }, mr: 1 }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* BOTÓN ELIMINAR */}
                  <Tooltip title="Eliminar Rol">
                    <IconButton 
                      onClick={() => handleDeleteClick(row)}
                      sx={{ color: '#e11d48', '&:hover': { bgcolor: '#fff1f2' } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ========================================== */}
      {/* 1. MODAL INTELIGENTE (CREAR / EDITAR)      */}
      {/* ========================================== */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}>
        <DialogTitle component="div" sx={{ pb: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            {editMode ? 'Actualizar Rol' : 'Crear Nuevo Rol'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Completa la información para asignar privilegios.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            label="Nombre del Rol (ej. Supervisor)"
            fullWidth
            variant="outlined"
            sx={{ my: 2 }}
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
          />
          <Typography variant="subtitle2" sx={{ mb: 1.5, mt: 1, fontWeight: 'bold', color: '#334155', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            Permisos del Sistema
          </Typography>
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {permisosDisponibles.map((perm) => (
              <FormControlLabel 
                key={perm} 
                control={
                  <Checkbox 
                    checked={selectedPermissions.includes(perm)} 
                    onChange={() => togglePermission(perm)}
                    sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }}
                  />
                } 
                label={<span className="text-sm text-slate-700">{perm}</span>} 
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            sx={{
              bgcolor: '#2563eb',
              '&:hover': { bgcolor: '#1d4ed8' },
              px: 3,
              borderRadius: '8px',
              fontWeight: 'bold',
              textTransform: 'none'
            }}
            onClick={handleSave}
            disabled={!newRoleName.trim() || selectedPermissions.length === 0} 
          >
            {editMode ? 'Guardar Cambios' : 'Crear Rol'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================== */}
      {/* 2. ALERT DE CONFIRMACIÓN (ELIMINAR)        */}
      {/* ========================================== */}
      <Dialog 
        open={openDeleteAlert} 
        onClose={() => setOpenDeleteAlert(false)}
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1, maxWidth: '400px' } } }}
      >
        <DialogTitle component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#e11d48', pb: 1 }}>
          <WarningAmber fontSize="large" /> 
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Eliminar Rol</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#475569' }}>
            ¿Estás seguro que deseas eliminar el rol <strong>{roleToDelete?.name}</strong>? 
            Los usuarios que tengan este rol asignado perderán sus permisos en el sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOpenDeleteAlert(false)} sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained"
            sx={{ bgcolor: '#e11d48', '&:hover': { bgcolor: '#be123c' }, fontWeight: 'bold', borderRadius: '8px', textTransform: 'none' }}
          >
            Sí, Eliminar
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default RolesScreen;