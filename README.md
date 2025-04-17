Important Note on Backend Loading Times:

Please be aware that the backend infrastructure supporting this application might be hosted on a free tier service (such as Render, Heroku free dynos, etc.). These free services often "sleep" or spin down after a period of inactivity to conserve resources.

What this means: If the application hasn't been accessed recently, the very first request to the backend might take significantly longer than usual (potentially 30-60 seconds) while the service wakes up. Subsequent requests will be much faster once the service is active. Please be patient on the initial load!

