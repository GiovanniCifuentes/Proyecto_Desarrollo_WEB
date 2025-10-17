import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { eventosService } from '../../services/eventosService';

const initialForm = {
  nombre: '',
  descripcion: '',
  fecha: '',
  aforo_maximo: 1,
  precio: 0,
  tipo: 'concierto',
  ubicacion: '',
  imagen: null
};

const AdminEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchEventos = async () => {
    try {
      const res = await eventosService.getAll();
      setEventos(res.eventos || []);
    } catch (err) {
      setError('Error al cargar eventos');
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleShowModal = (evento = null) => {
    setError('');
    setSuccess('');
    setImageFile(null);
    setImagePreview(null);
    if (evento) {
      setEditId(evento.id);
      setForm({
        nombre: evento.nombre,
        descripcion: evento.descripcion,
        fecha: evento.fecha ? evento.fecha.slice(0, 16) : '',
        aforo_maximo: evento.aforo_maximo,
        precio: evento.precio,
        tipo: evento.tipo || 'concierto',
        ubicacion: evento.ubicacion || '',
        imagen: evento.imagen || null
      });
      setImagePreview(evento.imagen || null);
    } else {
      setEditId(null);
      setForm(initialForm);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditId(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        return;
      }
      
      // Validar tipo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Solo se permiten imágenes (jpg, jpeg, png, gif, webp)');
        return;
      }

      setImageFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('descripcion', form.descripcion);
      formData.append('fecha', form.fecha);
      formData.append('aforo_maximo', form.aforo_maximo);
      formData.append('precio', form.precio);
      formData.append('tipo', form.tipo);
      formData.append('ubicacion', form.ubicacion || '');
      
      // Solo agregar imagen si hay una nueva seleccionada
      if (imageFile) {
        formData.append('imagen', imageFile);
      }

      if (editId) {
        await eventosService.update(editId, formData);
        setSuccess('Evento actualizado correctamente');
      } else {
        await eventosService.create(formData);
        setSuccess('Evento creado correctamente');
      }
      handleCloseModal();
      fetchEventos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar evento');
    }
  };

  const handleDelete = async () => {
    setError('');
    setSuccess('');
    try {
      await eventosService.delete(deleteId);
      setSuccess('Evento eliminado correctamente');
      setShowDelete(false);
      fetchEventos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar evento');
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Administración de Eventos</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Button className="mb-3" onClick={() => handleShowModal()}>Crear Evento</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Aforo</th>
            <th>Precio</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventos.length === 0 ? (
            <tr>
              <td colSpan={8}>No hay eventos</td>
            </tr>
          ) : (
            eventos.map(ev => (
              <tr key={ev.id}>
                <td>
                  {ev.imagen ? (
                    <img src={ev.imagen} alt={ev.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#e0e0e0', borderRadius: '4px' }}></div>
                  )}
                </td>
                <td>{ev.nombre}</td>
                <td>
                  <span className="badge bg-primary">{ev.tipo}</span>
                </td>
                <td>{new Date(ev.fecha).toLocaleString()}</td>
                <td>{ev.aforo_maximo}</td>
                <td>Q {ev.precio}</td>
                <td>{ev.ubicacion}</td>
                <td>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => handleShowModal(ev)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => { setDeleteId(ev.id); setShowDelete(true); }}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Evento' : 'Crear Evento'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control name="descripcion" value={form.descripcion} onChange={handleChange} required as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Evento</Form.Label>
              <Form.Select name="tipo" value={form.tipo} onChange={handleChange} required>
                <option value="concierto">Concierto</option>
                <option value="teatro">Teatro</option>
                <option value="cine">Cine</option>
                <option value="deporte">Deporte</option>
                <option value="comedia">Comedia</option>
                <option value="otro">Otro</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha y hora</Form.Label>
              <Form.Control type="datetime-local" name="fecha" value={form.fecha} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Aforo máximo</Form.Label>
              <Form.Control type="number" name="aforo_maximo" value={form.aforo_maximo} onChange={handleChange} min={1} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" name="precio" value={form.precio} onChange={handleChange} min={0} step="0.01" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control name="ubicacion" value={form.ubicacion} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagen del Evento</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              <Form.Text className="text-muted">
                Formatos: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB
              </Form.Text>
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }}
                  />
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="primary" type="submit">{editId ? 'Actualizar' : 'Crear'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este evento?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminEventos;
