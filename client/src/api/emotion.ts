export async function predictEmotion(
  imageFile: File,
  petId: string,
  token: string
): Promise<string> {

  const base64 = await convertToBase64(imageFile);

  const response = await fetch("http://localhost:3001/api/behavior/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      image: base64,
      petId
    })
  });

  if (!response.ok) {
    throw new Error("Prediction failed");
  }

  const data = await response.json();
  return data.result.behavior;
}


function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
