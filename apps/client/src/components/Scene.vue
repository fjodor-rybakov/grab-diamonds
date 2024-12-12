<script setup lang="ts">
import {io} from "socket.io-client";
import {useRoute} from "vue-router";
import Grid from "./Grid.vue";
import {ref} from "vue";

export type Grid = (string | null)[][];

type Cell = {
  isDiamond?: boolean;
  adjacentDiamonds?: number;
  isOpened: boolean;
};

type Field = Cell[][];

type GameInfo = {
  battlefieldSize: number;
  diamondsCount: number;
  makingMovePlayerId: string;
  battlefield: Field;
}

let grid = ref<Grid>([]);

const route = useRoute();

const gameId = route.params.gameId;
let size = ref(0);
let errorMessage = ref<string | null>(null);

// Будем считать, что это берётся с переменной среды
const socket = io("http://localhost:3000/game-events", {
  transports: ["websocket"],
  autoConnect: true,
});

function prefillCells(battlefield: Field): void {
  for (let rowIndex = 0; rowIndex < battlefield.length; rowIndex++) {
    for (let colIndex = 0; colIndex < battlefield[rowIndex].length; colIndex++) {
      const {isDiamond, adjacentDiamonds, isOpened} = battlefield[rowIndex][colIndex];

      if (isOpened) {
        grid.value[rowIndex][colIndex] = isDiamond ? '*' : adjacentDiamonds && adjacentDiamonds !== 0 ? adjacentDiamonds.toString() : '';
      }
    }
  }
}

// TODO: Добавить отписки после завершения игры и выход на страницу игр
function onCellClick(rowIndex: number, colIndex: number): void {
  socket.emit("openCell", {
    gameId,
    x: colIndex,
    y: rowIndex,
  });
}

socket.on('connect', function () {
  console.log('Connected');

  socket.emit("joinGame", {gameId}, (response: GameInfo) => {
    size.value = response.battlefieldSize;

    grid.value = Array.from({length: response.battlefieldSize}, () =>
        Array(response.battlefieldSize).fill(null)
    );

    prefillCells(response.battlefield);
  });

  socket.on('openCell', (response: GameInfo) => {
    prefillCells(response.battlefield);

    errorMessage.value = null;
  });

  socket.on('gameIsOver', (response: { winnerClientId: string; }) => {
    alert(socket.id === response.winnerClientId ? 'You are winner!' : 'You are loose');

    errorMessage.value = null;
  });
});
socket.on('exception', function (data) {
  errorMessage.value = data.message;
});
socket.on('disconnect', function () {
  console.log('Disconnected');
});

</script>

<template>
  <Grid v-if="size > 0" :grid="grid" :size="size" :onCellClick="onCellClick" :errorMessage="errorMessage"/>
</template>

<style scoped>

</style>