<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Admin Login</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">
  <div class="w-full max-w-sm bg-white p-6 rounded shadow">
    <h1 class="text-2xl font-semibold mb-4">Admin Login</h1>
    <div id="alert" class="hidden mb-3 text-sm text-red-600"></div>
    <label class="block mb-2 text-sm">Email</label>
    <input id="email" class="w-full mb-3 px-3 py-2 border rounded" type="email" value="admin@test.com">
    <label class="block mb-2 text-sm">Password</label>
    <input id="password" class="w-full mb-4 px-3 py-2 border rounded" type="password" value="1234">
    <button id="loginBtn" class="w-full bg-blue-600 text-white py-2 rounded">Login</button>
  </div>

  <script>
    const loginBtn = document.getElementById('loginBtn');
    const alertBox = document.getElementById('alert');

    loginBtn.addEventListener('click', async () => {
      alertBox.classList.add('hidden');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/v1/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');

        // store token in localStorage (simple approach for demo)
        localStorage.setItem('admin_token', data.data.token);
        location.href = '/admin/dashboard';
      } catch (err) {
        alertBox.textContent = err.message;
        alertBox.classList.remove('hidden');
      }
    });
  </script>
</body>
</html>
