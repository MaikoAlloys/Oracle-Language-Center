<template>
  <div class="login-container">
    <h2>Admin Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="username" placeholder="Enter Username" required />
      <input type="password" v-model="password" placeholder="Enter Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

// Reactive state
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

// Login Function
const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:5000/admin/login", {
      name: username.value,
      password: password.value,
    });

    // Store the token
    localStorage.setItem("adminToken", response.data.token);
    
    // Redirect to dashboard
    router.push("/");
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Login failed";
  }
};
</script>

<style>
.login-container {
  width: 300px;
  margin: 100px auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}
button {
  background: #007bff;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  cursor: pointer;
}
.error {
  color: red;
}
</style>
