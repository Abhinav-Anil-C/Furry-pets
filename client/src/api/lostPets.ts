import  api  from "./api";

export const getLostPets = async () => {
  const response = await api.get("api/lostpets");
  return response.data;
};

export const createLostPet = async (data: any) => {
  const response = await api.post("api/lostpets", data);
  return response.data;
};

export const deleteLostPet = async (id: string) => {
  const response = await api.delete(`api/lostpets/${id}`);
  return response.data;
};
