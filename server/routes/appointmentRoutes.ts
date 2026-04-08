import express, { Request, Response } from 'express';
import { requireUser } from './middlewares/auth';
import * as appointmentService from '../services/appointmentService';

const router = express.Router();

// Description: Get all appointments for the current user
// Endpoint: GET /api/appointments
// Request: {}
// Response: { appointments: Appointment[] }
router.get('/', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const appointments = await appointmentService.getAllAppointments(userId);
    res.status(200).json({ appointments });
  } catch (error: any) {
    console.error(`Error fetching appointments: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to fetch appointments' });
  }
});

// Description: Get a single appointment by ID
// Endpoint: GET /api/appointments/:id
// Request: { id: string }
// Response: { appointment: Appointment }
router.get('/:id', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const { id } = req.params;

    const appointment = await appointmentService.getAppointmentById(id, userId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ appointment });
  } catch (error: any) {
    console.error(`Error fetching appointment: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to fetch appointment' });
  }
});

// Description: Create a new appointment
// Endpoint: POST /api/appointments
// Request: { appointment: AppointmentFormData }
// Response: { appointment: Appointment, message: string }
router.post('/', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const appointmentData = req.body;

    const appointment = await appointmentService.createAppointment(appointmentData, userId);

    res.status(201).json({ appointment, message: 'Appointment scheduled successfully!' });
  } catch (error: any) {
    console.error(`Error creating appointment: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to create appointment' });
  }
});

// Description: Update an existing appointment
// Endpoint: PUT /api/appointments/:id
// Request: { id: string, appointment: AppointmentFormData }
// Response: { appointment: Appointment, message: string }
router.put('/:id', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const { id } = req.params;
    const appointmentData = req.body;

    const appointment = await appointmentService.updateAppointment(id, appointmentData, userId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ appointment, message: 'Appointment updated successfully!' });
  } catch (error: any) {
    console.error(`Error updating appointment: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to update appointment' });
  }
});

// Description: Delete an appointment
// Endpoint: DELETE /api/appointments/:id
// Request: { id: string }
// Response: { message: string }
router.delete('/:id', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const { id } = req.params;

    const deleted = await appointmentService.deleteAppointment(id, userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted' });
  } catch (error: any) {
    console.error(`Error deleting appointment: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to delete appointment' });
  }
});

// Description: Mark appointment as complete
// Endpoint: PATCH /api/appointments/:id/complete
// Request: { id: string }
// Response: { appointment: Appointment, message: string }
router.patch('/:id/complete', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const { id } = req.params;

    const appointment = await appointmentService.markAppointmentComplete(id, userId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ appointment, message: 'Appointment marked as complete' });
  } catch (error: any) {
    console.error(`Error marking appointment complete: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to mark appointment complete' });
  }
});

export default router;
