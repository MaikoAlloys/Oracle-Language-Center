<template>
  <div>
    <h2>Students</h2>
    <p v-if="status === 'pending'">Showing students pending approval...</p>
    <p v-if="status === 'approved'">Showing approved students...</p>
    <p v-if="status === 'total'">Showing all students...</p>

    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
          <th v-if="status === 'pending'">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.username }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.phone }}</td>
          <td>{{ student.is_approved ? "Approved" : "Pending" }}</td>
          <td v-if="status === 'pending'">
            <button @click="approveStudent(student.id)">Approve</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return { students: [], status: this.$route.query.status || "total" };
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await axios.get(`http://localhost:5000/admin/students?status=${this.status}`);
        this.students = response.data;
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },
    async approveStudent(id) {
      try {
        await axios.put(`http://localhost:5000/admin/students/${id}/approve`);
        this.fetchStudents(); // Refresh the list after approval
      } catch (error) {
        console.error("Error approving student:", error);
      }
    }
  },
  mounted() {
    this.fetchStudents();
  }
};
</script>
