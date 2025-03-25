<template>
  <div class="topbar">
    <h2>Admin Panel</h2>
    <input type="text" placeholder="Search..." class="search-box" />
  </div>
</template>

<style>
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
.search-box {
  padding: 5px;
  width: 200px;
  border-radius: 5px;
  border: none;
}
</style>
