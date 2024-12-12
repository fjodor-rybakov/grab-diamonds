<script setup lang="ts">
import {computed} from "vue";
import {Grid} from "./Scene.vue";

const props = defineProps<{
  size: number;
  grid: Grid;
  errorMessage: string | null;
  onCellClick: (rowIndex: number, colIndex: number) => void;
}>();

const {size = 2, onCellClick, grid} = props;

const gridStyle = computed(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${size}, 40px)`,
  gridTemplateRows: `repeat(${size}, 40px)`,
  gap: "2px",
  justifyContent: "center",
}));

</script>

<template>
  <div>
    <h1>Соберите как можно больше алмазов</h1>
    <div class="grid" :style="gridStyle">
      <div
          v-for="(row, rowIndex) in grid"
          :key="rowIndex"
          class="row"
      >
        <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            v-bind:class="(grid[rowIndex][colIndex] !== null)?'cell-opened':'cell'"
            @click="onCellClick(rowIndex, colIndex)"
        >
          {{ cell }}
        </div>
      </div>
    </div>
    <div v-if="errorMessage" class="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.grid {
  margin-top: 20px;
  display: grid;
}

.cell {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.cell:hover {
  background-color: #eaeaea;
}

.cell-opened {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eaeaea;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.errorMessage {
  color: red;
}
</style>