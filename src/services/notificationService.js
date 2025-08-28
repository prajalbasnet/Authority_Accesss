const dummyNotifications = [
    {
        id: 'notif1',
        type: 'complaint_update',
        title: 'Complaint #12345 Updated',
        message: 'Your complaint "Road Potholes" has been marked as pending.',
        timestamp: '2025-08-28T10:30:00Z',
        read: false,
        link: '/citizen/my-complaints?id=12345'
    },
    {
        id: 'notif2',
        type: 'broadcast',
        title: 'Public Announcement: Water Supply',
        message: 'Scheduled water supply interruption in Ward 5 on 2025-08-30.',
        timestamp: '2025-08-27T15:00:00Z',
        read: false,
        link: '/public-feed'
    },
    {
        id: 'notif3',
        type: 'kyc_status',
        title: 'KYC Verification Complete',
        message: 'Your KYC verification has been successfully completed. You can now file complaints.',
        timestamp: '2025-08-26T09:00:00Z',
        read: true,
        link: '/citizen/profile'
    },
    {
        id: 'notif4',
        type: 'complaint_update',
        title: 'Complaint #67890 Solved',
        message: 'Your complaint "Streetlight Outage" has been marked as solved.',
        timestamp: '2025-08-25T18:00:00Z',
        read: true,
        link: '/citizen/my-complaints?id=67890'
    },
    {
        id: 'notif5',
        type: 'system_alert',
        title: 'System Maintenance',
        message: 'Our system will undergo maintenance on 2025-09-01 from 1 AM to 3 AM.',
        timestamp: '2025-08-24T20:00:00Z',
        read: false,
        link: '#'
    },
];

// Simulate fetching notifications from an API
export const fetchNotifications = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            // In a real app, you'd fetch from a backend and filter by user
            resolve(dummyNotifications);
        }, 500); // Simulate network delay
    });
};

// Simulate getting unread count
export const getUnreadCount = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            const unread = dummyNotifications.filter(notif => !notif.read).length;
            resolve(unread);
        }, 200); // Simulate network delay
    });
};

// Simulate marking a notification as read
export const markAsRead = async (notificationId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const notification = dummyNotifications.find(notif => notif.id === notificationId);
            if (notification) {
                notification.read = true;
                resolve({ success: true, message: `Notification ${notificationId} marked as read.` });
            } else {
                reject({ success: false, message: `Notification ${notificationId} not found.` });
            }
        }, 100); // Simulate network delay
    });
};

// Simulate marking all notifications as read
export const markAllAsRead = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            dummyNotifications.forEach(notif => {
                notif.read = true;
            });
            resolve({ success: true, message: 'All notifications marked as read.' });
        }, 200); // Simulate network delay
    });
};
