import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";

const PetBehavior: React.FC = () => {
  const { token } = useAuth();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>("");
  console.log("Pets:", pets);
  console.log("Selected Pet:", selectedPet);

  // Fetch pets on load
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/pets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setPets(data.pets || []);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
    };

    if (token) {
      fetchPets();
    }
  }, [token]);

  // Convert image to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setEmotion(null);
    }
  };

  // Handle prediction
  const handlePredict = async () => {
    if (!image) return;

    if (!selectedPet) {
      alert("Please select a pet first.");
      return;
    }

    setLoading(true);
    setEmotion(null);

    try {
      const base64Image = await convertToBase64(image);

      const response = await fetch(
        "http://localhost:3001/api/behavior/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            image: base64Image,
            
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      setEmotion(data.result.behavior);
    } catch (error) {
      console.error("Prediction failed:", error);
      setEmotion("Error analyzing image");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-10 p-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Dog Emotion Detector
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center gap-5">

              {/* Pet Selector */}
              <select
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                className="border p-2 rounded w-64"
              >
                <option value="">Select Pet</option>
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name}
                  </option>
                ))}
              </select>

              {/* Image Upload */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />

              {/* Preview */}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-64 h-64 object-cover rounded-xl shadow"
                />
              )}

              {/* Predict Button */}
              <Button
                onClick={handlePredict}
                disabled={!image || loading}
                className="px-6 py-2"
              >
                {loading ? "Analyzing..." : "Predict Emotion"}
              </Button>

              {/* Result */}
              {emotion && (
                <div className="mt-4 text-xl font-semibold text-green-600">
                  Emotion: {emotion.toUpperCase()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PetBehavior;
