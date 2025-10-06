import React, { useEffect, useState } from 'react';
import { Container, Table, Alert, Tabs, Tab, Badge } from 'react-bootstrap';
import { queuesService } from '../../services/queuesService';

const AdminColas = () => {
  const [stats, setStats] = useState(null);
  const [pdfJobs, setPdfJobs] = useState([]);
  const [emailJobs, setEmailJobs] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pdf');

  useEffect(() => {
    fetchStats();
    fetchJobs('pdf');
    fetchJobs('email');
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      const data = await queuesService.getStats();
      setStats(data);
    } catch (err) {
      setError('Error al obtener estadísticas de colas');
    }
  };

  const fetchJobs = async (queue) => {
    try {
      if (queue === 'pdf') {
        const data = await queuesService.getPdfJobs('waiting', 1, 10);
        setPdfJobs(data.trabajos || []);
      } else {
        const data = await queuesService.getEmailJobs('waiting', 1, 10);
        setEmailJobs(data.trabajos || []);
      }
    } catch (err) {
      setError('Error al obtener trabajos de colas');
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Monitoreo de Colas</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {stats && (
        <div className="mb-4">
          <h5>Estadísticas actuales:</h5>
          <ul>
            <li>
              <strong>PDF Queue:</strong>{' '}
              {Object.entries(stats.pdfQueue).map(([k, v]) => (
                <Badge bg="secondary" className="me-2" key={k}>{k}: {v}</Badge>
              ))}
            </li>
            <li>
              <strong>Email Queue:</strong>{' '}
              {Object.entries(stats.emailQueue).map(([k, v]) => (
                <Badge bg="secondary" className="me-2" key={k}>{k}: {v}</Badge>
              ))}
            </li>
          </ul>
        </div>
      )}

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="pdf" title="PDF Queue">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Trabajo</th>
                <th>Datos</th>
              </tr>
            </thead>
            <tbody>
              {pdfJobs.length === 0 ? (
                <tr>
                  <td colSpan={3}>No hay trabajos pendientes</td>
                </tr>
              ) : (
                pdfJobs.map(job => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.name}</td>
                    <td>
                      <pre style={{ fontSize: '0.8em', maxWidth: 300, overflowX: 'auto' }}>
                        {JSON.stringify(job.data, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="email" title="Email Queue">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Trabajo</th>
                <th>Datos</th>
              </tr>
            </thead>
            <tbody>
              {emailJobs.length === 0 ? (
                <tr>
                  <td colSpan={3}>No hay trabajos pendientes</td>
                </tr>
              ) : (
                emailJobs.map(job => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.name}</td>
                    <td>
                      <pre style={{ fontSize: '0.8em', maxWidth: 300, overflowX: 'auto' }}>
                        {JSON.stringify(job.data, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminColas;
