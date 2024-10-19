import Pusher from 'pusher-js';

// Set up Pusher with the given APP_KEY, APP_CLUSTER, and authentication endpoint
const pusher = new Pusher(import.meta.env.VITE_PUBLIC_APP_KEY, {
    cluster: import.meta.env.VITE_PUBLIC_APP_CLUSTER,
    authEndpoint: import.meta.env.VITE_PUBLIC_APP_AUTH_ENDPOINT,
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    },
});

// Subscribe to the private channel
const channel = pusher.subscribe('private-aircall');

// Listen to the 'update-call' event
channel.bind('update-call', (data) => {
    console.log('Real-time call update:', data);
    // Handle the real-time update (e.g., update the UI)
});

export default pusher;
