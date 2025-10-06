import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { eventosService } from '../../services/eventosService';

const initialForm = {
  nombre: '',
  descripcion: '',
  fecha: '',
  aforo_maximo: 1,
  precio: 0,
  ubicacion: ''
};

const AdminEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const res = await eventosService.getAll();
      setEventos(res.eventos || []);
    } catch (err) {
      setError('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleShowModal = (evento = null) => {
    setError('');
    setSuccess('');
    if (evento) {
      setEditId(evento.id);
      setForm({
        nombre: evento.nombre,
        descripcion: evento.descripcion,
        fecha: evento.fecha ? evento.fecha.slice(0, 16) : '',
        aforo_maximo: evento.aforo_maximo,
        precio: evento.precio,
        ubicacion: evento.ubicacion || ''
      });
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
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editId) {
        await eventosService.update(editId, {
          ...form,
          aforo_maximo: Number(form.aforo_maximo),
          precio: Number(form.precio)
        });
        setSuccess('Evento actualizado correctamente');
      } else {
        await eventosService.create({
          ...form,
          aforo_maximo: Number(form.aforo_maximo),
          precio: Number(form.precio)
        });
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
            <th>Nombre</th>
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
              <td colSpan={6}>No hay eventos</td>
            </tr>
          ) : (
            eventos.map(ev => (
              <tr key={ev.id}>
                <td>{ev.nombre}</td>
                <td>{new Date(ev.fecha).toLocaleString()}</td>
                <td>{ev.aforo_maximo}</td>
                <td>${ev.precio}</td>
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
              <Form.Control name="descripcion" value={form.descripcion} onChange={handleChange} required as="textarea" />
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
              <Form.Control type="number" name="precio" value={form.precio} onChange={handleChange} min={0} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control name="ubicacion" value={form.ubicacion} onChange={handleChange} />
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
