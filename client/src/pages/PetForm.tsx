import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { getPetById, createPet, updatePet } from '@/api/pets';
import { PetFormData } from '@/types/pet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { BottomNav } from '@/components/BottomNav';

export function PetForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PetFormData>({
    defaultValues: {
      weightUnit: 'kg',
      heightUnit: 'cm',
    },
  });

  const weightUnit = watch('weightUnit');
  const heightUnit = watch('heightUnit');

  useEffect(() => {
    if (isEditMode && id) {
      loadPet(id);
    }
  }, [id, isEditMode]);

  const loadPet = useCallback(async (petId: string) => {
    try {
      console.log('Loading pet for editing:', petId);
      const response = await getPetById(petId);
      const pet = response.pet;
      setValue('name', pet.name);
      setValue('age', pet.age);
      setValue('breed', pet.breed);
      setValue('color', pet.color);
      setValue('weight', pet.weight);
      setValue('weightUnit', pet.weightUnit);
      setValue('height', pet.height);
      setValue('heightUnit', pet.heightUnit);
      setValue('healthNotes', pet.healthNotes);
      setValue('photo', pet.photo);
      setImagePreview(pet.photo);
      console.log('Pet data loaded for editing');
    } catch (error: unknown) {
      console.error('Error loading pet:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [setValue, toast, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setValue('photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PetFormData) => {
    setLoading(true);
    try {
      console.log('Submitting pet form:', isEditMode ? 'edit' : 'create');
      if (isEditMode && id) {
        const response = await updatePet(id, data);
        toast({
          title: 'Success',
          description: response.message,
        });
        console.log('Pet updated successfully');
        navigate(`/pets/${id}`);
      } else {
        const response = await createPet(data);
        toast({
          title: 'Success',
          description: response.message,
        });
        console.log('Pet created successfully');
        navigate('/');
      }
    } catch (error: unknown) {
      console.error('Error saving pet:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      <Button variant="ghost" onClick={() => navigate(isEditMode ? `/pets/${id}` : '/')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{isEditMode ? 'Edit Pet' : 'Add New Pet'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="photo">Pet Photo</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center mb-2">
                    <Upload className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="name">Pet Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Pet name is required' })}
                placeholder="Enter pet name"
                className="mt-1"
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age (years) *</Label>
                <Input
                  id="age"
                  type="number"
                  {...register('age', { required: 'Age is required', min: 0 })}
                  placeholder="0"
                  className="mt-1"
                />
                {errors.age && <p className="text-sm text-destructive mt-1">{errors.age.message}</p>}
              </div>

              <div>
                <Label htmlFor="breed">Breed *</Label>
                <Input
                  id="breed"
                  {...register('breed', { required: 'Breed is required' })}
                  placeholder="Enter breed"
                  className="mt-1"
                />
                {errors.breed && <p className="text-sm text-destructive mt-1">{errors.breed.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="color">Color *</Label>
              <Input
                id="color"
                {...register('color', { required: 'Color is required' })}
                placeholder="Enter color"
                className="mt-1"
              />
              {errors.color && <p className="text-sm text-destructive mt-1">{errors.color.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight *</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    {...register('weight', { required: 'Weight is required', min: 0 })}
                    placeholder="0"
                    className="flex-1"
                  />
                  <Select value={weightUnit} onValueChange={(value) => setValue('weightUnit', value as 'kg' | 'lbs')}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.weight && <p className="text-sm text-destructive mt-1">{errors.weight.message}</p>}
              </div>

              <div>
                <Label htmlFor="height">Height *</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    {...register('height', { required: 'Height is required', min: 0 })}
                    placeholder="0"
                    className="flex-1"
                  />
                  <Select value={heightUnit} onValueChange={(value) => setValue('heightUnit', value as 'cm' | 'inches')}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="inches">inches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.height && <p className="text-sm text-destructive mt-1">{errors.height.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="healthNotes">Health Notes</Label>
              <Textarea
                id="healthNotes"
                {...register('healthNotes')}
                placeholder="Enter any health notes or special care instructions"
                className="mt-1 min-h-24"
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(isEditMode ? `/pets/${id}` : '/')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{isEditMode ? 'Update Pet' : 'Add Pet'}</>
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