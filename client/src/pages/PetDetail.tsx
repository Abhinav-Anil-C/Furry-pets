import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Weight, Ruler, Palette } from 'lucide-react';
import { getPetById, deletePet } from '@/api/pets';
import { Pet } from '@/types/pet';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { BottomNav } from '@/components/BottomNav';

export function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadPet(id);
    }
  }, [id]);

  const loadPet = useCallback(async (petId: string) => {
    try {
      console.log('Loading pet details:', petId);
      const response = await getPetById(petId);
      setPet(response.pet);
      console.log('Pet details loaded');
    } catch (error: unknown) {
      console.error('Error loading pet:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [toast, navigate]);

  const handleDelete = async () => {
    if (!pet) return;

    try {
      console.log('Deleting pet:', pet._id);
      const response = await deletePet(pet._id);
      toast({
        title: 'Success',
        description: response.message,
      });
      console.log('Pet deleted successfully');
      navigate('/');
    } catch (error: unknown) {
      console.error('Error deleting pet:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="pb-20">
        <LoadingSpinner message="Loading pet details..." />
        <BottomNav />
      </div>
    );
  }

  if (!pet) {
    return null;
  }

  return (
    <div className="pb-20">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <div className="relative h-80">
            <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-4xl font-bold text-white mb-2">{pet.name}</h1>
              <p className="text-white/90 text-lg">{pet.breed}</p>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex gap-3 mb-6">
              <Button onClick={() => navigate(`/pets/${pet._id}/edit`)} className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit Pet
              </Button>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="flex-1">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Pet
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-semibold">{pet.age} years old</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Breed</p>
                    <p className="font-semibold">{pet.breed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="font-semibold flex items-center">
                      <Palette className="h-4 w-4 mr-2 text-primary" />
                      {pet.color}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Weight className="h-5 w-5 mr-2 text-primary" />
                    Physical Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-semibold">
                      {pet.weight} {pet.weightUnit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="font-semibold flex items-center">
                      <Ruler className="h-4 w-4 mr-2 text-primary" />
                      {pet.height} {pet.heightUnit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {pet.healthNotes && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Health Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{pet.healthNotes}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={`Delete ${pet.name}`}
        description={`Are you sure you want to delete ${pet.name}? This action cannot be undone.`}
      />

      <BottomNav />
    </div>
  );
}