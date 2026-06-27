const authService = require("./services/auth.services");

async function run() {
  try {
    const user = await authService.register({
      name: "Desh",
      email: "desh@example.com",
      password: "password123",
    });

    console.log("User Created:");
    console.log(user);
  } catch (error) {
    console.error("Error:");
console.error(error);  }
}

run();