import { useState } from "react";
import { reportLostPet } from "@/api/lostPets";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ReportLostPet() {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    description: "",
    lastSeenAddress: "",
    latitude: 0,
    longitude: 0,
    contactPhone: "",
    photo: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a FileReader to handle the image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file); // Convert the image to base64 format
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reportLostPet(formData);
      navigate("/lost-pets"); // Redirect to the Lost Pets page after submission
    } catch (error) {
      console.error("Failed to report lost pet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold mb-4">Report a Lost Pet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Pet Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="text"
            name="breed"
            placeholder="Breed"
            value={formData.breed}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="text"
            name="lastSeenAddress"
            placeholder="Last Seen Address"
            value={formData.lastSeenAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <input
            type="text"
            name="contactPhone"
            placeholder="Contact Phone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="file"
            name="photo"
            placeholder="Upload a Photo"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {formData.photo && (
          <div className="mt-2">
            <img
              src={formData.photo}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
        <div className="flex gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/lost-pets")}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Submitting..." : "Report Lost Pet"}
          </Button>
        </div>
      </form>
    </div>
  );
}