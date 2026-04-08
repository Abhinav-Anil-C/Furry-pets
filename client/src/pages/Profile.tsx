// import { useEffect, useState, useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { User, MapPin, Mail, Calendar, Upload, Loader2 } from 'lucide-react';
// import { getProfile, updateProfile, UpdateProfileData } from '@/api/profile';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useToast } from '@/hooks/useToast';
// import { BottomNav } from '@/components/BottomNav';
// import { LoadingSpinner } from '@/components/LoadingSpinner';
// import { format } from 'date-fns';

// export function Profile() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const { toast } = useToast();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<UpdateProfileData>();

//   const [profileData, setProfileData] = useState<{
//     name: string;
//     email: string;
//     location: string;
//     photo: string;
//     memberSince: string;
//   } | null>(null);

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   const loadProfile = useCallback(async () => {
//     try {
//       console.log('Loading user profile...');
//       const response = await getProfile();
//       setProfileData(response.profile);
//       setValue('name', response.profile.name);
//       setValue('location', response.profile.location);
//       setValue('photo', response.profile.photo);
//       setImagePreview(response.profile.photo);
//       console.log('Profile loaded');
//     } catch (error: unknown) {
//       console.error('Error loading profile:', error);
//       toast({
//         title: 'Error',
//         description: error instanceof Error ? error.message : 'An error occurred',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [setValue, toast]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const result = reader.result as string;
//         setImagePreview(result);
//         setValue('photo', result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onSubmit = async (data: UpdateProfileData) => {
//     setSaving(true);
//     try {
//       console.log('Updating profile...');
//       const response = await updateProfile(data);
//       setProfileData(response.profile);
//       setEditing(false);
//       toast({
//         title: 'Success',
//         description: response.message,
//       });
//       console.log('Profile updated successfully');
//     } catch (error: unknown) {
//       console.error('Error updating profile:', error);
//       toast({
//         title: 'Error',
//         description: error instanceof Error ? error.message : 'An error occurred',
//         variant: 'destructive',
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="pb-20">
//         <LoadingSpinner message="Loading profile..." />
//         <BottomNav />
//       </div>
//     );
//   }

//   return (
//     <div className="pb-20">
//       <div className="max-w-2xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
//             My Profile
//           </h1>
//           <p className="text-muted-foreground mt-1">Manage your account information</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <CardTitle>Profile Information</CardTitle>
//               {!editing && (
//                 <Button onClick={() => setEditing(true)} variant="outline">
//                   Edit Profile
//                 </Button>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent>
//             {!editing ? (
//               <div className="space-y-6">
//                 <div className="flex items-center gap-6">
//                   <div className="relative">
//                     <img
//                       src={profileData.photo}
//                       alt={profileData.name}
//                       className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
//                     />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold">{profileData.name}</h2>
//                     <p className="text-muted-foreground">Pet Owner</p>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
//                     <Mail className="h-5 w-5 text-primary" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Email</p>
//                       <p className="font-medium">{profileData.email}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
//                     <MapPin className="h-5 w-5 text-primary" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Location</p>
//                       <p className="font-medium">{profileData.location}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
//                     <Calendar className="h-5 w-5 text-primary" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Member Since</p>
//                       <p className="font-medium">{format(new Date(profileData.memberSince), 'MMMM d, yyyy')}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 <div>
//                   <Label>Profile Photo</Label>
//                   <div className="mt-2 flex items-center gap-4">
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
//                     />
//                     <Button type="button" variant="outline" asChild>
//                       <label className="cursor-pointer">
//                         <Upload className="h-4 w-4 mr-2" />
//                         Change Photo
//                         <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//                       </label>
//                     </Button>
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="name">Full Name *</Label>
//                   <Input
//                     id="name"
//                     {...register('name', { required: 'Name is required' })}
//                     placeholder="Enter your name"
//                     className="mt-1"
//                   />
//                   {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="location">Location</Label>
//                   <Input
//                     id="location"
//                     {...register('location')}
//                     placeholder="Enter your location"
//                     className="mt-1"
//                   />
//                 </div>

//                 <div className="flex gap-3">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       setEditing(false);
//                       setValue('name', profileData.name);
//                       setValue('location', profileData.location);
//                       setValue('photo', profileData.photo);
//                       setImagePreview(profileData.photo);
//                     }}
//                     className="flex-1"
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={saving} className="flex-1">
//                     {saving ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Saving...
//                       </>
//                     ) : (
//                       'Save Changes'
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <BottomNav />
//     </div>
//   );
// }


// import { useEffect, useState, useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { User, MapPin, Mail, Calendar, Upload, Loader2, Phone } from 'lucide-react';
// import { getProfile, updateProfile, UpdateProfileData } from '@/api/profile';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useToast } from '@/hooks/useToast';
// import { BottomNav } from '@/components/BottomNav';
// import { LoadingSpinner } from '@/components/LoadingSpinner';
// import { format } from 'date-fns';

// export function Profile() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const { toast } = useToast();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<UpdateProfileData>();

//   const [profileData, setProfileData] = useState<{
//     name: string;
//     email: string;
//     location: string;
//     phone: string;  // Added phone data
//     photo: string;
//     memberSince: string;
//   } | null>(null);

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   const loadProfile = useCallback(async () => {
//     try {
//       console.log('Loading user profile...');
//       const response = await getProfile();
//       setProfileData(response.profile);
//       setValue('name', response.profile.name);
//       setValue('location', response.profile.location);
//       setValue('phone', response.profile.phone);  // Set phone in form
//       setValue('photo', response.profile.photo);
//       setImagePreview(response.profile.photo);
//       console.log('Profile loaded');
//     } catch (error: unknown) {
//       console.error('Error loading profile:', error);
//       toast({
//         title: 'Error',
//         description: error instanceof Error ? error.message : 'An error occurred',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [setValue, toast]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const result = reader.result as string;
//         setImagePreview(result);
//         setValue('photo', result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Get current location
//   const getCurrentLocation = async () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (pos) => {
//           const lat = pos.coords.latitude;
//           const lng = pos.coords.longitude;
//           try {
//             const res = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//             );
//             const data = await res.json();
//             setValue('location', data.display_name || 'Current Location');
//             toast({
//               title: 'Location detected',
//               description: `Location: ${data.display_name}`,
//             });
//           } catch (error) {
//             toast({
//               title: 'Location error',
//               description: 'Unable to fetch location details',
//               variant: 'destructive',
//             });
//           }
//         },
//         () => {
//           toast({
//             title: 'Location error',
//             description: 'Please allow location access',
//             variant: 'destructive',
//           });
//         }
//       );
//     } else {
//       toast({
//         title: 'Location error',
//         description: 'Geolocation is not supported by this browser',
//         variant: 'destructive',
//       });
//     }
//   };

//   const onSubmit = async (data: UpdateProfileData) => {
//     setSaving(true);
//     try {
//       console.log('Updating profile...');
//       const response = await updateProfile(data);
//       setProfileData(response.profile);
//       setEditing(false);
//       toast({
//         title: 'Success',
//         description: response.message,
//       });
//       console.log('Profile updated successfully');
//     } catch (error: unknown) {
//       console.error('Error updating profile:', error);
//       toast({
//         title: 'Error',
//         description: error instanceof Error ? error.message : 'An error occurred',
//         variant: 'destructive',
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="pb-20">
//         <LoadingSpinner message="Loading profile..." />
//         <BottomNav />
//       </div>
//     );
//   }

//   return (
//     <div className="pb-20">
//       <div className="max-w-2xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
//             My Profile
//           </h1>
//           <p className="text-muted-foreground mt-1">Manage your account information</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <CardTitle>Profile Information</CardTitle>
//               {!editing && (
//                 <Button onClick={() => setEditing(true)} variant="outline">
//                   Edit Profile
//                 </Button>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent>
//             {!editing ? (
//               <div className="space-y-6">
//                 <div className="flex items-center gap-6">
//                   <div className="relative">
//                     <img
//                       src={profileData.photo}
//                       alt={profileData.name}
//                       className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
//                     />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold">{profileData.name}</h2>
//                     <p className="text-muted-foreground">Pet Owner</p>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
//                     <Mail className="h-5 w-5 text-primary" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Email</p>
//                       <p className="font-medium">{profileData.email}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
//                     <MapPin className="h-5 w-5 text-primary" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Location</p>
//                       <p className="font-medium">{profileData.location}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
//                     <Phone className="h-5 w-5 text-primary" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Phone</p>
//                       <p className="font-medium">{profileData.phone}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
//                     <Calendar className="h-5 w-5 text-primary" />
//                     <div>
//                       <p className="text-sm text-muted-foreground">Member Since</p>
//                       <p className="font-medium">{format(new Date(profileData.memberSince), 'MMMM d, yyyy')}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 <div>
//                   <Label>Profile Photo</Label>
//                   <div className="mt-2 flex items-center gap-4">
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
//                     />
//                     <Button type="button" variant="outline" asChild>
//                       <label className="cursor-pointer">
//                         <Upload className="h-4 w-4 mr-2" />
//                         Change Photo
//                         <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//                       </label>
//                     </Button>
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="name">Full Name *</Label>
//                   <Input
//                     id="name"
//                     {...register('name', { required: 'Name is required' })}
//                     placeholder="Enter your name"
//                     className="mt-1"
//                   />
//                   {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="location">Location</Label>
//                   <Input
//                     id="location"
//                     {...register('location')}
//                     placeholder="Enter your location"
//                     className="mt-1"
//                   />
//                   <Button type="button" variant="outline" onClick={getCurrentLocation}>
//                     Use Current Location
//                   </Button>
//                 </div>

//                 <div>
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <Input
//                     id="phone"
//                     {...register('phone', { required: 'Phone number is required' })}
//                     placeholder="Enter your phone number"
//                     className="mt-1"
//                   />
//                   {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
//                 </div>

//                 <div className="flex gap-3">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       setEditing(false);
//                       setValue('name', profileData.name);
//                       setValue('location', profileData.location);
//                       setValue('phone', profileData.phone);
//                       setValue('photo', profileData.photo);
//                       setImagePreview(profileData.photo);
//                     }}
//                     className="flex-1"
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={saving} className="flex-1">
//                     {saving ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Saving...
//                       </>
//                     ) : (
//                       'Save Changes'
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <BottomNav />
//     </div>
//   );
// }





































import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { User, MapPin, Mail, Calendar, Upload, Loader2, Phone } from 'lucide-react';
import { getProfile, updateProfile, UpdateProfileData } from '@/api/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { format } from 'date-fns';

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileData>();

  const [profileData, setProfileData] = useState<{
    name: string;
    email: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    phone: string;
    photo: string;
    memberSince: string;
  } | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      console.log('Loading user profile...');
      const response = await getProfile();
      setProfileData(response.profile);
      setValue('name', response.profile.name);
      setValue('location', response.profile.location);
      setValue('phone', response.profile.phone);
      setValue('photo', response.profile.photo);
      setValue('latitude', response.profile.latitude);
      setValue('longitude', response.profile.longitude);
      setImagePreview(response.profile.photo);
      console.log('Profile loaded');
    } catch (error: unknown) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [setValue, toast]);

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

  // Get current location and update profile with coordinates
  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            setValue('location', data.display_name || 'Current Location');
            setValue('latitude', lat);
            setValue('longitude', lng);
            toast({
              title: 'Location detected',
              description: `Location: ${data.display_name}`,
            });
          } catch (error) {
            toast({
              title: 'Location error',
              description: 'Unable to fetch location details',
              variant: 'destructive',
            });
          }
        },
        () => {
          toast({
            title: 'Location error',
            description: 'Please allow location access',
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: 'Location error',
        description: 'Geolocation is not supported by this browser',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: UpdateProfileData) => {
    setSaving(true);
    try {
      console.log('Updating profile...');
      const response = await updateProfile(data);
      setProfileData(response.profile);
      setEditing(false);
      toast({
        title: 'Success',
        description: response.message,
      });
      console.log('Profile updated successfully');
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pb-20">
        <LoadingSpinner message="Loading profile..." />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account information</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Profile Information</CardTitle>
              {!editing && (
                <Button onClick={() => setEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!editing ? (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={profileData.photo}
                      alt={profileData.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{profileData.name}</h2>
                    <p className="text-muted-foreground">Pet Owner</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{profileData.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{profileData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{format(new Date(profileData.memberSince), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label>Profile Photo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                    />
                    <Button type="button" variant="outline" asChild>
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Change Photo
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Enter your name"
                    className="mt-1"
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="Enter your location"
                    className="mt-1"
                  />
                  <Button type="button" variant="outline" onClick={getCurrentLocation}>
                    Use Current Location
                  </Button>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register('phone', { required: 'Phone number is required' })}
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setValue('name', profileData.name);
                      setValue('location', profileData.location);
                      setValue('phone', profileData.phone);
                      setValue('photo', profileData.photo);
                      setImagePreview(profileData.photo);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
















