<template>
  <header>
    <div class="logo">
      <router-link to="/">Calculator</router-link>
    </div>

    <div class="navbar">
      <router-link to="/" exact>Calcul avec bulletins</router-link>
      <router-link to="/calcul_sans_bulletins">Calculs sans bulletins</router-link>
      <router-link to="/formules">Formules de calcules</router-link>
    </div>
  </header>
</template>

<script setup>
// rien ici
</script>

<style>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  height: 80px;
  background-color: #f4f4f4;
}

.logo a {
  font-size: 24px;
  font-weight: bold;
  color: black !important;
  background-color: transparent !important;
  text-decoration: none;
}

.navbar {
  display: flex;
  align-items: center;
}

.navbar a {
  padding: 8px 15px;
  color: #444;
  text-decoration: none;
  border-radius: 4px;
  transition: 0.2s;
}

.navbar a:hover {
  color: black;
}

/* 🔥 ACTIVE AUTOMATIQUE */
.router-link-exact-active {
  background-color: darkorange;
  color: white !important;
}

.router-link-exact-active:hover {
  color: white;
}
</style>