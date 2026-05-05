import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Loader2, Upload } from 'lucide-react';
import { propertyTypeLabels } from '@/lib/subscriptionUtils';
import { toast } from 'sonner';

export default function PropertyFormModal({ property, onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState({
    title: property?.title || '',
    description: property?.description || '',
    property_type: property?.property_type || 'apartment',
    listing_type: property?.listing_type || 'sale',
    category: property?.category || 'residential',
    city: property?.city || 'רכסים',
    neighborhood: property?.neighborhood || '',
    address: property?.address || '',
    price: property?.price || '',
    rooms: property?.rooms || '',
    size_sqm: property?.size_sqm || '',
    floor: property?.floor || '',
    total_floors: property?.total_floors || '',
    contact_name: property?.contact_name || '',
    contact_phone: property?.contact_phone || '',
    contact_email: property?.contact_email || '',
    status: property?.status || 'active',
    featured: property?.featured || false,
    parking: property?.parking || false,
    elevator: property?.elevator || false,
    air_conditioning: property?.air_conditioning || false,
    furnished: property?.furnished || false,
    storage: property?.storage || false,
    mamad: property?.mamad || false,
    renovated: property?.renovated || false,
    images: property?.images || [],
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    set('images', [...form.images, ...urls]);
    setImageUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.contact_phone || !form.price || !form.rooms) {
      toast.error('אנא מלאו שדות חובה');
      return;
    }
    setLoading(true);
    const data = {
      ...form,
      price: Number(form.price),
      rooms: Number(form.rooms),
      floor: form.floor ? Number(form.floor) : undefined,
      total_floors: form.total_floors ? Number(form.total_floors) : undefined,
      size_sqm: form.size_sqm ? Number(form.size_sqm) : undefined,
    };
 
