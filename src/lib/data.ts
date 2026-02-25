export type User = {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'responder' | 'hospital_staff' | 'admin';
  avatarUrl: string;
  status?: 'active' | 'inactive';
};

export type Alert = {
  id: string;
  patientName: string;
  location: string;
  timestamp: string;
  status: 'pending' | 'dispatched' | 'on-site' | 'transporting' | 'resolved';
  responderName?: string;
  details: string;
  priority: 'high' | 'medium' | 'low';
};

export const users: User[] = [
  { id: 'usr_1', name: 'John Doe', email: 'patient@setu.com', role: 'patient', avatarUrl: 'https://picsum.photos/seed/user1/40/40', status: 'active' },
  { id: 'usr_2', name: 'Jane Smith', email: 'responder@setu.com', role: 'responder', avatarUrl: 'https://picsum.photos/seed/user2/40/40', status: 'active' },
  { id: 'usr_3', name: 'Dr. Emily Brown', email: 'hospital@setu.com', role: 'hospital_staff', avatarUrl: 'https://picsum.photos/seed/user3/40/40', status: 'active' },
  { id: 'usr_4', name: 'Admin User', email: 'admin@setu.com', role: 'admin', avatarUrl: 'https://picsum.photos/seed/user4/40/40', status: 'active' },
  { id: 'usr_5', name: 'Michael Johnson', email: 'patient2@setu.com', role: 'patient', avatarUrl: 'https://picsum.photos/seed/user5/40/40', status: 'active' },
  { id: 'usr_6', name: 'Sarah Williams', email: 'responder2@setu.com', role: 'responder', avatarUrl: 'https://picsum.photos/seed/user6/40/40', status: 'inactive' },
  { id: 'usr_7', name: 'David Jones', email: 'hospital2@setu.com', role: 'hospital_staff', avatarUrl: 'https://picsum.photos/seed/user7/40/40', status: 'active' }
];

export const alerts: Alert[] = [
  { id: 'alert_1', patientName: 'John Doe', location: '123 Main St, Anytown', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), status: 'dispatched', responderName: 'Jane Smith', details: 'Patient reports shortness of breath and chest pain.', priority: 'high' },
  { id: 'alert_2', patientName: 'Michael Johnson', location: '456 Oak Ave, Anytown', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), status: 'pending', details: 'Fall detected from IoT device.', priority: 'high' },
  { id: 'alert_3', patientName: 'Alice Williams', location: '789 Pine Ln, Anytown', timestamp: new Date(Date.now() - 35 * 60000).toISOString(), status: 'on-site', responderName: 'Sarah Williams', details: 'Minor cut, requires stitches.', priority: 'medium' },
  { id: 'alert_4', patientName: 'Robert Brown', location: '101 Maple Dr, Anytown', timestamp: new Date(Date.now() - 62 * 60000).toISOString(), status: 'transporting', responderName: 'Jane Smith', details: 'Suspected cardiac arrest.', priority: 'high' },
  { id: 'alert_5', patientName: 'Jessica Davis', location: '212 Birch Rd, Anytown', timestamp: new Date(Date.now() - 120 * 60000).toISOString(), status: 'resolved', responderName: 'Sarah Williams', details: 'Resolved: false alarm.', priority: 'low' },
];
