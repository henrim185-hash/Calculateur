<template>
    <!-- Bouton hamburger -->
    <button class="menu-toggle" @click="isOpen = !isOpen" :class="{ active: isOpen }">
        <span></span>
        <span></span>
        <span></span>
    </button>

    <!-- Overlay -->
    <div class="overlay" v-if="isOpen" @click="isOpen = false"></div>

    <!-- Drawer -->
    <aside class="sidebar" :class="{ open: isOpen }">
        <nav>
            <ul>
                <li><a href="#header" @click="isOpen = false">Entête</a></li>
                <li><a href="#info-salarie" @click="isOpen = false">Informations du salarié</a></li>
                <li><a href="#salaires" @click="isOpen = false">Salaires 12 mois</a></li>
                <li>
                    <a href="#indemnite-licenciement" @click="isOpen = false"
                        >Indemnité licenciement</a
                    >
                </li>
                <li><a href="#conges-payes" @click="isOpen = false">Congés payés</a></li>
                <li><a href="#preavis" @click="isOpen = false">Indemnité préavis</a></li>
                <li>
                    <a href="#aggravation-preavis" @click="isOpen = false">Aggravation préavis</a>
                </li>
                <li><a href="#gratification" @click="isOpen = false">Gratification</a></li>
                <li><a href="#rappel-prime" @click="isOpen = false">Rappel prime ancienneté</a></li>
                <li>
                    <a href="#recapitulatif" @click="isOpen = false">Récapitulatif Indemnités</a>
                </li>
                <li>
                    <a href="#dommages-licenciement-abusif" @click="isOpen = false"
                        >Licenciement abusif</a
                    >
                </li>
                <li><a href="#dommages-cnps" @click="isOpen = false">Dommages CNPS</a></li>
                <li>
                    <a href="#dommages-certificat" @click="isOpen = false">Certificat de travail</a>
                </li>
                <li><a href="#dommages-releve" @click="isOpen = false">Relevé nominatif</a></li>
            </ul>
        </nav>
    </aside>
</template>

<script setup>
    import { ref } from 'vue'
    const isOpen = ref(false)
</script>

<style scoped>
    /* ---- Bouton hamburger ---- */
    .menu-toggle {
        display: none;
        position: fixed;
        top: 15px;
        left: 15px;
        z-index: 1000;
        background: #e67e22;
        border: none;
        border-radius: 8px;
        padding: 10px;
        cursor: pointer;
        flex-direction: column;
        gap: 5px;
        width: 42px;
        height: 42px;
        justify-content: center;
        align-items: center;
    }

    .menu-toggle span {
        display: block;
        width: 22px;
        height: 2px;
        background: white;
        border-radius: 2px;
        transition: all 0.3s;
    }

    .menu-toggle.active span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
    }
    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    .menu-toggle.active span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
    }

    /* ---- Overlay ---- */
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 998;
    }

    /* ---- Sidebar (grand écran) ---- */
    .sidebar {
        position: fixed;
        top: 100px;
        left: 20px;
        width: 220px;
        background: #f9f9f9;
        border: 1px solid #e67e22;
        padding: 15px;
        border-radius: 8px;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 999;
    }

    .sidebar ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .sidebar li {
        margin-bottom: 15px;
    }

    .sidebar a {
        text-decoration: none;
        color: #333;
        font-weight: 500;
    }

    .sidebar a:hover {
        color: #e67e22;
    }

    /* ---- Petit écran ---- */
    @media (max-width: 1385px) {
        .menu-toggle {
            display: flex;
        }

        .sidebar {
            top: 0;
            left: -260px;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0 8px 8px 0;
            transition: left 0.3s ease;
            opacity: 0;
        }

        .sidebar.open {
            left: 0;
            opacity: 1;
        }
    }

    .menu-toggle {
        transition: left 0.3s ease;
    }

    .menu-toggle.active {
        left: 235px; /* se décale avec le drawer */
    }
</style>
