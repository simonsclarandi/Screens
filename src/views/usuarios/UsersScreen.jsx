import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, IconButton, Typography, Chip, Dialog, DialogTitle, DialogContent, 
  DialogContentText, TextField, DialogActions, Box, Tooltip, Avatar, FormControl, 
  InputLabel, Select, MenuItem 
} from '@mui/material';
import { Edit, Delete, PersonAdd, Group, Email, WarningAmber } from '@mui/icons-material';

const UsersScreen = () => {
  // --- BASE DE DATOS SIMULADA ---
  const [users, setUsers] = useState([
    { id: 1, name: 'Simón Peralta', email: 'simon@puntocell.com', role: 'Administrador', status: 'Activo' },
    { id: 2, name: 'Ana García', email: 'ana@puntocell.com', role: 'Vendedor', status: 'Activo' },
    { id: 3, name: 'Lucas Tech', email: 'lucas@puntocell.com', role: 'Técnico', status: 'Inactivo' },
  ]);

  // --- ESTADOS: MODAL DE CREAR/EDITAR ---
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', status: 'Activo' });

  // --- ESTADOS: ALERT DE ELIMINAR ---
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // ==========================================
  // LÓGICA DE CREAR / EDITAR
  // ==========================================
  const handleOpen = (userToEdit = null) => {
    if (userToEdit) {
      setEditMode(true);
      setEditingId(userToEdit.id);
      setFormData({ name: userToEdit.name, email: userToEdit.email, role: userToEdit.role, status: userToEdit.status });
    } else {
      setEditMode(false);
      setEditingId(null);
      setFormData({ name: '', email: '', role: '', status: 'Activo' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (editMode) {
      // Reemplazamos los datos del usuario editado
      setUsers(users.map(u => u.id === editingId ? { ...u, ...formData } : u));
    } else {
      // Creamos un usuario nuevo
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers([...users, { id: newId, ...formData }]);
    }
    handleClose();
  };

  // ==========================================
  // LÓGICA DE ELIMINAR
  // ==========================================
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenDeleteAlert(true); // Abre la alerta
  };

  const confirmDelete = () => {
    // Filtramos la lista sacando al usuario que coincide con el ID a eliminar
    setUsers(users.filter(u => u.id !== userToDelete.id));
    setOpenDeleteAlert(false);
    setUserToDelete(null);
  };

  return (
    <Box className="animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Typography variant="h4" className="font-extrabold text-slate-800 flex items-center gap-3">
            <Group sx={{ color: '#2563eb', fontSize: 36 }} /> Gestión de Usuarios
          </Typography>
          <Typography variant="body1" className="text-slate-500 mt-1">
            Administra el acceso y los roles de tus empleados.
          </Typography>
        </div>
        <Button 
          variant="contained" 
          startIcon={<PersonAdd />}
          onClick={() => handleOpen()} // Crear
          sx={{
            bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' },
            py: 1.25, px: 3, borderRadius: '12px', boxShadow: 3, textTransform: 'none', fontWeight: 600
          }}
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* TABLA PRINCIPAL */}
      <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: '16px', border: '1px solid #f1f5f9' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Contacto</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Rol Asignado</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Estado</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: '#475569', px: 3 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 'bold', width: 36, height: 36 }}>
                      {row.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontWeight: 600, color: '#334155' }}>{row.name}</Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Email fontSize="small" /> 
                    <Typography variant="body2">{row.email}</Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip label={row.role} size="small" variant="outlined" sx={{ fontWeight: 500, color: '#475569', borderColor: '#cbd5e1' }} />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    size="small" 
                    color={row.status === 'Activo' ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ px: 3 }}>
                  
                  {/* BOTÓN EDITAR */}
                  <Tooltip title="Editar Usuario">
                    <IconButton 
                      onClick={() => handleOpen(row)} 
                      sx={{ color: '#2563eb', '&:hover': { bgcolor: '#eff6ff' }, mr: 1 }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* BOTÓN ELIMINAR */}
                  <Tooltip title="Eliminar Usuario">
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
      {/* 1. MODAL DE CREAR / EDITAR                 */}
      {/* ========================================== */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}>
        <DialogTitle component="div" sx={{ pb: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            {editMode ? 'Actualizar Usuario' : 'Registrar Nuevo Usuario'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          
          <TextField
            label="Nombre Completo"
            fullWidth variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
          />

          <TextField
            label="Correo Electrónico"
            type="email"
            fullWidth variant="outlined"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
          />

          <div className="flex gap-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel>Rol del Sistema</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Rol del Sistema"
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="Administrador">Administrador</MenuItem>
                <MenuItem value="Vendedor">Vendedor</MenuItem>
                <MenuItem value="Técnico">Técnico</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Estado"
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </div>

        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} sx={{ color: '#64748b', fontWeight: 'bold' }}>CANCELAR</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={!formData.name || !formData.email || !formData.role} 
            sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, px: 3, borderRadius: '8px', fontWeight: 'bold' }}
          >
            {editMode ? 'GUARDAR CAMBIOS' : 'CREAR USUARIO'}
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
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Eliminar Usuario</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#475569' }}>
            ¿Estás seguro que deseas eliminar a <strong>{userToDelete?.name}</strong> del sistema? Esta acción no se puede deshacer y el usuario perderá acceso inmediatamente.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setOpenDeleteAlert(false)} 
            sx={{ color: '#64748b', fontWeight: 'bold' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained"
            sx={{ bgcolor: '#e11d48', '&:hover': { bgcolor: '#be123c' }, fontWeight: 'bold', borderRadius: '8px' }}
          >
            Sí, Eliminar
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default UsersScreen;