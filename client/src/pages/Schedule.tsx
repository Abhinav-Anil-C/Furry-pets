import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar as CalendarIcon, CheckCircle2, Clock } from 'lucide-react';
import { getAppointments, deleteAppointment, markAppointmentComplete } from '@/api/appointments';
import { Appointment } from '@/types/appointment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/useToast';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { format, isSameDay, parseISO } from 'date-fns';

export function Schedule() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = useCallback(async () => {
    try {
      console.log('Loading appointments...');
      const response = await getAppointments();
      setAppointments(response.appointments);
      console.log('Appointments loaded:', response.appointments.length);
    } catch (error: unknown) {
      console.error('Error loading appointments:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleDeleteClick = (id: string) => {
    setAppointmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return;

    try {
      console.log('Deleting appointment:', appointmentToDelete);
      const response = await deleteAppointment(appointmentToDelete);
      setAppointments(appointments.filter((apt) => apt._id !== appointmentToDelete));
      toast({
        title: 'Success',
        description: response.message,
      });
      console.log('Appointment deleted');
    } catch (error: unknown) {
      console.error('Error deleting appointment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    }
  };

  const handleMarkComplete = async (id: string) => {
    try {
      console.log('Marking appointment as complete:', id);
      const response = await markAppointmentComplete(id);
      setAppointments(appointments.map((apt) => (apt._id === id ? response.appointment : apt)));
      toast({
        title: 'Success',
        description: response.message,
      });
      console.log('Appointment marked as complete');
    } catch (error: unknown) {
      console.error('Error marking appointment complete:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const upcomingAppointments = appointments.filter((apt) => !apt.completed && new Date(apt.date) >= new Date());
  const pastAppointments = appointments.filter((apt) => apt.completed || new Date(apt.date) < new Date());

  const appointmentDates = appointments.map((apt) => parseISO(apt.date));

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Vaccination':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'Checkup':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'Grooming':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'Other':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Vaccination':
        return '💉';
      case 'Checkup':
        return '🩺';
      case 'Grooming':
        return '✂️';
      case 'Other':
        return '📋';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="pb-20">
        <LoadingSpinner message="Loading schedule..." />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Schedule
            </h1>
            <p className="text-muted-foreground mt-1">Manage your pet's appointments</p>
          </div>
          <Button onClick={() => navigate('/schedule/add')} size="lg" className="rounded-full shadow-lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  appointment: appointmentDates,
                }}
                modifiersStyles={{
                  appointment: {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                  },
                }}
              />
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No upcoming appointments</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <Card key={appointment._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={appointment.petPhoto}
                              alt={appointment.petName}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-lg">{appointment.petName}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl">{getTypeIcon(appointment.type)}</span>
                                    <Badge className={getTypeColor(appointment.type)}>{appointment.type}</Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 text-sm text-muted-foreground mb-3">
                                <p>📅 {format(parseISO(appointment.date), 'MMMM d, yyyy')}</p>
                                <p>🕐 {appointment.time}</p>
                                <p>📍 {appointment.location}</p>
                                {appointment.notes && <p>📝 {appointment.notes}</p>}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/schedule/${appointment._id}`)}
                                  className="flex-1"
                                >
                                  View Details
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkComplete(appointment._id)}
                                  className="flex-1"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {pastAppointments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                    Past Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pastAppointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                      >
                        <img
                          src={appointment.petPhoto}
                          alt={appointment.petName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{appointment.petName}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.type} - {format(parseISO(appointment.date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        {appointment.completed && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Appointment"
        description="Are you sure you want to delete this appointment?"
      />

      <BottomNav />
    </div>
  );
}