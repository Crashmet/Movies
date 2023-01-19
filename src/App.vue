<template>
  <div id="app">
    <PosterBg :poster="posterBg" />
    <MoviesList :list="moviesList" @changePoster="onChangePoster" />
    <MoviesPagination
      :current-page="currentPage"
      :per-page="moviesPerPage"
      :total="moviesLength"
      @pageChanged="onPageChanged"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import MoviesList from './components/MoviesList.vue';
import PosterBg from './components/PosterBg.vue';
import MoviesPagination from './components/MoviesPagination.vue';

export default {
  name: 'App',
  components: {
    MoviesList,
    PosterBg,
    MoviesPagination,
  },
  data: () => ({
    posterBg: '',
  }),
  // created() {
  //   if (this.$route.query.page) {
  //     this.changeCurrentPage(Number(this.$route.query.page));
  //   }
  // если есть сохраненный номер страницы в адресной строке, то мы ее используем для востановления сессии
  // },
  computed: {
    ...mapGetters('movies', [
      'moviesList',
      'currentPage',
      'moviesPerPage',
      'moviesLength',
    ]),
  },
  watch: {
    '$route.query': {
      handler: 'onPageQueryChange',
      immediate: true,
      // разрешено следить за изменениями и реагировать
      deep: true,
      // разрешено следить за внутреними изменениями и на них реагировать
    },
  },
  methods: {
    ...mapActions('movies', ['changeCurrentPage']),

    onChangePoster(poster) {
      this.posterBg = poster;
    },

    onPageQueryChange({ page = 1 }) {
      // диструктурируем полученое значение и устанавливаем базовое
      this.changeCurrentPage(Number(page));
    },

    onPageChanged(page) {
      this.$router.push({ query: { page } });
      // при помощи Vue.router изменяем location адресной строки и сохраняем ее
    },
  },
};
</script>

<style>
#app {
  position: relative;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
