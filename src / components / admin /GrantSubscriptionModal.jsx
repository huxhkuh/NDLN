import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function GrantSubscriptionModal({ onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('monthly');

  const planLabels = { monthly: 'חודשי (30 יום)', quarterly: 'רבעוני (90 יום)', yearly: 'שנתי (365 יום)' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('הכנס אימייל'); return; }
    setLoading(true);
    const now = new Date();
    let endDate = new Date();
    if (plan === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
    else if (plan === 'quarterly') endDate.setMonth(endDate.getMonth() + 3);
    else endDate.setFullYear(endDate.getFullYear() + 1);

    await base44.entities.Subscription.create({
      user_email: email,
      plan,
      status: 'active',
      start_date: now.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      amount_paid: 0,
      payment_reference: 'manual_grant',
    });
    setLoading(false);
    toast.success('מנוי הוענק בהצלחה');
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-bold text-lg">הענקת מנוי ידני</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <Label>אימייל משתמש *</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="user@email.com" type="email" />
          </div>
          <div>
            <Label>סוג מנוי</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(planLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>ביטול</Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 ml-1 animate-spin" />}
              הענק מנוי
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
