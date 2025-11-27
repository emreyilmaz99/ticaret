<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Admin Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
  <nav class="bg-white shadow px-6 py-4">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <div class="text-lg font-semibold">Admin Dashboard</div>
      <div>
        <button id="logout" class="text-sm text-red-600">Logout</button>
      </div>
    </div>
  </nav>

  <main class="max-w-6xl mx-auto p-6">
    <section class="mb-6">
      <h2 class="text-xl font-medium">Welcome, <span id="adminName">...</span></h2>
      <p class="text-sm text-gray-600" id="adminEmail"></p>
    </section>

    <section>
      <h3 class="text-lg font-medium mb-3">Users</h3>
      <div id="usersList">Loading...</div>
    </section>
  </main>

  <script>
    function getToken() { return localStorage.getItem('admin_token'); }

    async function fetchMe() {
      const token = getToken();
      if (!token) { location.href = '/admin/login'; return; }

      const res = await fetch('/api/v1/admin/me', { headers: { 'Authorization': 'Bearer ' + token } });
      if (res.status === 401 || res.status === 403) { location.href = '/admin/login'; return; }
      const json = await res.json();
      if (!res.ok) { console.error(json); return; }
      document.getElementById('adminName').textContent = json.data.name;
      document.getElementById('adminEmail').textContent = json.data.email;
    }

    async function fetchUsers() {
      const token = getToken();
      const res = await fetch('/api/v1/admin/users?per_page=10', { headers: { 'Authorization': 'Bearer ' + token } });
      const json = await res.json();
      const container = document.getElementById('usersList');
      if (!res.ok) { container.textContent = 'Could not load users'; return; }

      const items = json.data?.data ?? [];
      if (!items.length) { container.textContent = 'No users'; return; }

      const ul = document.createElement('ul');
      ul.className = 'space-y-2';
      items.forEach(u => {
        const li = document.createElement('li');
        li.className = 'p-3 bg-white rounded shadow-sm flex justify-between';
        li.innerHTML = `<div><div class="font-medium">${u.name}</div><div class="text-sm text-gray-500">${u.email}</div></div>`;
        ul.appendChild(li);
      });
      container.innerHTML = '';
      container.appendChild(ul);
    }

    document.getElementById('logout').addEventListener('click', () => { localStorage.removeItem('admin_token'); location.href = '/admin/login'; });

    (async () => { await fetchMe(); await fetchUsers(); })();
  </script>
</body>
</html>
