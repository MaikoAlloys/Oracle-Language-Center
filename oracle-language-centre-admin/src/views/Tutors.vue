<template>
  <div>
    <h2>All Tutors</h2>
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Full Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tutor in tutors" :key="tutor.id">
          <td>{{ tutor.username }}</td>
          <td>{{ tutor.Firstname }} {{ tutor.Lastname }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tutors: [],
    };
  },
  methods: {
    async fetchTutors() {
      try {
        const response = await axios.get("http://localhost:5000/admin/tutors");
        this.tutors = response.data;
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    },
  },
  mounted() {
    this.fetchTutors();
  },
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
</style>
