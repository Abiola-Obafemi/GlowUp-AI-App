export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }
  
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      scheduleDailyNotification();
    }
};

const scheduleDailyNotification = () => {
    const now = new Date();
    const todayKey = now.toISOString().split('T')[0];
    const lastNotificationDate = localStorage.getItem('lastNotificationDate');

    // Only show notification if it's a new day
    if (lastNotificationDate !== todayKey) {
        // In a real app, this would be handled by a server push.
        // We simulate it locally for demonstration.
        setTimeout(() => {
            showLocalNotification();
            localStorage.setItem('lastNotificationDate', todayKey);
        }, 5000); // Show 5 seconds after permission is granted for the first time
    }
};

const showLocalNotification = () => {
    if (Notification.permission === 'granted' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('✨ Your Daily Glow-Up Reminder!', {
                body: "Don't forget to check your plan and log your progress today!",
                icon: '/logo.svg', 
            });
        });
    }
};