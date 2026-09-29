async function seed() {
  try {
    const res = await fetch('http://localhost:5000/api/users/directors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: "System Admin",
        username: "admin",
        password: "password123",
        email: "admin@srs.com",
        role: "director"
      })
    });
    const data = await res.json();
    console.log("Admin creation response:", data);
  } catch (err) {
    console.error("Error creating admin:", err);
  }
}

seed();
