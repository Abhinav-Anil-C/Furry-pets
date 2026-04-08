import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getPets } from '@/api/pets';
import { getAppointmentById, createAppointment, updateAppointment } from '@/api/appointments';
import { AppointmentFormData } from '@/types/appointment';
import { Pet } from '@/types/pet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { BottomNav } from '@/components/BottomNav';

export function AppointmentForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    defaultValues: {
      reminder: true,
      reminderTime: '1 day before',
    },
  });

  const selectedPetId = watch('petId');
  const appointmentType = watch('type');
  const reminder = watch('reminder');

  const loadPets = useCallback(async () => {
    try {
      console.log('Loading pets for appointment form...');
      const response = await getPets();
      setPets(response.pets);
      if (response.pets.length > 0 && !isEditMode) {
        setValue('petId', response.pets[0]._id);
      }
      console.log('Pets loaded');
    } catch (error: unknown) {
      console.error('Error loading pets:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  }, [isEditMode, setValue, toast]);

  const loadAppointment = useCallback(async (appointmentId: string) => {
    try {
      console.log('Loading appointment for editing:', appointmentId);
      const response = await getAppointmentById(appointmentId);
      const appointment = response.appointment;
      setValue('petId', appointment.petId);
      setValue('type', appointment.type);
      setValue('date', appointment.date);
      setValue('time', appointment.time);
      setValue('location', appointment.location);
      setValue('notes', appointment.notes);
      setValue('reminder', appointment.reminder);
      setValue('reminderTime', appointment.reminderTime);
      console.log('Appointment data loaded for editing');
    } catch (error: unknown) {
      console.error('Error loading appointment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      navigate('/schedule');
    }
  }, [setValue, toast, navigate]);

  useEffect(() => {
    loadPets();
    if (isEditMode && id) {
      loadAppointment(id);
    }
  }, [id, isEditMode, loadPets, loadAppointment]);

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    try {
      console.log('Submitting appointment form:', isEditMode ? 'edit' : 'create');
      if (isEditMode && id) {
        const response = await updateAppointment(id, data);
        toast({
          title: 'Success',
          description: response.message,
        });
        console.log('Appointment updated successfully');
        navigate('/schedule');
      } else {
        const response = await createAppointment(data);
        toast({
          title: 'Success',
          description: response.message,
        });
        console.log('Appointment created successfully');
        navigate('/schedule');
      }
    } catch (error: unknown) {
      console.error('Error saving appointment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (pets.length === 0 && !loading) {
    return (
      <div className="pb-20">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">You need to add a pet before scheduling appointments.</p>
            <Button onClick={() => navigate('/pets/add')}>Add Your First Pet</Button>
          </CardContent>
        </Card>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Button variant="ghost" onClick={() => navigate('/schedule')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Schedule
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{isEditMode ? 'Edit Appointment' : 'Add New Appointment'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="petId">Select Pet *</Label>
              <Select value={selectedPetId} onValueChange={(value) => setValue('petId', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet._id} value={pet._id}>
                      {pet.name} - {pet.breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.petId && <p className="text-sm text-destructive mt-1">{errors.petId.message}</p>}
            </div>

            <div>
              <Label htmlFor="type">Appointment Type *</Label>
              <Select value={appointmentType} onValueChange={(value) => setValue('type', value as unknown)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vaccination">💉 Vaccination</SelectItem>
                  <SelectItem value="Checkup">🩺 Checkup</SelectItem>
                  <SelectItem value="Grooming">✂️ Grooming</SelectItem>
                  <SelectItem value="Other">📋 Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                  className="mt-1"
                />
                {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
              </div>

              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time', { required: 'Time is required' })}
                  className="mt-1"
                />
                {errors.time && <p className="text-sm text-destructive mt-1">{errors.time.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location/Clinic Name *</Label>
              <Input
                id="location"
                {...register('location', { required: 'Location is required' })}
                placeholder="Enter clinic or location name"
                className="mt-1"
              />
              {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Add any additional notes or instructions"
                className="mt-1 min-h-24"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminder">Set Reminder</Label>
                  <p className="text-sm text-muted-foreground">Receive a notification before the appointment</p>
                </div>
                <Switch
                  id="reminder"
                  checked={reminder}
                  onCheckedChange={(checked) => setValue('reminder', checked)}
                />
              </div>

              {reminder && (
                <div>
                  <Label htmlFor="reminderTime">Reminder Time</Label>
                  <Select
                    value={watch('reminderTime')}
                    onValueChange={(value) => setValue('reminderTime', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15 minutes before">15 minutes before</SelectItem>
                      <SelectItem value="30 minutes before">30 minutes before</SelectItem>
                      <SelectItem value="1 hour before">1 hour before</SelectItem>
                      <SelectItem value="2 hours before">2 hours before</SelectItem>
                      <SelectItem value="1 day before">1 day before</SelectItem>
                      <SelectItem value="2 days before">2 days before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/schedule')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{isEditMode ? 'Update Appointment' : 'Add Appointment'}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <BottomNav />
    </div>
  );
}