<template>
  <aside class="sidebar">
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
</template>

<script>
export default {
  data() {
    return { showStudents: false };
  },
  methods: {
    toggleSubmenu() {
      this.showStudents = !this.showStudents;
    }
  }
};
</script>

<style>
.sidebar {
  width: 250px;
  background: #222;
  color: white;
  padding: 20px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 60px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar ul li {
  padding: 10px;
}
.sidebar a {
  color: white;
  text-decoration: none;
}
</style>
