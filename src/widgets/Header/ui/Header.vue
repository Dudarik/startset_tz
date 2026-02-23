<template>
  <header :class="$style.header">
    <h1 :class="$style.title">Startset TZ</h1>

    <div :class="$style.actions">
      <button :class="$style.btn">+ Добавить стикер</button>
    </div>
  </header>
</template>

<style module lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1rem;
  height: 4rem;
  background: #b3d0ff;
  color: var(--color-text);
  box-shadow: var(--box-shadow-medium);
}

.title {
  font-size: 2rem;
  font-weight: bold;
}

.btn {
  cursor: pointer;
  border: none;

  background: #e4fa95;
  color: var(--color-text);

  box-shadow: var(--box-shadow-medium);

  padding: 0.5rem 1rem;

  border-radius: 0.5rem;

  font-size: 1rem;

  font-weight: bold;

  transition: background 0.3s;

  &:hover {
    background: #f5e44c;
  }
}
</style>
