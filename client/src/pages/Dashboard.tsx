import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PawPrint } from 'lucide-react';
import { getPets, deletePet } from '@/api/pets';
import { Pet } from '@/types/pet';
import { PetCard } from '@/components/PetCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { BottomNav } from '@/components/BottomNav';

export function Dashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = useCallback(async () => {
    try {
      console.log('Loading pets...');
      const response = await getPets();
      setPets(response.pets);
      console.log('Pets loaded:', response.pets.length);
    } catch (error: unknown) {
      console.error('Error loading pets:', error);
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
    setPetToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!petToDelete) return;

    try {
      console.log('Deleting pet:', petToDelete);
      const response = await deletePet(petToDelete);
      setPets(pets.filter((pet) => pet._id !== petToDelete));
      toast({
        title: 'Success',
        description: response.message,
      });
      console.log('Pet deleted successfully');
    } catch (error: unknown) {
      console.error('Error deleting pet:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setPetToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="pb-20">
        <LoadingSpinner message="Loading your pets..." />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Pets
          </h1>
          <p className="text-muted-foreground mt-1">Manage your furry friends</p>
        </div>
        <Button onClick={() => navigate('/pets/add')} size="lg" className="rounded-full shadow-lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          description="Start by adding your first pet to keep track of their health and activities"
          actionLabel="Add Your First Pet"
          onAction={() => navigate('/pets/add')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet._id} pet={pet} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Pet"
        description="Are you sure you want to delete this pet? This action cannot be undone."
      />

      <BottomNav />
    </div>
  );
}