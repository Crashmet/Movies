<template>
  <header class="header">
    <BNavbar type="dark" class="navbar" variant="dark">
      <BContainer>
        <BNavbarBrand href="#">
          <b-icon icon="film"></b-icon>I Super MovieDB
        </BNavbarBrand>
        <BNavForm>
          <BFormInput
            class="mr-sm-2 search-input"
            placeholder="Search"
            v-model="searchValue"
            @submit.native.prevent="searchValue"
            debounce="500"
          ></BFormInput>
        </BNavForm>
      </BContainer>
    </BNavbar>
  </header>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'HeaderMain',
  data: () => ({
    searchValue: '',
  }),
  watch: {
    searchValue: 'onSearchValueChanged',
  },
  methods: {
    ...mapActions('movies', [
      'searchMovies',
      'fetchMovies',
      'toggleSearchState',
    ]),
    onSearchValueChanged(val) {
      if (val) {
        this.searchMovies(val);
        // если есть в поиске что то выводим
        this.toggleSearchState(true);
        // метод меняет текст у загаловка списка фильмов, в зависимости от того вводит ли пользователь чтото в импут или нет
      } else {
        this.fetchMovies();
        // если нет загружаем заного список
        this.toggleSearchState(false);
      }
    },
  },
};
</script>

<style scoped>
li {
  list-style-type: none; /* Убираем маркеры */
}
.header {
  margin-bottom: 30px;
}

.navbar {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

.search-input {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(0, 0, 0, 0.6);
}

:focus {
  box-shadow: none;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(0, 0, 0, 0.6);
}
</style>
