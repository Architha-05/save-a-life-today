
import { useState, useEffect } from 'react';
import { useNotifications } from './useNotifications';

export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterType: 'recipient' | 'hospital';
  bloodType: string;
  unitsNeeded: number;
  urgency: 'Critical' | 'Urgent' | 'Normal';
  hospitalName?: string;
  description?: string;
  status: 'Active' | 'Fulfilled' | 'Cancelled';
  createdAt: string;
  location?: string;
}

export interface DonationAppointment {
  id: string;
  donorId: string;
  donorName: string;
  bloodType: string;
  hospitalId?: string;
  hospitalName?: string;
  bloodBankId?: string;
  bloodBankName?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export const useDataManager = () => {
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [appointments, setAppointments] = useState<DonationAppointment[]>([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Load data from localStorage
    const storedRequests = localStorage.getItem('bloodRequests');
    const storedAppointments = localStorage.getItem('appointments');
    
    if (storedRequests) setBloodRequests(JSON.parse(storedRequests));
    if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
  }, []);

  const createBloodRequest = (request: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: BloodRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'Active'
    };

    setBloodRequests(prev => {
      const updated = [newRequest, ...prev];
      localStorage.setItem('bloodRequests', JSON.stringify(updated));
      return updated;
    });

    // Notify all relevant parties
    addNotification({
      type: 'blood_request',
      title: 'New Blood Request',
      message: `${request.requesterName} needs ${request.unitsNeeded} units of ${request.bloodType} blood`,
      from: request.requesterName,
      data: newRequest
    });

    return newRequest;
  };

  const scheduleAppointment = (appointment: Omit<DonationAppointment, 'id' | 'createdAt' | 'status'>) => {
    const newAppointment: DonationAppointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'Scheduled'
    };

    setAppointments(prev => {
      const updated = [newAppointment, ...prev];
      localStorage.setItem('appointments', JSON.stringify(updated));
      return updated;
    });

    // Notify relevant parties
    addNotification({
      type: 'donation_scheduled',
      title: 'Donation Scheduled',
      message: `${appointment.donorName} scheduled a ${appointment.bloodType} donation`,
      from: appointment.donorName,
      data: newAppointment
    });

    return newAppointment;
  };

  const updateRequestStatus = (id: string, status: BloodRequest['status']) => {
    setBloodRequests(prev => {
      const updated = prev.map(req => req.id === id ? { ...req, status } : req);
      localStorage.setItem('bloodRequests', JSON.stringify(updated));
      return updated;
    });
  };

  const updateAppointmentStatus = (id: string, status: DonationAppointment['status']) => {
    setAppointments(prev => {
      const updated = prev.map(apt => apt.id === id ? { ...apt, status } : apt);
      localStorage.setItem('appointments', JSON.stringify(updated));
      return updated;
    });
  };

  return {
    bloodRequests,
    appointments,
    createBloodRequest,
    scheduleAppointment,
    updateRequestStatus,
    updateAppointmentStatus
  };
};
