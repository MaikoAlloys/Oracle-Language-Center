<template>
  <div class="fee-management">
    <h1>Fee Management</h1>

    <!-- Navigation for Payment Method Filtering -->
    <div class="filter-buttons">
      <button @click="filterPayments('all')" :class="{ active: selectedMethod === 'all' }">All Payments</button>
      <button @click="filterPayments('bank')" :class="{ active: selectedMethod === 'bank' }">Bank Payments</button>
      <button @click="filterPayments('mpesa')" :class="{ active: selectedMethod === 'mpesa' }">Mpesa Payments</button>
    </div>

    <!-- Payment Records Table -->
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Student Name</th>
          <th>Course</th>
          <th>Amount Paid (Ksh)</th>
          <th>Balance</th>
          <th>Payment Method</th>
          <th>Reference Code</th>
          <th>Status</th>
          <th>Payment Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(payment, index) in filteredPayments" :key="payment.id">
          <td>{{ index + 1 }}</td>
          <td>{{ payment.first_name }} {{ payment.last_name }}</td>
          <td>{{ payment.course_name }}</td>
          <td>{{ payment.amount_paid }}</td>
          <td>{{ payment.balance }}</td>
          <td>{{ payment.payment_method }}</td>
          <td>{{ payment.reference_code }}</td>
          <td :class="{ pending: payment.status === 'pending', approved: payment.status === 'approved' }">
            {{ payment.status }}
          </td>
          <td>{{ new Date(payment.created_at).toLocaleDateString() }}</td>
        </tr>
        <tr v-if="filteredPayments.length === 0">
          <td colspan="9" class="no-records">No payment records found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default {
  data() {
    return {
      payments: [],
      filteredPayments: [],
      selectedMethod: "all",
    };
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    return { route, router };
  },
  methods: {
    async fetchPayments() {
      try {
        const response = await axios.get("http://localhost:5000/payments");
        this.payments = response.data;
        this.applyFilter();
      } catch (error) {
        console.error("❌ Error fetching payments:", error);
      }
    },
    filterPayments(method) {
      this.selectedMethod = method;
      this.router.push({ path: "/fee-management", query: { method } });
      this.applyFilter();
    },
    applyFilter() {
      const method = this.route.query.method || "all";
      if (method === "all") {
        this.filteredPayments = this.payments;
      } else {
        this.filteredPayments = this.payments.filter(payment => payment.payment_method.toLowerCase() === method);
      }
    },
  },
  watch: {
    "route.query.method"() {
      this.applyFilter();
    },
  },
  mounted() {
    this.fetchPayments();
  },
};
</script>

<style scoped>
.fee-management {
  padding: 20px;
}

h1 {
  text-align: center;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  padding: 10px 15px;
  margin: 5px;
  border: none;
  cursor: pointer;
  background-color: #444;
  color: white;
  border-radius: 5px;
}

button.active {
  background-color: green;
}

button:hover {
  background-color: #666;
}

table {
  width: 68.4vw; /* Reduced by 10% from 76vw */
  max-width: 68.4vw; /* Prevents unnecessary shrinking */
  border-collapse: collapse;
  margin: 0 auto; /* Centers the table */
}




table, th, td {
  border: 1px solid #ddd;
  padding: 10px;
}

th {
  background-color: #f4f4f4;
}

.pending {
  color: orange;
}

.approved {
  color: green;
}

.no-records {
  text-align: center;
  font-style: italic;
}
</style>