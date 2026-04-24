<template>
    <header id="header">
        <div class="logo">
            <router-link to="/" class="logo-link" exact-active-class="logo-active">
                Calculator
            </router-link>
        </div>

        <!-- BOUTON HAMBURGER -->
        <div class="hamburger" @click="toggleMenu">☰</div>

        <!-- NAVBAR -->
        <div class="navbar" :class="{ active: menuOpen }">
            <router-link to="/" @click="closeMenu">Calcul avec bulletins</router-link>
            <router-link to="/calcul_sans_bulletins" @click="closeMenu"
                >Calcul sans bulletins</router-link
            >
            <router-link to="/formules" @click="closeMenu">Formules de calcules</router-link>
            <div class="switcher" title="Afficher directement les résultats">
                <span></span>
                <label class="switch">
                    <input type="checkbox" @change="handleToggle" />
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    </header>
</template>

<script setup>
    import { ref, defineEmits } from 'vue'

    const menuOpen = ref(false)

    const emit = defineEmits(['toggle-all'])

    const toggleMenu = () => {
        menuOpen.value = !menuOpen.value
    }

    const closeMenu = () => {
        menuOpen.value = false
    }

    const handleToggle = event => {
        emit('toggle-all', event.target.checked)
    }
</script>

<style>
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        height: 70px;
        background-color: #eee;
        position: relative;
        z-index: 10;
    }

    /* LOGO */
    .logo a {
        font-size: 22px;
        font-weight: bold;
        color: black !important;
        text-decoration: none;
        transition: 0.3s ease-in-out;
    }

    /* NAVBAR DESKTOP */
    .navbar {
        display: flex;
        align-items: center;
        gap: 10px;
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

    /* ACTIVE */
    .router-link-exact-active {
        background-color: darkorange;
        color: white !important;
    }

    /* HAMBURGER (caché en desktop) */
    .hamburger {
        display: none;
        font-size: 26px;
        cursor: pointer;
    }

    /* ===================== */
    /* 📱 RESPONSIVE MOBILE */
    /* ===================== */
    @media (max-width: 768px) {
        .hamburger {
            display: block;
        }
        .navbar {
            position: absolute;
            top: 70px;
            right: 0;
            width: 100%;
            background: #f4f4f4;
            flex-direction: column;
            align-items: flex-start;
            padding: 15px;
            gap: 10px;

            /* caché par défaut */
            display: none;
        }

        .navbar.active {
            display: flex;
        }

        .navbar a {
            width: 100%;
            padding: 10px;
        }
    }
    .logo-active {
        background: transparent !important;
        color: black !important;
    }
    @media (max-width: 1385px) {
        .logo a {
            margin-left: 50px;
        }
    }

    /* The switch - the box around the slider */
    .switch {
        font-size: 12px;
        position: relative;
        display: inline-block;
        width: 3.5em;
        height: 2em;
    }

    /* Hide default HTML checkbox */
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* The slider */
    .slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background: white;
        border-radius: 50px;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    .slider:before {
        position: absolute;
        content: '';
        height: 1.4em;
        width: 1.4em;
        right: 0.3em;
        bottom: 0.3em;
        transform: translateX(150%);
        background-color: #59d102;
        border-radius: inherit;
        transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    .slider:after {
        position: absolute;
        content: '';
        height: 1.4em;
        width: 1.4em;
        left: 0.3em;
        bottom: 0.3em;
        background-color: firebrick;
        border-radius: inherit;
        transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    .switch input:focus + .slider {
        box-shadow: 0 0 1px #59d102;
    }

    .switch input:checked + .slider:before {
        transform: translateY(0);
    }

    .switch input:checked + .slider::after {
        transform: translateX(-150%);
    }
</style>
