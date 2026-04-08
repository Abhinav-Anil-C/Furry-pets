import { Pet } from '@/types/pet';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PetCardProps {
  pet: Pet;
  onDelete: (id: string) => void;
}

export function PetCard({ pet, onDelete }: PetCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
      <div onClick={() => navigate(`/pets/${pet._id}`)}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={pet.photo}
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h3 className="absolute bottom-3 left-3 text-white font-bold text-xl">{pet.name}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Breed:</span> {pet.breed}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Age:</span> {pet.age} years
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Weight:</span> {pet.weight} {pet.weightUnit}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/pets/${pet._id}/edit`);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(pet._id);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}