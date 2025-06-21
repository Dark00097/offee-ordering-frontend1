import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'https://coffee-ordering-backend1-production.up.railway.app', {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export const initSocket = (
  onOrderCreated = () => {},
  onOrderUpdated = () => {},
  onOrderApproved = () => {},
  onOrderDeleted = () => {},
  onReservationCreated = () => {},
  onReservationUpdated = () => {},
  onNotification = () => {}
) => {
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('sessionId');
    if (token) {
      socket.emit('join-session', { token });
    } else if (sessionId) {
      socket.emit('join-session', sessionId);
    }
  });

  socket.on('order-created', (data) => {
    console.log('Received order-created:', data);
    if (typeof onOrderCreated === 'function') onOrderCreated(data);
  });

  socket.on('order-updated', (data) => {
    console.log('Received order-updated:', data);
    if (typeof onOrderUpdated === 'function') onOrderUpdated(data);
  });

  socket.on('order-approved', (data) => {
    console.log('Received order-approved:', data);
    if (typeof onOrderApproved === 'function') onOrderApproved(data);
  });

  socket.on('order-deleted', (data) => {
    console.log('Received order-deleted:', data);
    if (typeof onOrderDeleted === 'function') onOrderDeleted(data);
  });

  socket.on('reservation-created', (data) => {
    console.log('Received reservation-created:', data);
    if (typeof onReservationCreated === 'function') onReservationCreated(data);
  });

  socket.on('reservation-updated', (data) => {
    console.log('Received reservation-updated:', data);
    if (typeof onReservationUpdated === 'function') onReservationUpdated(data);
  });

  socket.on('notification', (data) => {
    console.log('Received notification:', data);
    if (typeof onNotification === 'function') onNotification(data);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  return () => {
    socket.off('order-created', onOrderCreated);
    socket.off('order-updated', onOrderUpdated);
    socket.off('order-approved', onOrderApproved);
    socket.off('order-deleted', onOrderDeleted);
    socket.off('reservation-created', onReservationCreated);
    socket.off('reservation-updated', onReservationUpdated);
    socket.off('notification', onNotification);
    socket.disconnect();
    console.log('Socket listeners removed');
  };
};

export default socket;