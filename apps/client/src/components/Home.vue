<script setup lang="ts">
import router from "../router";

const formData = {
  battlefieldSize: null,
  diamondsCount: null,
};
let errorMessage = "";

async function sendData() {
  // Представим, что это берётся из переменной среды
  const response = await fetch("http://localhost:3000/game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    errorMessage = responseBody.message;

    return;
  }

  await router.push({path: `game/${responseBody.gameId}`})
}
</script>

<template>
  <div>
    <form @submit.prevent="sendData">
      <div>
        <label for="battlefieldSize">Размер поля:</label>
        <input
            id="battlefieldSize"
            type="number"
            v-model.number="formData.battlefieldSize"
            required
            min="2"
        />
      </div>
      <div>
        <label for="diamondsCount">Кол-во алмазов:</label>
        <input
            id="diamondsCount"
            type="number"
            v-model.number="formData.diamondsCount"
            required
            min="1"
        />
      </div>
      <button type="submit">Начать игру</button>
    </form>
    <div v-if="errorMessage" class="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
form {
  margin-bottom: 20px;
}

.errorMessage {
  color: red;
}
</style>