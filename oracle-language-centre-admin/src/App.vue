<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

// Navigation State
const showStudents = ref(false);
const toggleSubmenu = () => {
  showStudents.value = !showStudents.value;
};

// Vue Router
const router = useRouter();
const route = useRoute();

// Authentication Check
const isAuthenticated = computed(() => !!localStorage.getItem("adminToken"));

// Check if on Login Page
const isLoginPage = computed(() => route.path === "/admin-login");

// Redirect to login if not authenticated
onMounted(() => {
  if (!isAuthenticated.value && !isLoginPage.value) {
    router.push("/admin-login");
  }
});

// Logout Function
const handleLogout = () => {
  localStorage.removeItem("adminToken");
  router.push("/admin-login");
};

// Search Functionality
const searchQuery = ref("");
const filteredItems = ref([]); // To store filtered items

// Sample data for demonstration (replace with your actual data)
const items = ref([
  { id: 1, name: "Student 1", status: "pending" },
  { id: 2, name: "Student 2", status: "approved" },
  { id: 3, name: "Tutor 1", status: "active" },
  { id: 4, name: "Finance Record 1", status: "paid" },
]);

// Watch for changes in searchQuery and filter items
watch(searchQuery, (newQuery) => {
  if (newQuery.trim() !== "") {
    filteredItems.value = items.value.filter((item) =>
      item.name.toLowerCase().includes(newQuery.toLowerCase())
    );
  } else {
    filteredItems.value = []; // Clear filtered items if search query is empty
  }
});
</script>

<template>
  <div>
    <!-- Show Sidebar & Topbar ONLY if logged in and NOT on login page -->
    <template v-if="isAuthenticated && !isLoginPage">
      <!-- Top Bar -->
      <header class="topbar">
        <h2>Admin Panel</h2>
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search..."
            class="search-box"
          />
        </div>
        <button class="logout-button" @click="handleLogout">Logout</button>
      </header>

      <div class="container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
          <h2>Navigation</h2>
          <ul>
            <li @click="toggleSubmenu">
              Students
              <ul v-if="showStudents">
                <li><router-link to="/students?status=pending">Pending Approval</router-link></li>
                <li><router-link to="/students?status=approved">Approved Students</router-link></li>
                <li><router-link to="/students?status=total">Total Students</router-link></li>
              </ul>
            </li>
            <li><router-link to="/tutors">Tutors</router-link></li>
            <li><router-link to="/finance">Finance</router-link></li>
            <li><router-link to="/suppliers">Suppliers</router-link></li>
            <li><router-link to="/supplier-management">Supplier Management</router-link></li>
            <li><router-link to="/fee-management">Fee Management</router-link></li>
          </ul>
        </aside>

        <!-- Main Content -->
        <main class="content">
          <!-- Display filtered items -->
          <div v-if="searchQuery.trim() !== ''">
            <h3>Search Results</h3>
            <ul>
              <li v-for="item in filteredItems" :key="item.id">
                {{ item.name }} - {{ item.status }}
              </li>
            </ul>
          </div>

          <!-- Default Router View -->
          <router-view v-else></router-view>
        </main>
      </div>
    </template>

    <!-- Show Only Login Page if Not Authenticated -->
    <router-view v-else></router-view>
  </div>
</template>

<style scoped>
/* Top Bar */
.topbar {
  background: #333;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1000;
}

.search-container {
  margin-left: auto; /* Moves it slightly to the left */
  margin-right: 20px; /* Adjust this value as needed */
}


.search-box {
  padding: 5px;
  width: 200px;
  border-radius: 5px;
  border: none;
  margin-right: 5px;
}

.logout-button {
  background: red;
  color: white;
  padding: 5px 10px; /* Adjusted padding */
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 12px;
  width: auto; /* Ensure it takes only required width */
  display: inline-block; /* Prevents stretching */
  text-align: center; /* Centers text properly */
}

/* Layout */
.container {
  display: flex;
  height: 100vh;
  margin-top: 60px; /* Adjust for fixed top bar */
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #222;
  color: white;
  padding: 20px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 60px; /* Below the top bar */
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  padding: 10px;
  cursor: pointer;
}

.sidebar ul li ul {
  margin-left: 20px;
}

.sidebar a {
  color: white;
  text-decoration: none;
}

/* Main Content */
.content {
  flex-grow: 1;
  padding: 20px;
  margin-left: 260px; /* Ensure content moves right */
}

/* Search Results */
.content ul {
  list-style: none;
  padding: 0;
}

.content ul li {
  padding: 5px;
  background: #f0f0f0;
  margin-bottom: 5px;
  border-radius: 5px;
}
</style>